import { useEffect, useRef } from 'react'
import { m, useReducedMotion } from 'motion/react'
import { ChevronDown, Github, Linkedin, Mail } from 'lucide-react'
import { EASE } from '#/lib/motion/variants'
import { PROFILE } from '#/data/profile'
import { scrollToAnchor } from '#/lib/scroll'

/* Full-screen single-triangle vertex shader. */
const VERT = `#version 100
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`

/* Twilight ocean: dusk sky gradient, fbm swell, horizon, warm sun glint.
   highp is not guaranteed in fragment shaders on older mobile GPUs, so fall
   back to mediump there instead of failing to compile. */
const FRAG = `#version 100
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
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

  // the sun starts behind the name clouds (centre, high) and arcs down to the
  // dusk horizon, landing right of centre so it clears the mobile CTA
  vec2 sunPos = mix(vec2(0.66, 0.62), vec2(0.78, horizon + 0.018), day);
  vec2 sd = (uv - sunPos);
  sd.x *= aspect;
  float sunDist = length(sd);
  // warm glow halo in the sky — gentle at noon, full strength by dusk
  float glow = exp(-sunDist * 6.5) * 1.0 + exp(-sunDist * 2.2) * 0.42;
  glow *= 0.38 + 0.62 * day;
  // sun colour warms as it sets: white-hot noon -> warm orange dusk
  vec3 sunCol = mix(vec3(1.0, 0.98, 0.92), vec3(1.0, 0.66, 0.36), day);
  skyCol += sunCol * glow * step(horizon, uv.y);
  // soft sun disc (swells a touch as it nears the horizon; softer + dimmer at noon)
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
  // static curvy waterline: fixed smooth sines (keeps the wavy shape, no drift)
  float waveH = (sin(uv.x * 24.0) * 0.6 + sin(uv.x * 42.0) * 0.4) * 0.002;
  float wavyHorizon = horizon + waveH;
  float seaMask = 1.0 - smoothstep(wavyHorizon - 0.0014, wavyHorizon + 0.0014, uv.y);
  vec3 col = mix(skyCol, seaCol, seaMask);

  // crisp horizon line with a thin warm rim (only as dusk arrives)
  float hl = smoothstep(0.004, 0.0, abs(uv.y - wavyHorizon));
  col += sunCol * hl * (0.18 + 0.5 * column) * day;

  // gentle vignette for cinematic framing
  vec2 vig = uv - 0.5;
  col *= 1.0 - dot(vig, vig) * 0.55;

  // subtle filmic lift + tone
  col = pow(max(col, 0.0), vec3(0.92));

  gl_FragColor = vec4(col, 1.0);
}`

/** Length (s) of the noon->dusk sun-arc intro; the overlay copy waits for it. */
const INTRO_S = 1.5

/** Above 1.5x device pixels this soft scene looks identical, but every extra
    pixel runs the fbm shader — on 3x phones that's the difference between
    smooth and choppy. */
const MAX_DPR = 1.5

/**
 * Compiles the ocean shader on `canvas` and starts rendering (a single dusk
 * frame when `animate` is false). Returns a cleanup function, or null when
 * WebGL is unavailable — the canvas then stays transparent and the CSS
 * `.waves-fallback` scene underneath shows instead.
 */
function startOcean(
  canvas: HTMLCanvasElement,
  animate: boolean,
): (() => void) | null {
  const attrs: WebGLContextAttributes = {
    alpha: false,
    antialias: false, // a full-screen triangle has no edges to smooth
    // software-rendered GL would crawl; prefer the static CSS fallback
    failIfMajorPerformanceCaveat: true,
  }

  try {
    const gl =
      canvas.getContext('webgl', attrs) ??
      (canvas.getContext(
        'experimental-webgl',
        attrs,
      ) as WebGLRenderingContext | null)
    if (!gl) return null

    const compile = (type: number, src: string): WebGLShader | null => {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, src)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    const vs = compile(gl.VERTEX_SHADER, VERT)
    const fs = compile(gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return null

    const program = gl.createProgram()
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    gl.deleteShader(vs)
    gl.deleteShader(fs)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program)
      return null
    }
    gl.useProgram(program)

    // full-screen triangle
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    )
    const loc = gl.getAttribLocation(program, 'a_pos')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uTime = gl.getUniformLocation(program, 'u_time')
    const uRes = gl.getUniformLocation(program, 'u_resolution')
    const uFade = gl.getUniformLocation(program, 'u_fade')

    // reading clientWidth forces layout, so size only on resize events —
    // never inside the render loop
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr))
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uRes, canvas.width, canvas.height)
    }

    const render = (seconds: number, day: number) => {
      gl.uniform1f(uTime, seconds)
      gl.uniform1f(uFade, day)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    resize()
    window.addEventListener('resize', resize)

    // success: reveal the canvas over the CSS fallback
    canvas.style.opacity = '1'

    let raf = 0
    if (animate) {
      const start = performance.now()
      const loop = (now: number) => {
        const elapsed = (now - start) / 1000
        const p = Math.min(1, elapsed / INTRO_S)
        render(elapsed, p * p * (3 - 2 * p)) // smoothstep easing of the sun's descent
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)
    } else {
      render(7.5, 1) // reduced motion: a single frame, settled at dusk
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  } catch {
    return null
  }
}

/**
 * Runs the ocean and keeps it alive across GPU context loss (backgrounded
 * mobile tabs, driver resets): on loss the canvas hides so the CSS fallback
 * shows; on restore the scene re-initialises.
 */
