import { useEffect } from 'react'
import { Chrome } from './components/Chrome'
import { Hero } from './components/Hero'
import { Award, Band, Collection, Craft, Film, Footer, Lookbook, Story, Visit } from './components/Sections'
import { EnquiryProvider } from './lib/enquiry'

export default function App() {
  useEffect(() => {
    const html = document.documentElement
    let stop: (() => void) | undefined
    const ready = () => {
      html.classList.add('app-ready')
      window.dispatchEvent(new Event('app:ready'))
    }
    if (html.dataset.motion === 'off') {
      ready()
      return
    }
    // the film loads after the first paint, then the loom opens
    import('./lib/cinema').then(({ startCinema }) => {
      stop = startCinema()
      ready()
    })
    return () => stop?.()
  }, [])

  return (
    <EnquiryProvider>
      <a href="#collection" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-ecru">
        Skip to the collection
      </a>
      <Chrome />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <Hero />
            <Band />
            <Story />
            <Collection />
            <Film />
            <Lookbook />
            <Craft />
            <Award />
            <Visit />
          </main>
          <Footer />
        </div>
      </div>
    </EnquiryProvider>
  )
}
