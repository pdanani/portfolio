import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'

/* Reusable raw-WebGL twilight ocean (same shader as the Ocean Waves kit): dusk
   sky + fbm swell + sun glint, with a CSS sea/sky fallback. Renders as a fixed
   full-bleed background (place inside a `relative` parent). */
const VERT = `#version 100
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }`

const FRAG = `#version 100
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0,0.0)), u.x),
             mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0; float amp = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 6; i++){ v += amp * noise(p); p = rot * p * 2.02; amp *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  float horizon = 0.58;
  float t = u_time;

  float sky = clamp((uv.y - horizon) / (1.0 - horizon), 0.0, 1.0);
  vec3 zenith = vec3(0.045, 0.055, 0.16);
  vec3 midSky = vec3(0.16, 0.10, 0.30);
  vec3 dusk   = vec3(0.62, 0.26, 0.34);
  vec3 skyCol = mix(dusk, midSky, smoothstep(0.0, 0.45, sky));
  skyCol = mix(skyCol, zenith, smoothstep(0.35, 1.0, sky));

  vec2 sunPos = vec2(0.62, horizon + 0.018);
  vec2 sd = (uv - sunPos); sd.x *= aspect;
  float sunDist = length(sd);
  float glow = exp(-sunDist * 6.5) * 1.1 + exp(-sunDist * 2.2) * 0.45;
  vec3 sunCol = vec3(1.0, 0.72, 0.42);
  skyCol += sunCol * glow * step(horizon, uv.y);
  float disc = smoothstep(0.055, 0.03, sunDist);
  skyCol = mix(skyCol, vec3(1.0, 0.86, 0.66), disc * step(horizon, uv.y));

  float depth = (horizon - uv.y) / horizon; depth = max(depth, 0.0001);
  vec2 sea = vec2(uv.x * aspect, 1.0 / (depth * 3.2 + 0.12));
  sea.y += t * 0.18;
  float w = fbm(sea * 2.2 + vec2(t * 0.12, 0.0));
  w += 0.5 * fbm(sea * 4.7 - vec2(0.0, t * 0.22));
  w += 0.22 * fbm(sea * 9.0 + vec2(t * 0.3, t * 0.1));
  float wave = w * 0.5;
  vec3 deep = vec3(0.02, 0.05, 0.11);
  vec3 shallow = vec3(0.06, 0.16, 0.26);
  vec3 seaCol = mix(deep, shallow, smoothstep(0.0, 1.0, 1.0 - depth));
  seaCol += vec3(0.10, 0.09, 0.16) * smoothstep(0.55, 0.95, wave) * (0.4 + 0.6 * (1.0 - depth));
  seaCol = mix(seaCol, dusk * 0.7, smoothstep(0.10, 0.0, depth) * 0.7);

  float column = exp(-pow((uv.x - sunPos.x) * aspect * 3.4, 2.0));
  float fall = smoothstep(0.0, 0.55, depth);
  float shimmer = fbm(vec2(uv.x * aspect * 6.0, uv.y * 26.0 - t * 1.6));
  float sparkle = smoothstep(0.62, 0.95, shimmer) * column * (1.0 - fall);
  seaCol += sunCol * sparkle * 1.6;
  seaCol += sunCol * column * exp(-depth * 7.0) * 0.5;

  float seaMask = step(uv.y, horizon);
  vec3 col = mix(skyCol, seaCol, seaMask);
  float hl = smoothstep(0.004, 0.0, abs(uv.y - horizon));
  col += sunCol * hl * (0.18 + 0.5 * column);
  vec2 vig = uv - 0.5;
  col *= 1.0 - dot(vig, vig) * 0.55;
  col = pow(max(col, 0.0), vec3(0.92));
  gl_FragColor = vec4(col, 1.0);
}`

const FALLBACK_BG =
  'radial-gradient(120% 70% at 62% 58%, oklch(0.78 0.13 70 / 0.55) 0%, transparent 42%),' +
  'linear-gradient(to bottom, oklch(0.12 0.05 270) 0%, oklch(0.2 0.07 285) 30%, oklch(0.5 0.14 25) 55%, oklch(0.58 0.13 30) 58%, oklch(0.18 0.06 250) 60%, oklch(0.1 0.05 245) 78%, oklch(0.06 0.04 245) 100%)'

export function OceanShader() {
  const reduce = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let gl: WebGLRenderingContext | null = null
    let program: WebGLProgram | null = null
    let buffer: WebGLBuffer | null = null
    let disposed = false

    const cleanup = () => {
      cancelAnimationFrame(raf)
      raf = 0
      if (gl) {
        if (buffer) gl.deleteBuffer(buffer)
        if (program) gl.deleteProgram(program)
        const lose = gl.getExtension('WEBGL_lose_context')
        if (lose) lose.loseContext()
      }
      gl = null
    }

    try {
      gl =
        canvas.getContext('webgl', { antialias: true, alpha: false }) ??
        (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null)
      if (!gl) return
      const context = gl

      const compile = (type: number, src: string): WebGLShader | null => {
        const shader = context.createShader(type)
        if (!shader) return null
        context.shaderSource(shader, src)
        context.compileShader(shader)
        if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
          context.deleteShader(shader)
          return null
        }
        return shader
      }

      const vs = compile(context.VERTEX_SHADER, VERT)
      const fs = compile(context.FRAGMENT_SHADER, FRAG)
      if (!vs || !fs) {
        cleanup()
        return
      }
      program = context.createProgram()
      context.attachShader(program, vs)
      context.attachShader(program, fs)
      context.linkProgram(program)
      context.deleteShader(vs)
      context.deleteShader(fs)
      if (!context.getProgramParameter(program, context.LINK_STATUS)) {
        cleanup()
        return
      }
      context.useProgram(program)

      buffer = context.createBuffer()
      context.bindBuffer(context.ARRAY_BUFFER, buffer)
      context.bufferData(
        context.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        context.STATIC_DRAW,
      )
      const loc = context.getAttribLocation(program, 'a_pos')
      context.enableVertexAttribArray(loc)
      context.vertexAttribPointer(loc, 2, context.FLOAT, false, 0, 0)

      const uTime = context.getUniformLocation(program, 'u_time')
      const uRes = context.getUniformLocation(program, 'u_resolution')

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const w = Math.max(1, Math.floor(canvas.clientWidth * dpr))
        const h = Math.max(1, Math.floor(canvas.clientHeight * dpr))
        if (canvas.width !== w || canvas.height !== h) {
          canvas.width = w
          canvas.height = h
        }
        context.viewport(0, 0, canvas.width, canvas.height)
        context.uniform2f(uRes, canvas.width, canvas.height)
      }
      const render = (seconds: number) => {
        context.uniform1f(uTime, seconds)
        context.drawArrays(context.TRIANGLES, 0, 3)
      }

      resize()
      window.addEventListener('resize', resize)
      canvas.style.opacity = '1'

      if (reduce) {
        render(7.5)
      } else {
        const start = performance.now()
        const loop = (now: number) => {
          if (disposed) return
          resize()
          render((now - start) / 1000)
          raf = requestAnimationFrame(loop)
        }
        raf = requestAnimationFrame(loop)
      }

      return () => {
        disposed = true
        window.removeEventListener('resize', resize)
        cleanup()
      }
    } catch {
      cleanup()
      return
    }
  }, [reduce])

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
        style={{ background: FALLBACK_BG }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
        style={{ opacity: 0, transition: 'opacity 0.6s ease' }}
      />
    </>
  )
}
