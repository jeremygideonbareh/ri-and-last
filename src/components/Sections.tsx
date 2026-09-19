import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { award, brand, care, craft, enquiryChannel, enquiryHref, families, jainsem, lines, lookbooks, showroom, steps, type Family, type Piece } from '../data/content'
import { messageFor, useEnquiry } from '../lib/enquiry'
import { Arrow, Instagram, Motif, Picture, WhatsApp, Wordmark } from './ui'

const motionOn = () => typeof document !== 'undefined' && document.documentElement.dataset.motion !== 'off'

/* ------------------------------------------------------------ marquee */

export function Band() {
  const words = ['Ryndia', 'The peace silk', 'Natural dyes', 'Handwoven in Khweng', 'Indigenous designs']
  return (
    <div className="overflow-hidden bg-madder py-5 text-ecru" aria-hidden>
      <div data-marquee="left" className="marquee">
        {Array.from({ length: 4 }).map((_, k) => (
          <span key={k} className="flex items-center gap-8 pr-8 font-display text-[clamp(2rem,5vw,4.2rem)] whitespace-nowrap italic">
            {words.map((w) => (
              <span key={w} className="flex items-center gap-8">
                {w}
                <svg viewBox="0 0 24 24" className="size-6 shrink-0 text-turmeric">
                  <path d="M12 2 22 12 12 22 2 12Z" fill="currentColor" />
                </svg>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------ story */

export function Story() {
  return (
    <section id="story" className="relative overflow-hidden bg-ecru py-24 sm:py-36" aria-labelledby="story-title">
      <div className="wrap grid gap-16 lg:grid-cols-[1fr_1.35fr] lg:items-center lg:gap-24">
        <div className="relative mx-auto h-[34rem] w-full max-w-[28rem] sm:h-[40rem]">
          <div data-speed="0.9" className="absolute top-0 left-0 w-[70%] overflow-hidden rounded-t-full" data-wipe>
            <Picture name="yarn-skein" alt="Skeins of undyed Eri silk yarn" sizes="(min-width: 1024px) 22vw, 60vw" className="aspect-[3/4] w-full object-cover" />
          </div>
          <div data-speed="1.08" className="absolute right-0 bottom-0 w-[58%] overflow-hidden rounded-b-full border-[6px] border-ecru" data-wipe>
            <Picture name="jainsem-ivory-model" alt="An ivory Eri silk Jainsem in the showroom" sizes="(min-width: 1024px) 18vw, 50vw" className="aspect-[3/4] w-full object-cover" />
          </div>
          <span className="absolute top-[46%] left-[58%] grid size-24 -translate-x-1/2 place-items-center rounded-full bg-turmeric text-center font-mono text-[0.62rem] leading-tight tracking-[0.14em] text-ink uppercase" data-spin>
            Peace
            <br />
            silk
          </span>
        </div>
        <div>
          <p className="eyebrow text-madder" data-reveal>
            Ryndia
          </p>
          <h2 id="story-title" className="sr-only">
            The peace silk
          </h2>
          <p data-scrub-words className="mt-6 font-display text-[clamp(1.8rem,3.6vw,3.6rem)] leading-[1.12] tracking-[-0.02em]">
            Eri silk, <em>Ryndia</em> in Khasi, is the peace silk: the moth leaves its cocoon before a single thread is spun. In Khweng we dye it with natural colours and weave it by hand into Jainsem, stoles and shawls, tradition with a modern twist.
          </p>
          <dl className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              ['Fibre', 'Eri silk, spun from open cocoons'],
              ['Colour', 'Natural dyes from leaves and plants'],
              ['Hands', 'Woven on frame looms in Khweng'],
            ].map(([k, v]) => (
              <div key={k} className="border-t border-ink/20 pt-4" data-reveal>
                <dt className="font-mono text-[0.7rem] tracking-[0.2em] text-madder uppercase">{k}</dt>
                <dd className="mt-2 text-ink-soft">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ collection */

type FlipKit = { gsap: typeof import('gsap').gsap; Flip: typeof import('gsap/Flip').Flip; ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger }

export function Collection() {
  const [family, setFamily] = useState<Family | 'all'>('all')
  const grid = useRef<HTMLUListElement>(null)
  const kit = useRef<FlipKit | null>(null)
  const state = useRef<unknown>(null)
  const shown = useMemo(() => new Set(jainsem.filter((p) => family === 'all' || p.family === family).map((p) => p.no)), [family])

  useEffect(() => {
    if (!motionOn()) return
    Promise.all([import('gsap'), import('gsap/Flip'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { Flip }, { ScrollTrigger }]) => {
      gsap.registerPlugin(Flip)
      kit.current = { gsap, Flip, ScrollTrigger }
    })
  }, [])

  const pick = (f: Family | 'all') => {
    if (kit.current && grid.current) state.current = kit.current.Flip.getState(grid.current.querySelectorAll('[data-piece]'))
    setFamily(f)
  }

  useLayoutEffect(() => {
    const s = state.current
    const k = kit.current
    if (!s || !k) return
    state.current = null
    k.Flip.from(s as Parameters<typeof k.Flip.from>[0], {
      duration: 0.8,
      ease: 'power3.inOut',
      absolute: true,
      stagger: 0.02,
      onEnter: (els) => k.gsap.fromTo(els, { autoAlpha: 0, clipPath: 'inset(0 0 100% 0)' }, { autoAlpha: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'power3.out', stagger: 0.04 }),
      onLeave: (els) => k.gsap.to(els, { autoAlpha: 0, scale: 0.9, duration: 0.3 }),
      onComplete: () => k.ScrollTrigger.refresh(),
    })
  }, [shown])

  return (
    <section id="collection" className="relative bg-card py-24 sm:py-32" aria-labelledby="collection-title">
      <div className="wrap">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow text-madder" data-reveal>
              The Jainsem collection
            </p>
            <h2 id="collection-title" data-split className="mt-6 text-[clamp(2.8rem,7vw,6.8rem)]">
              Twelve Jainsem. <em>Which is yours?</em>
            </h2>
          </div>
          <p className="max-w-md text-lg text-ink-soft lg:justify-self-end" data-reveal>
            Each piece is handwoven Eri silk, straight from the showroom rail. Open one to see it up close, or add it to your enquiry and send us your list.
          </p>
        </div>

        <div className="mt-12 -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0" data-reveal>
          <div role="group" aria-label="Filter by colour" className="flex w-max gap-2">
            {families.map((f) => {
              const active = family === f.id
              const dots = jainsem.filter((p) => f.id === 'all' || p.family === f.id).slice(0, 4)
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => pick(f.id)}
                  aria-pressed={active}
                  className={`flex min-h-11 items-center gap-3 rounded-full border px-4 text-sm font-medium transition-colors ${active ? 'border-ink bg-ink text-ecru' : 'border-ink/20 hover:border-ink'}`}
                >
                  <span aria-hidden className="flex -space-x-1.5">
                    {dots.map((d) => (
                      <span key={d.no} className="size-3.5 rounded-full ring-2 ring-card" style={{ background: d.swatch }} />
                    ))}
                  </span>
                  {f.label}
                </button>
              )
            })}
          </div>
        </div>

        <ul ref={grid} className="mt-10 flex flex-wrap justify-center gap-x-4 gap-y-10 sm:gap-x-6" data-weave>
          {jainsem.map((p) => (
            <PieceCard key={p.no} p={p} hidden={!shown.has(p.no)} />
          ))}
        </ul>

        <MoreLines />
      </div>
    </section>
  )
}

function PieceCard({ p, hidden }: { p: Piece; hidden: boolean }) {
  const { has, toggle, show } = useEnquiry()
  const card = useRef<HTMLDivElement>(null)
  const added = has(p.no)
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !card.current) return
    const r = card.current.getBoundingClientRect()
    card.current.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 10}deg`)
    card.current.style.setProperty('--rx', `${-((e.clientY - r.top) / r.height - 0.5) * 8}deg`)
  }
  const onLeave = () => {
    card.current?.style.setProperty('--ry', '0deg')
    card.current?.style.setProperty('--rx', '0deg')
  }
  return (
    <li data-piece hidden={hidden} className="w-[calc(50%-0.5rem)] sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1.125rem)]">
      <div ref={card} onPointerMove={onMove} onPointerLeave={onLeave} className="piece-card group">
        <button type="button" onClick={() => show(p)} className="relative block w-full overflow-hidden rounded-[1.25rem] bg-ecru text-left" data-cursor="View" aria-label={`View Jainsem No. ${p.no}, ${p.name}`}>
          <Picture name={p.image} alt="" sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw" className="piece-img aspect-[11/20] w-full object-cover" />
          <span aria-hidden className="piece-sheen pointer-events-none absolute inset-0" />
          <span className="absolute top-3 left-3 font-display text-[clamp(2rem,4vw,3.4rem)] leading-none text-ink/85 mix-blend-multiply">{p.no}</span>
        </button>
        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-display text-lg leading-tight sm:text-2xl">{p.name}</p>
            <p className="mt-1 flex items-center gap-2 font-mono text-[0.66rem] tracking-[0.08em] whitespace-nowrap text-ink-soft uppercase sm:tracking-[0.14em]">
              <span className="size-2.5 shrink-0 rounded-full" style={{ background: p.swatch }} /> On enquiry
            </p>
          </div>
          <button
            type="button"
            onClick={() => toggle(p.no)}
            aria-pressed={added}
            aria-label={added ? `Remove No. ${p.no} from your enquiry` : `Add No. ${p.no} to your enquiry`}
            className={`grid size-11 shrink-0 place-items-center rounded-full border transition-[background-color,color,transform] duration-300 ${added ? 'rotate-45 border-madder bg-madder text-ecru' : 'border-ink/25 hover:border-ink hover:bg-ink hover:text-ecru'}`}
            data-cursor={added ? 'Remove' : 'Add'}
          >
            <span aria-hidden className="text-xl leading-none">+</span>
          </button>
        </div>
      </div>
    </li>
  )
}

function MoreLines() {
  const { has, toggle } = useEnquiry()
  return (
    <div className="mt-28">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h3 className="text-[clamp(2.2rem,5vw,4.4rem)]" data-split>
          Stoles, mufflers <em>&amp; shawls</em>
        </h3>
        <p className="max-w-sm text-ink-soft" data-reveal>
          Beyond the Jainsem, the showroom is full of lighter pieces. Tell us the colour you have in mind.
        </p>
      </div>
      <ul className="mt-10 grid gap-6 md:grid-cols-3">
        {lines.map((l, i) => (
          <li key={l.id} className="group relative overflow-hidden rounded-[1.5rem] bg-ink text-ecru" data-wipe>
            <Picture name={l.image} alt={`${l.title} on the showroom rail`} sizes="(min-width: 768px) 30vw, 100vw" className="aspect-[4/5] w-full object-cover opacity-85 transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(29_23_18/0)_40%,rgb(29_23_18/0.9)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <span className="font-mono text-xs tracking-[0.2em] text-ecru/80 uppercase">0{i + 1}</span>
              <p className="mt-1 font-display text-4xl">{l.title}</p>
              <p className="mt-2 max-w-xs text-sm text-ecru/85">{l.body}</p>
              <button type="button" onClick={() => toggle(l.id)} aria-pressed={has(l.id)} className={`btn mt-5 min-h-11 ${has(l.id) ? 'btn-ecru' : 'btn-line-light'}`}>
                {has(l.id) ? 'Added ✓' : 'Add to enquiry'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ------------------------------------------------------------ film */

export function Film() {
  const video = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = video.current
    if (!v) return
    if (!motionOn()) return
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.2 })
    io.observe(v)
    return () => io.disconnect()
  }, [])
  const base = import.meta.env.BASE_URL
  return (
    <section id="film" className="relative overflow-hidden bg-lilac-soft py-24 sm:py-32" aria-labelledby="film-title">
      <div className="wrap grid items-center gap-14 lg:grid-cols-[1fr_auto_1fr]">
        <div>
          <p className="eyebrow text-madder" data-reveal>
            On the rail
          </p>
          <h2 id="film-title" data-split className="mt-6 text-[clamp(2.6rem,6vw,5.6rem)]">
            One by one, <em>off the hanger.</em>
          </h2>
        </div>
        <div className="relative mx-auto w-[min(78vw,20rem)]" data-film>
          <div className="relative overflow-hidden rounded-[2.4rem] border-[10px] border-ink bg-ink shadow-[0_50px_80px_-40px_rgb(29_23_18/0.8)]">
            <video
              ref={video}
              className="aspect-[9/16] w-full object-cover"
              src={`${base}video/jainsem-reel.mp4`}
              poster={`${base}video/jainsem-reel-poster.webp`}
              muted
              loop
              playsInline
              preload="none"
              aria-label="The Jainsem collection, shown one by one on the showroom rail"
            />
          </div>
          <span className="absolute -top-5 -right-5 grid size-20 place-items-center rounded-full bg-madder text-center font-mono text-[0.6rem] leading-tight tracking-[0.14em] text-ecru uppercase" data-spin>
            12
            <br />
            pieces
          </span>
        </div>
        <div className="grid gap-6 lg:justify-self-end">
          <p className="max-w-sm text-lg text-ink-soft" data-reveal>
            Straight from our Instagram: the collection, one Jainsem after another. Tell us your favourite number and we will tell you all about it.
          </p>
          <div className="flex flex-wrap gap-3" data-reveal>
            <a href="#collection" className="btn btn-ink" data-magnet>
              Pick a number <Arrow className="size-4" />
            </a>
            <a href={brand.instagram} target="_blank" rel="noopener" className="btn btn-line" data-magnet>
              <Instagram className="size-4" /> See more on Instagram
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ lookbook */

export function Lookbook() {
  return (
    <section id="lookbook" data-hscroll className="relative overflow-hidden bg-indigo text-ecru" aria-labelledby="lookbook-title">
      <div className="flex h-[100svh] items-center">
        <div data-htrack className="flex w-max items-center gap-6 px-5 sm:gap-10 sm:px-12">
          <div className="w-[82vw] shrink-0 sm:w-[46vw] lg:w-[34vw]">
            <p className="eyebrow text-turmeric">Lookbook</p>
            <h2 id="lookbook-title" className="mt-6 text-[clamp(3rem,7vw,7rem)]">
              Two shades, <em>two stories.</em>
            </h2>
            <p className="mt-6 max-w-sm opacity-85">Scroll to walk through the indigo and lavender pink Jainsem shoots.</p>
          </div>
          {lookbooks.map((lb) => (
            <LookbookRun key={lb.id} lb={lb} />
          ))}
          <div className="w-[78vw] shrink-0 pr-[6vw] sm:w-[34vw]">
            <p className="font-display text-[clamp(2.4rem,5vw,4.6rem)] leading-none">Want the look?</p>
            <a href="#collection" className="btn btn-ecru mt-8" data-magnet>
              See the collection <Arrow className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function LookbookRun({ lb }: { lb: (typeof lookbooks)[number] }) {
  return (
    <>
      <div data-lb-tone={lb.tone} data-lb-ink={lb.ink} className="flex w-[74vw] shrink-0 flex-col justify-between self-stretch py-[14vh] sm:w-[30vw] lg:w-[22vw]">
        <p className="font-mono text-xs tracking-[0.24em] uppercase opacity-80">{lb.colour}</p>
        <p className="font-display text-[clamp(2rem,3.6vw,3.4rem)] leading-[1.02]">{lb.title}</p>
        <p className="text-xs opacity-75">{lb.credit}</p>
      </div>
      {lb.images.map((name, i) => (
        <figure key={name} className={`shrink-0 overflow-hidden rounded-[1.25rem] ${i % 3 === 1 ? 'h-[46svh] sm:h-[58svh]' : 'h-[54svh] sm:h-[74svh]'}`} data-lb-img>
          <Picture name={name} alt={`${lb.colour} Eri silk Jainsem, lookbook photo ${i + 1}`} sizes="40vw" className="h-full w-auto max-w-none object-cover" />
        </figure>
      ))}
    </>
  )
}

/* ------------------------------------------------------------ craft */

export function Craft() {
  return (
    <section id="craft" data-craft className="relative bg-ecru" aria-labelledby="craft-title">
      <div className="wrap py-24 sm:py-32">
        <p className="eyebrow text-madder" data-reveal>
          Behind the loom
        </p>
        <h2 id="craft-title" data-split className="mt-6 max-w-[14ch] text-[clamp(2.8rem,7vw,6.6rem)]">
          From cocoon <em>to cloth.</em>
        </h2>
      </div>
      <div className="wrap grid gap-10 pb-24 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div className="relative hidden lg:block">
          <div className="h-[76vh] overflow-hidden rounded-[1.5rem]" data-craft-stage>
            {craft.map((c, i) => (
              <Picture
                key={c.step}
                name={c.image}
                alt=""
                sizes="45vw"
                data-craft-img={i}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ clipPath: i === 0 ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)' }}
              />
            ))}
            <span data-craft-count className="absolute bottom-5 left-5 rounded-full bg-ecru/90 px-4 py-2 font-mono text-xs tracking-[0.2em] uppercase backdrop-blur">
              01 / 06
            </span>
          </div>
        </div>
        <ol className="grid gap-6 lg:gap-0" data-craft-list>
          {craft.map((c, i) => (
            <li key={c.step} data-craft-step={i} className="grid gap-5 lg:min-h-[76vh] lg:content-center">
              <Picture name={c.image} alt={c.title} sizes="100vw" className="aspect-[4/5] w-full rounded-[1.25rem] object-cover lg:hidden" />
              <div className="border-t border-ink/20 pt-6">
                <p className="font-mono text-xs tracking-[0.24em] text-madder uppercase">
                  {String(i + 1).padStart(2, '0')} · {c.step}
                </p>
                <h3 className="mt-4 text-[clamp(2.2rem,4.2vw,4rem)]">{c.title}</h3>
                <p className="mt-4 max-w-md text-lg text-ink-soft">{c.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ award */

export function Award() {
  return (
    <section id="award" data-award className="relative overflow-hidden bg-ink py-24 text-ecru sm:py-32" aria-labelledby="award-title">
      <div aria-hidden data-award-light className="pointer-events-none absolute top-[4%] left-[2%] size-[40rem] rounded-full bg-[radial-gradient(circle,rgb(217_150_43/0.35)_0%,transparent_62%)] max-lg:hidden" />
      <div className="wrap relative grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
        <div className="relative mx-auto w-full max-w-[26rem]">
          <div className="overflow-hidden rounded-[1.5rem]" data-wipe>
            <Picture name="award-trophy" alt="The Gold Winner trophy for Cultural Ambassador" sizes="(min-width: 1024px) 30vw, 90vw" className="aspect-[4/5] w-full object-cover" />
          </div>
          <div className="absolute right-0 -bottom-10 w-[48%] rotate-3 overflow-hidden rounded-xl border-4 border-ecru shadow-2xl sm:-right-12" data-tilt>
            <Picture name="award-certificate" alt="The Indian Responsible Tourism State Awards 2025 certificate" sizes="20vw" className="aspect-square w-full object-cover" />
          </div>
        </div>
        <div>
          <p className="eyebrow text-turmeric" data-reveal>
            {award.when}
          </p>
          <h2 id="award-title" className="mt-6 text-[clamp(4rem,12vw,11rem)] leading-[0.85]" data-split>
            <em>{award.title}</em>
          </h2>
          <p className="mt-6 font-display text-[clamp(1.6rem,3vw,2.6rem)] leading-tight" data-reveal>
            {award.category}, {award.event}.
          </p>
          <p className="mt-5 max-w-lg text-ecru/80" data-reveal>
            Honoured by {award.by}, {award.presenter}. {award.thanks}
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {award.images.slice(2).map((n) => (
              <div key={n} className="overflow-hidden rounded-xl" data-wipe>
                <Picture name={n} alt="Ri & Last at the award ceremony" sizes="20vw" className="aspect-[4/3] w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ visit */

export function Visit() {
  return (
    <section id="visit" className="relative overflow-hidden bg-card py-24 sm:py-32" aria-labelledby="visit-title">
      <div className="wrap">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow text-madder" data-reveal>
              Order & visit
            </p>
            <h2 id="visit-title" data-split className="mt-6 text-[clamp(2.8rem,7vw,6.4rem)]">
              Ask on {enquiryChannel()}, <em>or come and see.</em>
            </h2>
          </div>
          <p className="max-w-md text-lg text-ink-soft lg:justify-self-end" data-reveal>
            Every piece is one of a kind, so we confirm each order personally. Visit the showroom in {brand.place}, or message us from wherever you are.
          </p>
        </div>

        <ol className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="relative rounded-[1.25rem] border border-ink/15 bg-ecru p-6" data-wipe>
              <span className="font-display text-6xl leading-none text-madder/90">{i + 1}</span>
              <p className="mt-6 font-display text-2xl">{s.title}</p>
              <p className="mt-2 text-ink-soft">{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-20 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="grid grid-cols-2 items-start gap-4">
            {showroom.images.map((n, i) => (
              <div key={n} className={`self-start overflow-hidden rounded-[1.25rem] ${i % 2 ? 'mt-10' : ''}`} data-wipe>
                <Picture name={n} alt="Inside the Ri & Last showroom" sizes="(min-width: 1024px) 28vw, 45vw" className="aspect-[3/4] w-full object-cover" />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-10 self-start rounded-[1.5rem] bg-ink p-8 text-ecru sm:p-10">
            <div>
              <p className="font-mono text-xs tracking-[0.2em] text-turmeric uppercase">The showroom</p>
              <p className="mt-3 font-display text-4xl leading-tight">{brand.full}</p>
              <p className="mt-3 text-ecru/85">{brand.place}</p>
            </div>
            <div>
              <p className="font-mono text-xs tracking-[0.2em] text-turmeric uppercase">Caring for Eri silk</p>
              <ul className="mt-4 grid gap-2 text-sm text-ecru/85">
                {care.map((c) => (
                  <li key={c} className="flex gap-3">
                    <span aria-hidden className="text-turmeric">◆</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <a href={enquiryHref(messageFor([]))} target="_blank" rel="noopener" className="btn btn-madder" data-magnet>
                {enquiryChannel() === 'WhatsApp' ? <WhatsApp className="size-4" /> : <Instagram className="size-4" />} Ask on {enquiryChannel()}
              </a>
              <a href={brand.maps} target="_blank" rel="noopener" className="btn btn-line-light" data-magnet>
                Find us on the map
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------ footer */

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink pt-20 text-ecru">
      <div className="wrap grid gap-10 sm:grid-cols-3">
        <div>
          <p className="font-display text-3xl">{brand.name}</p>
          <p className="mt-2 text-ecru/75">{brand.line}</p>
          <p className="text-ecru/75">{brand.place}</p>
        </div>
        <ul className="grid content-start gap-2 text-ecru/85">
          {brand.bio.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <div className="grid content-start gap-2">
          <a href={brand.instagram} target="_blank" rel="noopener" className="inline-flex items-center gap-2 hover:text-turmeric">
            <Instagram className="size-4" /> @{brand.handle}
          </a>
          <a href={brand.threads} target="_blank" rel="noopener" className="hover:text-turmeric">
            Threads
          </a>
          <a href={enquiryHref(messageFor([]))} target="_blank" rel="noopener" className="hover:text-turmeric">
            Ask on {enquiryChannel()}
          </a>
        </div>
      </div>
      <Motif className="mx-auto mt-16 h-5 w-full text-turmeric/50" count={40} />
      <p data-wordmark className="mt-4 text-center leading-[0.8] select-none" aria-hidden>
        <Wordmark className="block text-[clamp(5rem,24vw,24rem)]" />
      </p>
      <div className="wrap flex flex-wrap justify-between gap-4 border-t border-ecru/15 py-6 text-xs text-ecru/65">
        <span>© {new Date().getFullYear()} Ri & Last. Photographs from Ri & Last’s Instagram.</span>
        <a href="#top" className="hover:text-ecru">
          Back to the top ↑
        </a>
      </div>
    </footer>
  )
}
