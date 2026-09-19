import { gsap } from 'gsap'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText)

const DESKTOP = '(min-width: 1024px)'
const FINE = '(pointer: fine)'
const q = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => [...root.querySelectorAll<T>(s)]

/**
 * Every scroll and pointer effect on the page, keyed off data attributes.
 * Pinned sections are created in page order (lookbook, then craft).
 */
export function startCinema() {
  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia()
    mm.add(`${DESKTOP} and ${FINE}`, () => {
      const smoother = ScrollSmoother.create({ wrapper: '#smooth-wrapper', content: '#smooth-content', smooth: 1.1, effects: true })
      return () => smoother.kill()
    })
    heroIntro()
    heroScroll()
    progress()
    cursor()
  })

  let cancelled = false
  const rest = () => {
    if (cancelled) return
    ctx.add(() => {
      splits()
      reveals()
      scrubWords()
      wipes()
      weave()
      marquees()
      spins()
      film()
      lookbook()
      craft()
      awardLight()
      wordmark()
      magnets()
      tilts()
      navActive()
      ScrollTrigger.refresh()
    })
  }
  const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback
  if (idle) idle(rest)
  else setTimeout(rest, 60)

  return () => {
    cancelled = true
    ctx.revert()
  }
}

// ---------------------------------------------------------------- hero

function heroIntro() {
  const title = document.querySelector<HTMLElement>('[data-hero-title]')
  if (!title) return
  const split = SplitText.create(title, { type: 'chars,words' })
  const fades = q('[data-hero-fade]')
  const cloth = document.querySelector('[data-hero-cloth]')
  gsap.set(split.chars, { autoAlpha: 0 })
  gsap.set(fades, { autoAlpha: 0 })
  const play = () => {
    gsap
      .timeline({ onComplete: () => split.revert() })
      .fromTo(cloth, { autoAlpha: 0, scale: 1.15 }, { autoAlpha: 1, scale: 1, duration: 2.2, ease: 'expo.out' }, 0)
      // letters unspool from a blur, sliding in along the line like thread
      .fromTo(
        split.chars,
        { autoAlpha: 0, filter: 'blur(14px)', xPercent: -60, skewX: -18 },
        { autoAlpha: 1, filter: 'blur(0px)', xPercent: 0, skewX: 0, duration: 1.1, ease: 'expo.out', stagger: 0.022 },
        0.15,
      )
      .fromTo(fades, { autoAlpha: 0, filter: 'blur(8px)' }, { autoAlpha: 1, filter: 'blur(0px)', duration: 1, stagger: 0.1 }, 0.6)
  }
  const html = document.documentElement
  if (html.classList.contains('intro-out') || html.dataset.motion === 'off' || !document.getElementById('intro')) play()
  else window.addEventListener('intro:out', play, { once: true })
}

function heroScroll() {
  const hero = document.querySelector<HTMLElement>('[data-hero]')
  if (!hero) return
  gsap.to('[data-hero-title]', { yPercent: -18, autoAlpha: 0.2, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } })
}

function progress() {
  gsap.to('[data-progress]', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } })
}

function cursor() {
  if (!window.matchMedia(FINE).matches) return
  const dot = document.querySelector<HTMLElement>('[data-cursor-dot]')
  const ring = document.querySelector<HTMLElement>('[data-cursor-ring]')
  const text = document.querySelector<HTMLElement>('[data-cursor-text]')
  if (!dot || !ring || !text) return
  const dx = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' })
  const dy = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' })
  const rx = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' })
  const ry = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' })
  const tx = gsap.quickTo(text, 'x', { duration: 0.35, ease: 'power3' })
  const ty = gsap.quickTo(text, 'y', { duration: 0.35, ease: 'power3' })
  gsap.set([dot, ring], { xPercent: -50, yPercent: -50, autoAlpha: 0 })
  let shown = false
  window.addEventListener('pointermove', (e) => {
    if (!shown) {
      shown = true
      gsap.set([dot, ring, text], { x: e.clientX, y: e.clientY })
      gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 })
    }
    dx(e.clientX)
    dy(e.clientY)
    rx(e.clientX)
    ry(e.clientY)
    tx(e.clientX + 20)
    ty(e.clientY + 20)
  })
  document.addEventListener('pointerover', (e) => {
    const el = e.target as HTMLElement
    const t = el.closest<HTMLElement>('[data-cursor], a, button')
    const label = el.closest('header') ? '' : (t?.dataset.cursor ?? '')
    gsap.to(ring, { scale: t ? 1.5 : 1, borderColor: t ? '#9e2b25' : 'rgba(29,23,18,0.5)', duration: 0.35 })
    text.textContent = label
    gsap.to(text, { autoAlpha: label ? 1 : 0, scale: label ? 1 : 0.6, duration: 0.25 })
  })
}

