import { Color, Mesh, PerspectiveCamera, PlaneGeometry, Scene, ShaderMaterial, Vector2, WebGLRenderer } from 'three'

/**
 * A hanging length of Eri silk, woven in a shader: a madder-red ground with
 * a rib weave, turmeric and ecru diamond bands, and a fringed hem. It sways
 * in a slow wind, the pointer pushes into it, and scrolling stirs it up.
 */
export type ClothApi = {
  /** 0..1 scroll progress through the hero */
  scroll: (p: number) => void
  destroy: () => void
}

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uWind;
  uniform vec2 uPointer;
  uniform float uPush;
  varying vec2 vUv;
  varying vec3 vPos;

  void main() {
    vUv = uv;
    vec3 p = position;
    // pinned along the top edge, freer towards the hem
    float hang = pow(1.0 - uv.y, 1.15);
    float w = sin(p.x * 1.7 + uTime * 1.25) * 0.20
            + sin(p.y * 2.4 + uTime * 1.6 + p.x * 0.8) * 0.12
            + sin(p.x * 4.3 - uTime * 2.2 + p.y) * 0.045;
    float d = distance(uv, uPointer);
    float push = exp(-d * d * 14.0) * uPush;
    p.z += (w * uWind + push) * hang;
    p.x += sin(uTime * 0.7 + p.y * 1.3) * 0.10 * hang * uWind;
    p.y += (cos(p.x * 1.7 + uTime * 1.25) * 0.03) * hang * uWind;
    vec4 world = modelMatrix * vec4(p, 1.0);
    vPos = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

const fragment = /* glsl */ `
  uniform vec3 uGround;
  uniform vec3 uMotif;
  uniform vec3 uLight;
  uniform vec3 uDeep;
  varying vec2 vUv;
  varying vec3 vPos;

  float diamond(vec2 g) {
    vec2 f = abs(fract(g) - 0.5);
    return f.x + f.y;
  }

  void main() {
    float u = vUv.x;
    float v = vUv.y;

    // the fringe: tassels along the hem
    if (v < 0.035 && fract(u * 70.0) > 0.52) discard;

    vec3 col = uGround;

    // rib weave: warp and weft crossing
    float warp = step(0.5, fract(u * 230.0));
    float weft = step(0.5, fract(v * 300.0));
    col *= mix(0.9, 1.05, warp * weft + (1.0 - warp) * (1.0 - weft));

    // two motif bands above the hem, and a narrow one higher up
    float b1 = step(0.09, v) * step(v, 0.23);
    float b2 = step(0.27, v) * step(v, 0.33);
    float b3 = step(0.62, v) * step(v, 0.645);
    if (b1 > 0.5) {
      vec2 g = vec2(u * 11.0, (v - 0.09) / 0.14);
      float dm = diamond(g);
      float line = smoothstep(0.05, 0.0, abs(dm - 0.38));
      float core = step(dm, 0.12);
      col = mix(col, uMotif, line);
      col = mix(col, uLight, core);
      // edge stripes
      float e = min(abs(v - 0.09), abs(v - 0.23));
      col = mix(col, uLight, smoothstep(0.004, 0.0, e));
    }
    if (b2 > 0.5) {
      vec2 g = vec2(u * 26.0, (v - 0.27) / 0.06);
      float dm = diamond(g);
      col = mix(col, uMotif, smoothstep(0.06, 0.0, abs(dm - 0.3)));
      col = mix(col, uDeep, step(dm, 0.08));
    }
    if (b3 > 0.5) col = mix(col, uMotif, 0.85);
    if (v < 0.05) col = mix(col, uGround * 0.8, 0.5);

    // light the folds; silk carries a soft sheen
    vec3 n = normalize(cross(dFdx(vPos), dFdy(vPos)));
    vec3 l = normalize(vec3(-0.4, 0.6, 0.9));
    float diff = 0.55 + 0.45 * max(dot(n, l), 0.0);
    vec3 h = normalize(l + vec3(0.0, 0.0, 1.0));
    float spec = pow(max(dot(n, h), 0.0), 28.0) * 0.22;
    gl_FragColor = vec4(col * diff + spec, 1.0);
  }
`

const PLANE_W = 4.2
const PLANE_H = 6.6

export function createCloth(canvas: HTMLCanvasElement, animate: boolean): ClothApi {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1))
  const scene = new Scene()
  const camera = new PerspectiveCamera(35, 1, 0.1, 100)
  camera.position.set(0, 0, 9)

  const narrow = window.matchMedia('(max-width: 767px)').matches
  const geometry = new PlaneGeometry(PLANE_W, PLANE_H, narrow ? 70 : 120, narrow ? 100 : 170)
  const uniforms = {
    uTime: { value: 0 },
    uWind: { value: 1 },
    uPointer: { value: new Vector2(0.5, 0.5) },
    uPush: { value: 0 },
    uGround: { value: new Color('#9e2b25') },
    uMotif: { value: new Color('#d9962b') },
    uLight: { value: new Color('#f2ebdd') },
    uDeep: { value: new Color('#233a86') },
  }
  const material = new ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms, side: 2 })
  const cloth = new Mesh(geometry, material)
  cloth.rotation.z = -0.06
  scene.add(cloth)

  // Pointer: the cloth leans away from where you touch it
  let push = 0
  let targetPush = 0
  const pointer = new Vector2(0.5, 0.5)
  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect()
    pointer.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height)
    targetPush = 0.55
  }
  const onLeave = () => (targetPush = 0)
  window.addEventListener('pointermove', onMove)
  document.addEventListener('pointerleave', onLeave)

  let baseY = 0
  const resize = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / Math.max(1, h)
    // hang the whole length in view, hem and fringe included: the top edge
    // just above the frame, the hem at about 88% of the height
    const tall = camera.aspect < 0.8
    const viewH = PLANE_H / (tall ? 0.8 : 0.9)
    camera.position.z = viewH / (2 * Math.tan((camera.fov * Math.PI) / 360))
    baseY = viewH / 2 - PLANE_H / 2 + 0.25
    const viewW = viewH * camera.aspect
    cloth.position.x = tall ? viewW * 0.12 : Math.min(viewW * 0.22, viewW / 2 - PLANE_W / 2 - 0.2)
    camera.updateProjectionMatrix()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  let scrollP = 0
  let raf = 0
  let visible = false
  const start = performance.now()
  const frame = (now: number) => {
    uniforms.uTime.value = (now - start) / 1000
    push += (targetPush - push) * 0.05
    uniforms.uPush.value = push
    uniforms.uPointer.value.lerp(pointer, 0.08)
    uniforms.uWind.value = 1 + scrollP * 1.6
    cloth.position.y = baseY + scrollP * 1.4
    cloth.rotation.y = -0.18 + scrollP * 0.5
    renderer.render(scene, camera)
    if (visible) raf = requestAnimationFrame(frame)
  }

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    cancelAnimationFrame(raf)
    if (visible && animate) raf = requestAnimationFrame(frame)
    else if (visible) renderer.render(scene, camera)
  })
  io.observe(canvas)

  return {
    scroll: (p) => {
      scrollP = p
      if (!animate) renderer.render(scene, camera)
    },
    destroy: () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    },
  }
}
