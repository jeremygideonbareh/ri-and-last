import type { ImgHTMLAttributes, SVGProps } from 'react'
import { img } from '../lib/img'

type PictureProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> & {
  name: string
  alt: string
  sizes: string
  eager?: boolean
}

export function Picture({ name, alt, sizes, eager, className, ...rest }: PictureProps) {
  const i = img(name)
  return (
    <img
      src={i.src}
      srcSet={i.srcSet}
      sizes={sizes}
      width={i.width}
      height={i.height}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : undefined}
      className={className}
      {...rest}
    />
  )
}

export function Arrow(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export function WhatsApp(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
      <path d="M12 2.2A9.7 9.7 0 0 0 3.6 16.9L2.3 21.7l4.9-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.5-.2Z" />
    </svg>
  )
}

export function Instagram(p: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden {...p}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r=".7" fill="currentColor" />
    </svg>
  )
}

/** A woven diamond motif, drawn as a border band */
export function Motif({ className, count = 9 }: { className?: string; count?: number }) {
  return (
    <svg viewBox={`0 0 ${count * 24} 24`} className={className} aria-hidden preserveAspectRatio="xMidYMid meet">
      {Array.from({ length: count }).map((_, i) => (
        <g key={i} transform={`translate(${i * 24} 0)`} fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M12 2 22 12 12 22 2 12Z" />
          <path d="M12 8 16 12 12 16 8 12Z" fill="currentColor" stroke="none" />
        </g>
      ))}
    </svg>
  )
}

/** The Ri & Last wordmark */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`font-display tracking-[-0.02em] ${className ?? ''}`}>
      Ri <em className="font-normal">&amp;</em> Last
    </span>
  )
}