// ---------------------------------------------------------------- text

function splits() {
  q('[data-split]').forEach((el) => {
    const split = SplitText.create(el, { type: 'words', mask: 'words' })
    gsap.from(split.words, {
      xPercent: -40,
      autoAlpha: 0,
      filter: 'blur(10px)',
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.06,
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onComplete: () => split.revert(),
    })
  })
}

function reveals() {
  q('[data-reveal]').forEach((el) => {
    gsap.from(el, { autoAlpha: 0, filter: 'blur(8px)', duration: 1.1, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
  })
}

function scrubWords() {
  q('[data-scrub-words]').forEach((el) => {
    const split = SplitText.create(el, { type: 'words' })
    gsap.fromTo(split.words, { opacity: 0.14 }, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } })
  })
}

// ---------------------------------------------------------------- images

/** Photos open like a weft being drawn across: alternate sides, then settle. */
function wipes() {
  q('[data-wipe]').forEach((el, i) => {
    const from = i % 2 ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)'
    const img = el.querySelector('img')
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%', once: true } })
    tl.fromTo(el, { clipPath: from }, { clipPath: 'inset(0 0% 0 0%)', duration: 1.2, ease: 'expo.inOut', clearProps: 'clipPath' })
    if (img) tl.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0.2)
  })
}

/** The collection grid weaves in row by row, each row from the opposite side. */
function weave() {
  const grid = document.querySelector('[data-weave]')
  if (!grid) return
  ScrollTrigger.batch(q('[data-piece] > div', grid), {
    start: 'top 92%',
    once: true,
    onEnter: (batch) => {
      const dir = batch[0].getBoundingClientRect().top % 2 ? 1 : -1
      gsap.fromTo(
        batch,
        { clipPath: dir > 0 ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)' },
        { clipPath: 'inset(0 0% 0 0%)', duration: 1.1, ease: 'expo.inOut', stagger: 0.09, clearProps: 'clipPath' },
      )
    },
  })
}

function marquees() {
  q('[data-marquee]').forEach((track) => {
    const dir = track.dataset.marquee === 'right' ? 1 : -1
    const half = track.scrollWidth / 2
    gsap.set(track, { x: dir > 0 ? -half : 0 })
    const loop = gsap.to(track, { x: dir > 0 ? 0 : -half, duration: 30, ease: 'none', repeat: -1 })
    ScrollTrigger.create({
      trigger: track,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const v = Math.min(4, Math.abs(self.getVelocity() / 300))
        gsap.to(loop, { timeScale: 1 + v, duration: 0.3, overwrite: true })
        gsap.to(track, { skewX: gsap.utils.clamp(-8, 8, self.getVelocity() / -250), duration: 0.4, overwrite: 'auto' })
      },
    })
  })
}

function spins() {
  q('[data-spin]').forEach((el) => {
    gsap.to(el, { rotate: 360, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 } })
  })
}

/** The phone showing the reel turns towards you as it arrives. */
function film() {
  const f = document.querySelector('[data-film]')
  if (!f) return
  gsap.fromTo(f, { rotateY: -28, rotateX: 8, transformPerspective: 1200 }, { rotateY: 18, rotateX: -4, ease: 'none', scrollTrigger: { trigger: f, start: 'top bottom', end: 'bottom top', scrub: 1 } })
}

// ---------------------------------------------------------------- lookbook

function lookbook() {
  const section = document.querySelector<HTMLElement>('[data-hscroll]')
  const track = section?.querySelector<HTMLElement>('[data-htrack]')
  if (!section || !track) return
  const distance = () => track.scrollWidth - window.innerWidth
  const tween = gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 },
  })
  // the background dyes itself to each shoot's colour as it passes
  q('[data-lb-tone]', section).forEach((panel) => {
    ScrollTrigger.create({
      trigger: panel,
      containerAnimation: tween,
      start: 'left 60%',
      onEnter: () => gsap.to(section, { backgroundColor: panel.dataset.lbTone, color: panel.dataset.lbInk, duration: 1.2, ease: 'power2.out' }),
      onLeaveBack: () => gsap.to(section, { backgroundColor: '#233a86', color: '#f2ebdd', duration: 1.2, ease: 'power2.out' }),
    })
  })
  q('[data-lb-img]', section).forEach((fig) => {
    const img = fig.querySelector('img')
    gsap.fromTo(fig, { clipPath: 'inset(8% 0 8% 0 round 1.25rem)' }, { clipPath: 'inset(0% 0 0% 0 round 1.25rem)', ease: 'none', scrollTrigger: { trigger: fig, containerAnimation: tween, start: 'left right', end: 'center center', scrub: true } })
    if (img) gsap.fromTo(img, { xPercent: -8, scale: 1.15 }, { xPercent: 8, scale: 1.05, ease: 'none', scrollTrigger: { trigger: fig, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } })
  })
}

