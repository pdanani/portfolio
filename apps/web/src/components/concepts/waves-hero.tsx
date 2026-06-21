import { useEffect, useRef } from 'react'
import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

/* Full-screen single-triangle vertex shader. */
const VERT = `#version 100
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`

/* Twilight ocean — FIXED camera looking out to sea. The waves are layered
   swell bands (back near the horizon -> tall ones up front) that roll sideways
   and rise/fall in place. No forward perspective scroll (no "flying"). */
const FRAG = `#version 100
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;

// peaked wave profile in [-1,1]: a few sines so crests aren't uniform
float prof(float x){
  float v = sin(x) + 0.45 * sin(x * 2.1 + 1.3) + 0.2 * sin(x * 4.3 + 0.7);
  return v / 1.65;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;          // y up
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  float x = (uv.x - 0.5) * aspect;                      // centered, no perspective
  float t = u_time;
  float horizon = 0.62;

  vec3 zenith = vec3(0.04, 0.05, 0.16);
  vec3 violet = vec3(0.16, 0.10, 0.30);
  vec3 rose   = vec3(0.66, 0.28, 0.34);
  vec3 sunCol = vec3(1.0, 0.62, 0.32);
  float sunX  = 0.16 * aspect;                          // sun a little right of center

  // ---------- SKY ----------
  float s = clamp((uv.y - horizon) / (1.0 - horizon), 0.0, 1.0);
  vec3 col = mix(rose, violet, smoothstep(0.0, 0.4, s));
  col = mix(col, zenith, smoothstep(0.3, 1.0, s));
  float sd = length(vec2(x - sunX, (uv.y - horizon)));
  col += sunCol * (exp(-sd * 7.0) * 1.0 + exp(-sd * 2.6) * 0.35);
  col = mix(col, vec3(1.0, 0.84, 0.6), smoothstep(0.05, 0.028, sd));

  // ---------- WAVE LAYERS (back near horizon -> tall front) ----------
  float column = exp(-pow((x - sunX) * 1.5, 2.0));      // sun reflection column
  for (int i = 0; i < 6; i++){
    float f = float(i) / 5.0;                           // 0 back .. 1 front
    float base = horizon - f * (horizon + 0.04);        // horizon down past the bottom
    float amp  = mix(0.016, 0.11, f * f);               // GOOD height up front
    float freq = mix(9.0, 3.0, f);                      // long swell up front
    float dir  = mod(float(i), 2.0) < 0.5 ? 1.0 : -1.0; // alternate roll for life
    float spd  = mix(0.35, 0.85, f) * dir;
    float ph   = x * freq + spd * t + float(i) * 2.1;
    float p    = prof(ph);
    float yc   = base + amp * p;                         // wave surface (screen y)

    if (uv.y < yc){
      float d = yc - uv.y;                               // depth below this crest
      vec3 deep = mix(vec3(0.12, 0.23, 0.31), vec3(0.015, 0.05, 0.10), f);
      vec3 wc = deep * (1.0 - clamp(d * 1.5, 0.0, 0.5)); // darker lower in the wave
      // bright rim along the crest edge — catches dusk + sun
      float rim = smoothstep(0.016, 0.0, d);
      wc += rim * (mix(violet, rose, 0.5) * 0.7 + vec3(0.05)) * (0.5 + 0.5 * (1.0 - f));
      wc += sunCol * rim * column * (1.1 + 1.6 * f);     // warm glint on crests near the sun
      // foam on the sharpest crest tips
      float foam = smoothstep(0.74, 0.98, p) * rim;
      wc = mix(wc, vec3(0.86, 0.89, 0.93), foam * 0.5);
      col = wc;                                          // front layer overwrites the back
    }
  }

  // horizon glow rim
  float hl = smoothstep(0.004, 0.0, abs(uv.y - horizon));
  col += sunCol * hl * 0.25;

  // cinematic vignette + tone
  vec2 vig = uv - 0.5;
  col *= 1.0 - dot(vig, vig) * 0.45;
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
