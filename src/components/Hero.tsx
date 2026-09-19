import { useEffect, useRef } from 'react'
import { brand, enquiryChannel, enquiryHref } from '../data/content'
import { messageFor } from '../lib/enquiry'
import type { ClothApi } from '../lib/cloth'
import { Arrow, Instagram, Motif, WhatsApp } from './ui'

export function Hero() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const section = useRef<HTMLElement>(null)

  // The woven cloth (three.js) loads straight after the first paint
  useEffect(() => {
    const el = canvas.current
    const box = section.current
    if (!el || !box) return
    const animate = document.documentElement.dataset.motion !== 'off'
    let api: ClothApi | null = null
    let cancelled = false
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const r = box.getBoundingClientRect()
        api?.scroll(Math.max(0, Math.min(1, -r.top / r.height)))
      })
    }
    import('../lib/cloth')
      .then(({ createCloth }) => {
        if (cancelled) return
        api = createCloth(el, animate)
        box.dataset.cloth = 'ready'
        onScroll()
      })
      .catch(() => {
        box.dataset.cloth = 'none'
      })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelled = true
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
      api?.destroy()
    }
  }, [])

  return (
    <section ref={section} id="top" data-hero aria-labelledby="hero-title" className="relative h-[100svh] min-h-[40rem] overflow-hidden bg-ink text-ecru">
      {/* the cloth, and a still woven fallback beneath it */}
      <div aria-hidden className="hero-fallback absolute inset-y-0 right-0 w-full md:w-[62%]" />
      <canvas ref={canvas} data-hero-cloth className="absolute inset-0 size-full" aria-hidden />
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgb(29_23_18/0.92)_0%,rgb(29_23_18/0.6)_42%,rgb(29_23_18/0)_70%)] max-md:bg-[linear-gradient(180deg,rgb(29_23_18/0.2)_0%,rgb(29_23_18/0.55)_45%,rgb(29_23_18/0.95)_80%)]" />

      <div className="wrap relative flex h-full flex-col justify-end pb-10 sm:pb-14 md:justify-center md:pb-0">
        <p data-hero-fade className="eyebrow self-start rounded-full text-turmeric max-md:bg-ink/75 max-md:px-3 max-md:py-1.5 max-md:backdrop-blur-sm max-md:before:hidden">
          {brand.line} · Khweng, Meghalaya
        </p>
        <h1 id="hero-title" data-hero-title className="mt-6 max-w-[13ch] text-[clamp(3.2rem,9vw,9.5rem)] leading-[0.92]">
          Woven <em className="text-lilac">slowly,</em> in the hills of Khweng.
        </h1>
        <p data-hero-fade className="mt-7 max-w-md text-lg text-ecru/85">
          Handcrafted Ryndia, the peace silk of Meghalaya, in indigenous designs and natural dyes.
        </p>
        <div data-hero-fade className="mt-9 flex flex-wrap gap-3">
          <a href="#collection" className="btn btn-ecru" data-magnet data-cursor="Browse">
            See the collection <Arrow className="size-4" />
          </a>
          <a href={enquiryHref(messageFor([]))} target="_blank" rel="noopener" className="btn btn-line-light" data-magnet>
            {enquiryChannel() === 'WhatsApp' ? <WhatsApp className="size-4" /> : <Instagram className="size-4" />} Ask on {enquiryChannel()}
          </a>
        </div>

        <div data-hero-fade className="mt-12 flex items-end justify-between gap-6 border-t border-ecru/20 pt-5 font-mono text-[0.7rem] tracking-[0.2em] text-ecru/80 uppercase md:absolute md:inset-x-12 md:bottom-10 md:mt-0">
          <span>Gold Winner · Responsible Tourism Awards 2025</span>
          <span className="hidden items-center gap-3 sm:flex">
            Scroll
            <span className="relative block h-10 w-px overflow-hidden bg-ecru/25">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[cue_1.8s_ease-in-out_infinite] bg-turmeric" />
            </span>
          </span>
        </div>
      </div>
      <Motif className="pointer-events-none absolute top-24 left-1/2 hidden h-4 -translate-x-1/2 text-turmeric/40 md:block" count={14} />
    </section>
  )
}
