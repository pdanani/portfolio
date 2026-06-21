import { useEffect, useRef } from 'react'
import { m, useReducedMotion } from 'motion/react'
import { EASE } from '#/lib/motion/variants'

/* Full-screen single-triangle vertex shader. */
const VERT = `#version 100
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`

/* Twilight ocean: dusk sky gradient, fbm swell, horizon, warm sun glint. */
const FRAG = `#version 100
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_fade;

// hash + value noise -> fbm for layered swell
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 6; i++) {
    v += amp * noise(p);
    p = rot * p * 2.02;
    amp *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);

  // horizon low on the screen so the sky dominates (sea ~bottom 30%)
  float horizon = 0.30;
  float t = u_time;

  // ---------- DAY -> DUSK on load (0 = high-noon blue, 1 = dreamy dusk) ----------
  float day = u_fade;                          // JS eases 0 -> 1 over the intro, then holds at 1
  // sky palette lerps from a clear noon blue to the dusk
  vec3 zenith   = mix(vec3(0.16, 0.40, 0.82), vec3(0.045, 0.055, 0.16), day);
  vec3 midSky   = mix(vec3(0.40, 0.62, 0.90), vec3(0.16, 0.10, 0.30), day);
  vec3 horizCol = mix(vec3(0.80, 0.88, 0.96), vec3(0.62, 0.26, 0.34), day);
  float sky = clamp((uv.y - horizon) / (1.0 - horizon), 0.0, 1.0);
  vec3 skyCol = mix(horizCol, midSky, smoothstep(0.0, 0.45, sky));
  skyCol = mix(skyCol, zenith, smoothstep(0.35, 1.0, sky));

  // the sun starts behind the name clouds (centre, high) and arcs down to the dusk horizon
  vec2 sunPos = mix(vec2(0.5, 0.76), vec2(0.62, horizon + 0.018), day);
  vec2 sd = (uv - sunPos);
  sd.x *= aspect;
  float sunDist = length(sd);
  // warm glow halo in the sky — much gentler on load (high-noon) so it isn't harsh,
  // ramping to full strength by the time it reaches the dusk horizon
  float glow = exp(-sunDist * 6.5) * 1.0 + exp(-sunDist * 2.2) * 0.42;
  glow *= 0.38 + 0.62 * day;
  // sun colour warms as it sets: white-hot noon -> warm orange dusk
  vec3 sunCol = mix(vec3(1.0, 0.98, 0.92), vec3(1.0, 0.66, 0.36), day);
  skyCol += sunCol * glow * step(horizon, uv.y);
  // soft sun disc (swells a touch as it nears the horizon; softer + dimmer on load)
  float disc = smoothstep(mix(0.045, 0.058, day), mix(0.024, 0.032, day), sunDist);
  skyCol = mix(skyCol, mix(vec3(0.93, 0.94, 0.92), vec3(1.0, 0.86, 0.66), day), disc * step(horizon, uv.y) * (0.5 + 0.5 * day));

  // ---------- SEA (below horizon) ----------
  // perspective: stretch toward the horizon so waves compress with distance
  float depth = (horizon - uv.y) / horizon;          // 0 at horizon -> 1 at bottom
  depth = max(depth, 0.0001);
  vec2 sea = vec2(uv.x * aspect, 1.0 / (depth * 3.2 + 0.12));
  sea.y += t * 0.18;                                  // swell drifting toward viewer

  // layered moving waves
  float w = fbm(sea * 2.2 + vec2(t * 0.12, 0.0));
  w += 0.5 * fbm(sea * 4.7 - vec2(0.0, t * 0.22));
  w += 0.22 * fbm(sea * 9.0 + vec2(t * 0.3, t * 0.1));
  float wave = w * 0.5;

  // deep water palette lerps from bright noon blue to deep dusk
  vec3 deep = mix(vec3(0.06, 0.20, 0.36), vec3(0.02, 0.05, 0.11), day);
  vec3 shallow = mix(vec3(0.22, 0.44, 0.62), vec3(0.06, 0.16, 0.26), day);
  vec3 seaCol = mix(deep, shallow, smoothstep(0.0, 1.0, 1.0 - depth));
  // crests catch a little sky light
  seaCol += vec3(0.10, 0.09, 0.16) * smoothstep(0.55, 0.95, wave) * (0.4 + 0.6 * (1.0 - depth));

  // reflected horizon band just below the waterline
  seaCol = mix(seaCol, horizCol * 0.7, smoothstep(0.10, 0.0, depth) * 0.7);

  // ---------- SUN GLINT on the water (broad warm reflection; no upward sparkle) ----------
  float column = exp(-pow((uv.x - sunPos.x) * aspect * 3.4, 2.0));
  // broad warm reflection right under the sun
  seaCol += sunCol * column * exp(-depth * 7.0) * 0.5 * day;

  // ---------- COMPOSITE ----------
  float seaMask = step(uv.y, horizon);
  vec3 col = mix(skyCol, seaCol, seaMask);

  // crisp horizon line with a thin warm rim (only as dusk arrives)
  float hl = smoothstep(0.004, 0.0, abs(uv.y - horizon));
  col += sunCol * hl * (0.18 + 0.5 * column) * day;

  // gentle vignette for cinematic framing
  vec2 vig = uv - 0.5;
  col *= 1.0 - dot(vig, vig) * 0.55;

  // subtle filmic lift + tone
  col = pow(max(col, 0.0), vec3(0.92));

  gl_FragColor = vec4(col, 1.0);
}`

