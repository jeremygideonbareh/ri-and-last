import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { brand, jainsem, lines, type Piece } from '../data/content'

/*
 * The enquiry list: pieces a visitor wants to ask about. It lives in their
 * own browser (a convenience, nothing more) and becomes one WhatsApp message.
 */

type Store = {
  items: string[]
  has: (id: string) => boolean
  toggle: (id: string) => void
  remove: (id: string) => void
  clear: () => void
  /** which piece's sheet is open, if any */
  open: Piece | null
  show: (p: Piece | null) => void
  bagOpen: boolean
  setBagOpen: (v: boolean) => void
}

const Ctx = createContext<Store | null>(null)
const KEY = 'rilast-enquiry'

export function labelFor(id: string) {
  const p = jainsem.find((j) => j.no === id)
  if (p) return `Jainsem No. ${p.no}, ${p.name}`
  const l = lines.find((x) => x.id === id)
  return l ? `${l.title}` : id
}

export function messageFor(ids: string[], name = '') {
  const hello = `Hello ${brand.name}${name ? `, this is ${name}` : ''}.`
  if (!ids.length) return `${hello} I found you through your website and would like to know more about your Eri silk collection.`
  const list = ids.map((id) => `• ${labelFor(id)}`).join('\n')
  return `${hello} I'd like to ask about these pieces from your website:\n${list}\n\nAre they available, and what is the price?`
}

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([])
  const [open, show] = useState<Piece | null>(null)
  const [bagOpen, setBagOpen] = useState(false)

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? '[]')
      if (Array.isArray(saved)) setItems(saved.filter((x) => typeof x === 'string'))
    } catch {
      // storage unavailable: start empty
    }
  }, [])
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      // storage unavailable: the list still works for this visit
    }
  }, [items])

  const toggle = useCallback((id: string) => setItems((xs) => (xs.includes(id) ? xs.filter((x) => x !== id) : [...xs, id])), [])
  const remove = useCallback((id: string) => setItems((xs) => xs.filter((x) => x !== id)), [])
  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<Store>(
    () => ({ items, has: (id) => items.includes(id), toggle, remove, clear, open, show, bagOpen, setBagOpen }),
    [items, toggle, remove, clear, open, bagOpen],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useEnquiry() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useEnquiry outside EnquiryProvider')
  return c
}