function mountOcean(canvas: HTMLCanvasElement, animate: boolean): () => void {
  let stop = startOcean(canvas, animate)

  const onContextLost = (event: Event) => {
    event.preventDefault() // signal that we handle restoration
    stop?.()
    stop = null
    canvas.style.opacity = '0'
  }
  const onContextRestored = () => {
    stop = startOcean(canvas, animate)
  }
  canvas.addEventListener('webglcontextlost', onContextLost)
  canvas.addEventListener('webglcontextrestored', onContextRestored)

  return () => {
    canvas.removeEventListener('webglcontextlost', onContextLost)
    canvas.removeEventListener('webglcontextrestored', onContextRestored)
    stop?.()
  }
}

/** Ocean Waves — raw WebGL twilight sea (fbm swell + sun glint) behind the overlay. */
export function WavesHero() {
  const reduce = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    return mountOcean(canvas, !reduce)
  }, [reduce])

  // hold the overlay copy until the sun has (mostly) set, so the noon -> dusk
  // arc plays as the intro/loader and the text fades in once it lands
  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduce ? 0.01 : 0.7,
      ease: EASE,
      delay: reduce ? 0 : INTRO_S + delay,
    },
  })

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-background">
      {/* CSS fallback sea + sky (always rendered, sits behind the canvas) */}
      <div
        aria-hidden
        className="waves-fallback pointer-events-none absolute inset-0 -z-20"
      />

      {/* WebGL ocean — starts hidden, revealed only on successful compile.
          The fallback below is dusk-toned but the shader's first frame is
          the noon start of the intro; without an eased opacity transition
          here that mismatch reads as a hard color-pop the instant the
          canvas is revealed (worse on a cold load, where the fallback sits
          on screen longer first). Same easing as the rest of the hero's
          reveals (EASE) so the cross-dissolve feels like part of it. */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
        style={{ opacity: 0, transition: 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1)' }}
      />

      {/* bottom-up scrim for text legibility over the water */}
      <div
        aria-hidden
        className="waves-scrim pointer-events-none absolute inset-0 -z-10"
      />

      <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 pb-16 pt-24 sm:pb-24">
        <m.p
          {...rise(0.05)}
          className="font-mono text-xs uppercase tracking-[0.42em] text-brand-amber sm:text-sm"
        >
          Software Engineer
        </m.p>

        {/* the name, spelled in soft clouds — kept IN the layout flow (the real
            <h1>) so it reserves space and can never collide with the copy below;
            the SVG "gooey" filter rounds the letters into puffy blobs. The
            intro animates only opacity/transform (compositor-friendly) — a CSS
            blur here would re-run the SVG filters every frame. */}
        <m.h1
          aria-label="Pawan Danani"
          className="mt-1 mb-1"
          style={{ transformOrigin: 'left center' }}
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.04, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: reduce ? 0.01 : 1.5,
            ease: EASE,
            delay: reduce ? 0 : 0.2,
          }}
        >
          <span className="sr-only">Pawan Danani</span>
          <svg aria-hidden viewBox="0 0 1200 240" className="w-full max-w-4xl">
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
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="n"
                  scale={15}
                  result="d"
                />
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
              x="30"
              y="168"
              textAnchor="start"
              textLength="1140"
              lengthAdjust="spacingAndGlyphs"
              fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
              fontSize="150"
              fill="#ffffff"
              opacity="0.3"
              filter="url(#waves-cloud-haze)"
            >
              Pawan Danani
            </text>
            {/* puffy cloud body */}
            <text
              x="30"
              y="168"
              textAnchor="start"
              textLength="1140"
              lengthAdjust="spacingAndGlyphs"
              fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
              fontSize="150"
              fill="url(#waves-cloud-fill)"
              filter="url(#waves-cloud)"
            >
              Pawan Danani
            </text>
          </svg>
        </m.h1>

        <m.p
          {...rise(0.28)}
          className="mt-6 max-w-xl text-base leading-relaxed text-foreground/85 sm:text-lg"
        >
          Software engineer based in NYC. I love food, code, and{' '}
          <span className="text-foreground">more food</span>.
        </m.p>

        <m.div
          {...rise(0.4)}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="#projects"
            onClick={scrollToAnchor}
            className="rounded-[0.4rem] bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            style={{
              boxShadow:
                '0 8px 30px color-mix(in oklab, var(--primary) 45%, transparent)',
            }}
          >
            View projects
          </a>
          <a
            href="#about"
            onClick={scrollToAnchor}
            className="waves-glass rounded-[0.4rem] border border-border px-7 py-3 text-sm font-medium text-foreground transition hover:bg-accent"
          >
            About me
          </a>
          <span className="ml-1 flex items-center gap-4">
            <a
              href={`mailto:${PROFILE.email}`}
              aria-label={`Email ${PROFILE.email}`}
              className="text-foreground/60 transition hover:text-brand-amber"
            >
              <Mail className="h-5 w-5" />
            </a>
            <a
              href="https://github.com/pdanani"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="text-foreground/60 transition hover:text-brand-amber"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/pawan-danani-8b9402148/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="text-foreground/60 transition hover:text-brand-amber"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </span>
        </m.div>
      </div>

      {/* scroll cue — appears once the sun has landed */}
      <m.a
        href="#experience"
        onClick={scrollToAnchor}
        aria-label="Scroll to experience"
        className="absolute bottom-5 left-1/2 -translate-x-1/2 text-foreground/50 transition hover:text-foreground"
        {...rise(0.9)}
      >
        <m.span
          className="block"
          animate={reduce ? undefined : { y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
        >
          <ChevronDown aria-hidden className="h-5 w-5" />
        </m.span>
      </m.a>
    </section>
  )
}
