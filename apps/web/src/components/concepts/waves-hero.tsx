import { useEffect, useRef } from 'react'
import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

/* Full-screen single-triangle vertex shader. */
const VERT = `#version 100
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`

/* Twilight ocean: real Gerstner-style waves (peaked crests), surface normals,
   Fresnel sky reflection, sun specular glints + foam — not noise blobs. */
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

// Sum of directional trochoidal waves -> sharp crests, smooth troughs.
float waveH(vec2 p, float t){
  float h = 0.0, amp = 0.6, sum = 0.0, freq = 0.8, sp = 0.9;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++){
    vec2 dir = vec2(cos(float(i) * 1.7 + 0.6), sin(float(i) * 1.7 + 0.6));
    float ph = dot(p, dir) * freq + t * sp;
    float w = exp(sin(ph) - 1.0);                       // peaked crest
    w *= 0.85 + 0.15 * noise(p * freq * 0.6 + t * 0.1); // a little chop
    h += w * amp; sum += amp;
    amp *= 0.62; freq *= 1.7; sp *= 1.18; p = m * p;
  }
  return h / sum;
}

void main(){
  vec2 frag = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  float t = u_time * 0.8;
  float horizon = 0.6;

  vec2 sunPos = vec2(0.66, horizon + 0.02);
  vec3 zenith = vec3(0.04, 0.05, 0.16);
  vec3 violet = vec3(0.16, 0.10, 0.30);
  vec3 rose   = vec3(0.66, 0.28, 0.34);
  vec3 sunCol = vec3(1.0, 0.62, 0.32);

  vec3 col;

  if (frag.y >= horizon){
    // ---------- SKY ----------
    float s = (frag.y - horizon) / (1.0 - horizon);
    col = mix(rose, violet, smoothstep(0.0, 0.45, s));
    col = mix(col, zenith, smoothstep(0.35, 1.0, s));
    vec2 sd = (frag - sunPos); sd.x *= aspect;
    float sdl = length(sd);
    col += sunCol * (exp(-sdl * 7.0) * 1.1 + exp(-sdl * 2.2) * 0.4);
    col = mix(col, vec3(1.0, 0.84, 0.6), smoothstep(0.05, 0.028, sdl));
  } else {
    // ---------- SEA (perspective plane) ----------
    float dy = horizon - frag.y;                 // 0 at horizon -> 0.6 at bottom
    float dist = 1.0 / (dy + 0.02);
    vec2 wp = vec2((frag.x - 0.5) * aspect * dist, dist) * 0.35;
    wp.y -= t * 0.5;                             // swell rolls toward viewer
    float detail = smoothstep(0.0, 0.14, dy);    // flatten near horizon (anti-alias)

    // height + analytic-ish normal via finite differences
    float e = 0.05 * (0.4 + dy);
    float h  = waveH(wp, t);
    float hx = waveH(wp + vec2(e, 0.0), t);
    float hz = waveH(wp + vec2(0.0, e), t);
    float ns = 2.1 * detail;
    vec3 N = normalize(vec3((h - hx) / e * ns, 1.0, (h - hz) / e * ns));

    vec3 V = normalize(vec3((frag.x - 0.5) * aspect, 0.4, -1.0));
    vec3 L = normalize(vec3(sunPos.x - 0.5, 0.14, -0.6));

    float near = smoothstep(0.0, 0.5, dy);
    vec3 deep = vec3(0.012, 0.045, 0.095);
    vec3 shallow = vec3(0.05, 0.14, 0.22);
    vec3 water = mix(shallow, deep, near);

    // Fresnel sky reflection on the wave faces
    float fres = pow(1.0 - max(dot(N, vec3(0.0, 1.0, 0.0)), 0.0), 3.0);
    fres = mix(0.04, 1.0, fres);
    float colDist = length((frag - sunPos));
    vec3 skyRefl = mix(rose, violet, 0.45) + sunCol * exp(-colDist * 3.0) * 0.6;
    col = mix(water, skyRefl, clamp(fres * 0.6, 0.0, 1.0));

    // sun specular glints on wave faces (Blinn-Phong)
    vec3 Hn = normalize(L + V);
    float spec = pow(max(dot(N, Hn), 0.0), 60.0);
    float column = exp(-pow((frag.x - sunPos.x) * aspect * 2.2, 2.0));
    col += sunCol * spec * (0.7 + 1.6 * column) * detail;
    // warm glitter concentrated in the sun column
    col += sunCol * smoothstep(0.62, 1.0, h) * column * (1.0 - near) * detail;

    // foam on the steep crests
    float foam = smoothstep(0.8, 0.96, h) * (0.35 + 0.65 * near) * detail;
    col = mix(col, vec3(0.9, 0.92, 0.95), foam * 0.55);

    // reflected dusk band hugging the horizon
    col = mix(col, rose * 0.7, smoothstep(0.07, 0.0, dy) * 0.6);
  }

  // crisp horizon rim
  float hl = smoothstep(0.004, 0.0, abs(frag.y - horizon));
  col += sunCol * hl * 0.3;

  // cinematic vignette + tone
  vec2 vig = frag - 0.5;
  col *= 1.0 - dot(vig, vig) * 0.5;
  col = pow(max(col, 0.0), vec3(0.92));

  gl_FragColor = vec4(col, 1.0);
}`

/** Ocean Waves — raw WebGL twilight sea (Gerstner waves + lit normals) behind the overlay. */
export function WavesHero() {
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

  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0.01 : 0.7, ease: EASE, delay },
  })

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background">
      <div
        aria-hidden
        className="waves-fallback pointer-events-none absolute inset-0 -z-20"
      />
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
        style={{ opacity: 0, transition: 'opacity 0.6s ease' }}
      />
      <div
        aria-hidden
        className="waves-scrim pointer-events-none absolute inset-0 -z-10"
      />

      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 pb-16 pt-24 sm:pb-24">
        <m.p
          {...rise(0.05)}
          className="font-mono text-xs uppercase tracking-[0.42em] text-brand-amber sm:text-sm"
        >
          Backend Engineer
        </m.p>

        <m.h1
          {...rise(0.16)}
          className="waves-title mt-5 font-display text-6xl font-semibold tracking-tight text-foreground sm:text-8xl"
        >
          Pawan Danani
        </m.h1>

        <m.p
          {...rise(0.28)}
          className="mt-6 max-w-xl text-base leading-relaxed text-foreground/85 sm:text-lg"
        >
          I build resilient distributed systems that stay afloat under load —
          <span className="text-brand-amber"> Spring Boot</span>,
          <span className="text-foreground"> Postgres</span>,
          <span className="text-brand-cyan"> Redis</span> and
          <span className="text-foreground"> Kafka</span>, engineered for
          failure and tuned for the storm.
        </m.p>

        <m.div {...rise(0.4)} className="mt-10 flex flex-wrap gap-4">
          <a
            href="#"
            className="rounded-[0.4rem] bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            style={{
              boxShadow:
                '0 8px 30px color-mix(in oklab, var(--primary) 45%, transparent)',
            }}
          >
            View projects
          </a>
          <a
            href="#"
            className="waves-glass rounded-[0.4rem] border border-border px-7 py-3 text-sm font-medium text-foreground transition hover:bg-accent"
          >
            About
          </a>
        </m.div>
      </div>
    </main>
  )
}
