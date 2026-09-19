import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { brand, enquiryChannel, enquiryHref, jainsem, nav } from '../data/content'
import { labelFor, messageFor, useEnquiry } from '../lib/enquiry'
import { Arrow, Instagram, Picture, WhatsApp, Wordmark } from './ui'

export function Chrome() {
  return (
    <>
      <div className="grain-wrap" aria-hidden>
        <div className="grain" />
      </div>
      <div aria-hidden className="fixed inset-x-0 top-0 z-[101] h-[3px] origin-left scale-x-0 bg-madder" data-progress />
      <Cursor />
      <Nav />
      <FloatingEnquire />
      <Bag />
      <PieceSheet />
    </>
  )
}

function Cursor() {
  return (
    <div aria-hidden>
      <div data-cursor-dot className="invisible fixed top-0 left-0 z-[120] size-2 rounded-full bg-madder" />
      <div data-cursor-ring className="invisible fixed top-0 left-0 z-[120] size-11 rounded-full border border-ink/50" />
      <span data-cursor-text className="invisible fixed top-0 left-0 z-[120] rounded-full bg-ink px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] whitespace-nowrap text-ecru uppercase" />
    </div>
  )
}

function Nav() {
  const { items, setBagOpen } = useEnquiry()
  const [menu, setMenu] = useState(false)

  useEffect(() => {
    if (!menu) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menu])

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[100]">
        <div aria-hidden data-header-scrim className="absolute inset-x-0 top-0 h-24 opacity-0 backdrop-blur-md transition-opacity duration-500 [mask-image:linear-gradient(180deg,#000_45%,transparent)]" />
        <div className="wrap relative flex items-center justify-between gap-4 py-4">
          <a href="#top" className="pointer-events-auto rounded-full bg-ecru/90 px-5 py-2 text-xl shadow-[0_8px_30px_-16px_rgb(29_23_18/0.6)] backdrop-blur-md" aria-label="Ri & Last, back to the top">
            <Wordmark />
          </a>
          <nav aria-label="Sections" className="pointer-events-auto hidden items-center gap-1 rounded-full bg-ecru/90 p-1 shadow-[0_8px_30px_-16px_rgb(29_23_18/0.6)] backdrop-blur-md lg:flex">
            {nav.map((n) => (
              <a key={n.id} href={`#${n.id}`} data-nav={n.id} className="rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-ink hover:text-ecru">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="pointer-events-auto flex items-center gap-2">
            <MotionToggle />
            <button
              type="button"
              onClick={() => setBagOpen(true)}
              className="flex min-h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-ecru shadow-[0_8px_30px_-16px_rgb(29_23_18/0.8)] ring-1 ring-ecru/35 transition-colors hover:bg-madder sm:px-5"
              data-cursor="Your list"
              aria-label={`Your enquiry, ${items.length} piece${items.length === 1 ? '' : 's'}`}
            >
              <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
                <path d="M5 8h14l-1.2 12H6.2Z" />
                <path d="M9 8a3 3 0 0 1 6 0" />
              </svg>
              <span className="max-sm:sr-only">Enquiry</span>
              <span data-bag-count className="grid min-w-6 place-items-center rounded-full bg-ecru px-1.5 font-mono text-xs text-ink">
                {items.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setMenu(true)}
              aria-expanded={menu}
              aria-controls="mobile-menu"
              className="grid size-11 place-items-center rounded-full bg-ecru/90 shadow-[0_8px_30px_-16px_rgb(29_23_18/0.6)] backdrop-blur-md lg:hidden"
            >
              <span className="sr-only">Open the menu</span>
              <span aria-hidden className="grid gap-1.5">
                <span className="block h-px w-5 bg-ink" />
                <span className="block h-px w-5 bg-ink" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!menu}
        className={`fixed inset-0 z-[110] flex flex-col bg-ink text-ecru transition-[clip-path] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] lg:hidden ${
          menu ? '[clip-path:circle(150%_at_calc(100%-2.5rem)_2.5rem)]' : 'pointer-events-none [clip-path:circle(0%_at_calc(100%-2.5rem)_2.5rem)]'
        }`}
      >
        <div className="wrap flex items-center justify-between py-5">
          <Wordmark className="text-2xl" />
          <button type="button" onClick={() => setMenu(false)} className="btn btn-line-light min-h-11 px-5">
            Close
          </button>
        </div>
        <nav className="wrap flex flex-1 flex-col justify-center gap-2 pb-16" aria-label="Sections">
          {nav.map((n, i) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={() => setMenu(false)}
              style={{ transitionDelay: menu ? `${150 + i * 60}ms` : '0ms' }}
              className={`border-b border-ecru/15 py-3 font-display text-5xl transition-[opacity,transform] duration-700 ${menu ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
            >
              {n.label}
            </a>
          ))}
          <a href={brand.instagram} target="_blank" rel="noopener" className="mt-8 inline-flex items-center gap-2 text-ecru/85">
            <Instagram className="size-5" /> @{brand.handle}
          </a>
        </nav>
      </div>
    </>
  )
}

function MotionToggle() {
  const [on, setOn] = useState(true)
  useEffect(() => setOn(document.documentElement.dataset.motion !== 'off'), [])
  return (
    <button
      type="button"
      onClick={() => {
        try {
          localStorage.setItem('rilast-motion', on ? 'off' : 'on')
        } catch {
          // storage unavailable: still applies to this page
        }
        window.location.reload()
      }}
      aria-pressed={on}
      title={on ? 'Turn the animation off' : 'Turn the animation on'}
      className="hidden min-h-11 items-center gap-2 rounded-full bg-ecru/90 px-4 text-sm font-medium shadow-[0_8px_30px_-16px_rgb(29_23_18/0.6)] backdrop-blur-md sm:flex"
    >
      <span aria-hidden className={`size-2 rounded-full ${on ? 'bg-madder' : 'bg-ink-soft'}`} />
      Motion {on ? 'on' : 'off'}
    </button>
  )
}

/** Always within reach: one tap to ask a question */
function FloatingEnquire() {
  const { items, setBagOpen } = useEnquiry()
  const channel = enquiryChannel()
  const [hide, setHide] = useState(true)
  useEffect(() => {
    const watch = [document.getElementById('top'), document.querySelector('footer'), document.getElementById('collection'), document.getElementById('film'), document.getElementById('visit')].filter(Boolean) as Element[]
    const on = new Set<Element>()
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? on.add(e.target) : on.delete(e.target)))
      setHide(on.size > 0)
    })
    watch.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return (
    <a
      href={enquiryHref(messageFor([]))}
      target="_blank"
      rel="noopener"
      onClick={(e) => {
        if (items.length) {
          e.preventDefault()
          setBagOpen(true)
        }
      }}
      data-fab
      aria-label={items.length ? 'Open your enquiry list' : `Ask on ${channel}`}
      tabIndex={hide ? -1 : 0}
      className={`group fixed right-4 bottom-4 z-[96] grid size-14 place-items-center rounded-full bg-madder text-ecru shadow-[0_18px_40px_-14px_rgb(122_31_26/0.9)] transition-[transform,opacity] duration-500 hover:scale-105 sm:right-8 sm:bottom-8 sm:size-16 ${hide ? 'pointer-events-none translate-y-6 scale-75 opacity-0' : ''}`}
      data-cursor="Ask us"
    >
      <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-madder/40 [animation-duration:2.4s]" />
      {channel === 'WhatsApp' ? <WhatsApp className="relative size-7" /> : <Instagram className="relative size-7" />}
    </a>
  )
}

/** The enquiry list, sent as one message */
function Bag() {
  const { items, remove, clear, bagOpen, setBagOpen } = useEnquiry()
  const [name, setName] = useState('')
  const [copied, setCopied] = useState(false)
  const channel = enquiryChannel()
  const panel = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    document.documentElement.classList.toggle('sheet-open', bagOpen)
    if (!bagOpen) return
    panel.current?.querySelector<HTMLElement>('button')?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setBagOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [bagOpen, setBagOpen])

  const message = messageFor(items, name.trim())
  const send = async () => {
    // Instagram cannot take a pre-filled message, so hand it over on the clipboard
    if (channel !== 'WhatsApp') {
      try {
        await navigator.clipboard.writeText(message)
        setCopied(true)
      } catch {
        setCopied(false)
      }
    }
  }

  // portals only after hydration, so the server and client trees match
  if (!mounted) return null
  return createPortal(
    <div className={`fixed inset-0 z-[130] ${bagOpen ? '' : 'pointer-events-none'}`} inert={!bagOpen} role="dialog" aria-modal="true" aria-label="Your enquiry">
      <div onClick={() => setBagOpen(false)} className={`absolute inset-0 bg-ink/50 backdrop-blur-sm transition-opacity duration-500 ${bagOpen ? 'opacity-100' : 'opacity-0'}`} />
      <div
        ref={panel}
        className={`absolute inset-y-0 right-0 flex w-[min(30rem,100vw)] flex-col bg-ecru shadow-2xl transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${bagOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <div>
            <p className="eyebrow text-madder">Your enquiry</p>
            <p className="mt-1 font-display text-3xl">{items.length ? `${items.length} piece${items.length > 1 ? 's' : ''}` : 'Nothing yet'}</p>
          </div>
          <button type="button" onClick={() => setBagOpen(false)} className="btn btn-line min-h-11 px-5">
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="grid gap-4 py-10 text-center">
              <p className="font-display text-2xl">Add pieces as you browse.</p>
              <p className="text-ink-soft">Tap “Add to enquiry” on any Jainsem, stole or shawl, then send the list to us in one message.</p>
              <a href="#collection" onClick={() => setBagOpen(false)} className="btn btn-ink mx-auto mt-2">
                See the collection <Arrow className="size-4" />
              </a>
            </div>
          ) : (
            <ul className="grid gap-3">
              {items.map((id) => {
                const p = jainsem.find((j) => j.no === id)
                return (
                  <li key={id} className="flex items-center gap-4 rounded-2xl bg-card p-3">
                    {p ? (
                      <Picture name={p.image} alt="" sizes="64px" className="h-20 w-14 shrink-0 rounded-lg object-cover" />
                    ) : (
                      <span className="grid h-20 w-14 shrink-0 place-items-center rounded-lg bg-lilac-soft font-display">RL</span>
                    )}
                    <span className="flex-1">
                      <span className="block font-display text-lg leading-tight">{labelFor(id)}</span>
                      <span className="font-mono text-[0.7rem] tracking-[0.14em] text-ink-soft uppercase">Price on enquiry</span>
                    </span>
                    <button type="button" onClick={() => remove(id)} className="rounded-full px-3 py-2 text-sm text-ink-soft underline-offset-4 hover:text-madder hover:underline">
                      Remove
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="grid gap-3 border-t border-ink/10 px-6 py-5">
          <label className="grid gap-1.5">
            <span className="font-mono text-[0.7rem] tracking-[0.16em] text-ink-soft uppercase">Your name (optional)</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="min-h-12 rounded-full border border-ink/20 bg-card px-5 outline-none focus:border-madder" autoComplete="name" />
          </label>
          <a href={enquiryHref(message)} target="_blank" rel="noopener" onClick={send} className="btn btn-madder w-full" data-cursor="Send">
            {channel === 'WhatsApp' ? <WhatsApp className="size-5" /> : <Instagram className="size-5" />}
            {items.length ? `Send on ${channel}` : `Ask us on ${channel}`}
          </a>
          {channel !== 'WhatsApp' && (
            <div className="grid gap-2">
              <p className={`rounded-xl px-4 py-3 text-sm ${copied ? 'bg-leaf text-ecru' : 'bg-lilac-soft text-ink'}`} aria-live="polite">
                {copied ? 'Message copied. Paste it into the Instagram chat that just opened.' : 'Tapping send copies this message for you to paste into our Instagram chat:'}
              </p>
              <pre className="max-h-28 overflow-y-auto rounded-xl bg-card px-4 py-3 font-sans text-xs whitespace-pre-wrap text-ink-soft">{message}</pre>
            </div>
          )}
          {items.length > 0 && (
            <button type="button" onClick={clear} className="text-sm text-ink-soft underline underline-offset-4 hover:text-madder">
              Clear the list
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}

/** A single piece, up close, with the ways to ask about it */
function PieceSheet() {
  const { open, show, has, toggle } = useEnquiry()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const idx = open ? jainsem.findIndex((j) => j.no === open.no) : -1

  useEffect(() => {
    document.documentElement.classList.toggle('sheet-open', !!open)
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') show(null)
      if (e.key === 'ArrowRight') show(jainsem[(idx + 1) % jainsem.length])
      if (e.key === 'ArrowLeft') show(jainsem[(idx - 1 + jainsem.length) % jainsem.length])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, idx, show])

  if (!mounted) return null
  const p = open
  return createPortal(
    <div className={`fixed inset-0 z-[125] ${p ? '' : 'pointer-events-none'}`} inert={!p} role="dialog" aria-modal="true" aria-label={p ? `Jainsem No. ${p.no}, ${p.name}` : 'Piece'}>
      <div onClick={() => show(null)} className={`absolute inset-0 bg-ink/70 backdrop-blur-sm transition-opacity duration-500 ${p ? 'opacity-100' : 'opacity-0'}`} />
      {p && (
        <div key={p.no} className="sheet-in absolute inset-x-3 top-3 bottom-3 grid overflow-y-auto rounded-[1.75rem] bg-ecru md:inset-x-8 md:top-8 md:bottom-8 md:grid-cols-[1fr_1fr] md:overflow-hidden lg:inset-x-[8vw]">
          <div className="relative min-h-[42svh] overflow-hidden bg-ink md:min-h-0">
            <Picture name={p.image} alt={`Jainsem No. ${p.no}, ${p.name}, on a hanger in the showroom`} sizes="(min-width: 768px) 45vw, 100vw" className="sheet-img absolute inset-0 h-full w-full object-cover" eager />
            <span className="absolute top-5 left-5 rounded-full bg-ecru/90 px-3 py-1.5 font-mono text-xs tracking-[0.16em] uppercase backdrop-blur">No. {p.no}</span>
          </div>
          <div className="flex flex-col justify-between gap-8 p-6 sm:p-10">
            <div className="flex items-center justify-between">
              <span className="eyebrow text-madder">Eri silk Jainsem</span>
              <button type="button" onClick={() => show(null)} className="btn btn-line min-h-11 px-5">
                Close
              </button>
            </div>
            <div>
              <h3 className="text-[clamp(2.6rem,5vw,4.6rem)]">{p.name}</h3>
              <p className="mt-4 max-w-md text-lg text-ink-soft">{p.motif}. Handwoven in Eri silk (Ryndia) on the loom in Khweng.</p>
              <dl className="mt-8 grid max-w-md grid-cols-2 gap-x-6 gap-y-4 border-t border-ink/15 pt-6 text-sm">
                <div>
                  <dt className="font-mono text-[0.7rem] tracking-[0.16em] text-ink-soft uppercase">Fibre</dt>
                  <dd className="mt-1 font-medium">Eri silk (Ryndia)</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.7rem] tracking-[0.16em] text-ink-soft uppercase">Made</dt>
                  <dd className="mt-1 font-medium">Handwoven, Khweng</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.7rem] tracking-[0.16em] text-ink-soft uppercase">Colour</dt>
                  <dd className="mt-1 flex items-center gap-2 font-medium">
                    <span className="size-3.5 rounded-full ring-1 ring-ink/20" style={{ background: p.swatch }} /> {p.name}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.7rem] tracking-[0.16em] text-ink-soft uppercase">Price</dt>
                  <dd className="mt-1 font-medium">On enquiry</dd>
                </div>
              </dl>
            </div>
            <div className="sticky bottom-0 -mx-6 grid gap-3 border-t border-ink/10 bg-ecru px-6 py-4 sm:static sm:mx-0 sm:grid-cols-2 sm:border-0 sm:p-0">
              <button type="button" onClick={() => toggle(p.no)} aria-pressed={has(p.no)} className={`btn ${has(p.no) ? 'btn-ecru ring-1 ring-ink' : 'btn-ink'}`}>
                {has(p.no) ? 'Added to your list ✓' : 'Add to enquiry'}
              </button>
              <a href={enquiryHref(messageFor([p.no]))} target="_blank" rel="noopener" className="btn btn-madder">
                {enquiryChannel() === 'WhatsApp' ? <WhatsApp className="size-5" /> : <Instagram className="size-5" />} Ask about No. {p.no}
              </a>
              <div className="flex items-center justify-between sm:col-span-2">
                <button type="button" onClick={() => show(jainsem[(idx - 1 + jainsem.length) % jainsem.length])} className="text-sm font-medium underline-offset-4 hover:underline">
                  ← Previous
                </button>
                <span className="font-mono text-xs text-ink-soft">
                  {idx + 1} / {jainsem.length}
                </span>
                <button type="button" onClick={() => show(jainsem[(idx + 1) % jainsem.length])} className="text-sm font-medium underline-offset-4 hover:underline">
                  Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body,
  )
}