// ---------------------------------------------------------------- craft

function craft() {
  const stage = document.querySelector('[data-craft-stage]')
  if (!stage || !window.matchMedia(DESKTOP).matches) return
  const imgs = q('[data-craft-img]', stage)
  const count = stage.querySelector('[data-craft-count]')
  const list = document.querySelector('[data-craft-list]')
  // the photo panel holds still beside the steps (a pin: sticky cannot work
  // inside the smooth scroller's transformed content)
  if (list)
    ScrollTrigger.create({ trigger: list, start: 'top 12%', end: () => `bottom ${window.innerHeight * 0.88}px`, pin: stage, pinSpacing: false })
  q('[data-craft-step]').forEach((step, i) => {
    if (i === 0) return
    ScrollTrigger.create({
      trigger: step,
      start: 'top 60%',
      onEnter: () => {
        gsap.fromTo(imgs[i], { clipPath: 'inset(100% 0 0 0)', scale: 1.2 }, { clipPath: 'inset(0% 0 0 0)', scale: 1, duration: 1.1, ease: 'expo.inOut' })
        if (count) count.textContent = `${String(i + 1).padStart(2, '0')} / ${String(imgs.length).padStart(2, '0')}`
      },
      onLeaveBack: () => {
        gsap.to(imgs[i], { clipPath: 'inset(100% 0 0 0)', duration: 0.9, ease: 'expo.inOut' })
        if (count) count.textContent = `${String(i).padStart(2, '0')} / ${String(imgs.length).padStart(2, '0')}`
      },
    })
  })
}

// ---------------------------------------------------------------- award & footer

function awardLight() {
  const section = document.querySelector<HTMLElement>('[data-award]')
  const light = section?.querySelector<HTMLElement>('[data-award-light]')
  if (!section || !light || !window.matchMedia(FINE).matches) return
  const x = gsap.quickTo(light, 'x', { duration: 1, ease: 'power3' })
  const y = gsap.quickTo(light, 'y', { duration: 1, ease: 'power3' })
  section.addEventListener('pointermove', (e) => {
    const r = section.getBoundingClientRect()
    x(e.clientX - r.left - 320)
    y(e.clientY - r.top - 320)
  })
}

function wordmark() {
  const w = document.querySelector('[data-wordmark]')
  if (!w) return
  gsap.fromTo(w, { letterSpacing: '0.12em', autoAlpha: 0.3 }, { letterSpacing: '-0.02em', autoAlpha: 1, ease: 'none', scrollTrigger: { trigger: w, start: 'top bottom', end: 'bottom bottom', scrub: true } })
}

// ---------------------------------------------------------------- pointer

function magnets() {
  if (!window.matchMedia(FINE).matches) return
  q('[data-magnet]').forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect()
      x((e.clientX - r.left - r.width / 2) * 0.3)
      y((e.clientY - r.top - r.height / 2) * 0.4)
    })
    el.addEventListener('pointerleave', () => {
      x(0)
      y(0)
    })
  })
}

function tilts() {
  if (!window.matchMedia(FINE).matches) return
  q('[data-tilt]').forEach((el) => {
    gsap.set(el, { transformPerspective: 800 })
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' })
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' })
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect()
      ry(((e.clientX - r.left) / r.width - 0.5) * 18)
      rx(-((e.clientY - r.top) / r.height - 0.5) * 18)
    })
    el.addEventListener('pointerleave', () => {
      rx(0)
      ry(0)
    })
  })
}

/** Underline the nav link for the section in view. */
function navActive() {
  q('[data-nav]').forEach((link) => {
    const section = document.getElementById(link.dataset.nav!)
    if (!section) return
    ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => link.classList.toggle('is-active', self.isActive),
    })
  })
}