/** Ocean Waves — raw WebGL twilight sea (fbm swell + sun glint) behind the overlay. */
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
      cancelAnimationFrame(raf) // no-op when raf is 0
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
        (canvas.getContext(
          'experimental-webgl',
        ) as WebGLRenderingContext | null)
      if (!gl) return // leave canvas hidden -> CSS fallback shows

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

      // full-screen triangle
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
      const uFade = context.getUniformLocation(program, 'u_fade')

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

      const render = (seconds: number, fade: number) => {
        context.uniform1f(uTime, seconds)
        context.uniform1f(uFade, fade)
        context.drawArrays(context.TRIANGLES, 0, 3)
      }

      resize()
      window.addEventListener('resize', resize)

      // success: reveal the canvas (CSS fallback stays underneath as a safety net)
      canvas.style.opacity = '1'

      if (reduce) {
        // settle straight into dusk, skip the noon -> dusk arc
        render(7.5, 1)
      } else {
        const start = performance.now()
        const ARC_S = 1.5 // length of the noon -> dusk intro
        const loop = (now: number) => {
          if (disposed) return
          resize()
          const elapsed = (now - start) / 1000
          const p = Math.min(1, elapsed / ARC_S)
          const day = p * p * (3 - 2 * p) // smoothstep easing of the sun's descent
          render(elapsed, day)
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
      // any GL failure -> keep canvas hidden so the CSS sea/sky shows
      cleanup()
      return
    }
  }, [reduce])

  // hold the overlay copy until the sun has (mostly) set, so the noon -> dusk
  // arc plays as the intro/loader and the text fades in once it lands
  const INTRO = 1.5
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduce ? 0.01 : 0.7,
      ease: EASE,
      delay: reduce ? 0 : INTRO + delay,
    },
  })

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background">
      {/* CSS fallback sea + sky (always rendered, sits behind the canvas) */}
      <div
        aria-hidden
        className="waves-fallback pointer-events-none absolute inset-0 -z-20"
      />

      {/* WebGL ocean — starts hidden, revealed only on successful compile */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
        style={{ opacity: 0 }}
      />

      {/* bottom-up scrim for text legibility over the water */}
      <div
        aria-hidden
        className="waves-scrim pointer-events-none absolute inset-0 -z-10"
      />

      {/* the name spelled in soft clouds — SVG "gooey" filter (turbulence ->
          blur -> alpha-contrast) rounds the letters into puffy blobs, with a
          haze halo behind and a top-lit white->grey gradient for volume */}
      <m.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[12%] z-[1]"
        initial={
          reduce
            ? { opacity: 0 }
            : { opacity: 0, filter: 'blur(18px)', scale: 1.05, y: 12 }
        }
        animate={{ opacity: 1, filter: 'blur(0px)', scale: 1, y: 0 }}
        transition={{ duration: reduce ? 0.01 : 1.8, ease: EASE, delay: reduce ? 0 : 0.3 }}
      >
        <div className="mx-auto max-w-6xl px-6">
          <svg viewBox="0 0 1200 280" className="w-full">
          <defs>
            <filter
              id="waves-cloud"
              x="-20%"
              y="-90%"
              width="140%"
              height="300%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.009 0.013"
                numOctaves={3}
                seed={6}
                result="n"
              />
              <feDisplacementMap in="SourceGraphic" in2="n" scale={15} result="d" />
              <feGaussianBlur in="d" stdDeviation={5} result="b" />
              <feColorMatrix
                in="b"
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"
                result="goo"
              />
              <feGaussianBlur in="goo" stdDeviation={1} />
            </filter>
            <filter
              id="waves-cloud-haze"
              x="-40%"
              y="-160%"
              width="180%"
              height="420%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur stdDeviation={14} />
            </filter>
            <linearGradient id="waves-cloud-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="55%" stopColor="#eef2f8" />
              <stop offset="100%" stopColor="#c1cad9" />
            </linearGradient>
          </defs>
          {/* soft haze halo */}
          <text
            x="600"
            y="196"
            textAnchor="middle"
            textLength="1080"
            lengthAdjust="spacingAndGlyphs"
            fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
            fontSize="162"
            fill="#ffffff"
            opacity="0.3"
            filter="url(#waves-cloud-haze)"
          >
            Pawan Danani
          </text>
          {/* puffy cloud body */}
          <text
            x="600"
            y="196"
            textAnchor="middle"
            textLength="1080"
            lengthAdjust="spacingAndGlyphs"
            fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
            fontSize="162"
            fill="url(#waves-cloud-fill)"
            filter="url(#waves-cloud)"
          >
            Pawan Danani
          </text>
        </svg>
        </div>
      </m.div>

      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 pb-16 pt-24 sm:pb-24">
        <m.p
          {...rise(0.05)}
          className="font-mono text-xs uppercase tracking-[0.42em] text-brand-amber sm:text-sm"
        >
          Backend Engineer
        </m.p>

        {/* the name is spelled by the clouds in the sky — kept here for a11y/SEO */}
        <h1 className="sr-only">Pawan Danani</h1>

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
