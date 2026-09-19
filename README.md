# Ri & Last · Eri silk showcase

A product showcase and enquiry site for Ri & Last, an Eri silk weaving and dyeing
unit in Khweng, Ri-Bhoi, Meghalaya ([@rilast_erisilk_weaving_khweng](https://www.instagram.com/rilast_erisilk_weaving_khweng/)).

Live: https://jeremygideonbareh.github.io/ri-and-last/

- Vite, React 19, TypeScript, Tailwind v4, GSAP (ScrollTrigger, ScrollSmoother,
  SplitText, Flip) and three.js for the woven cloth in the hero.
- Content lives in `src/data/content.ts`. **Set `brand.whatsapp`** (digits with
  country code, e.g. `919876543210`) and every enquiry button switches from an
  Instagram DM to WhatsApp with the message already written.
- Photos come from the brand's Instagram; `python tools/process_images.py`
  rebuilds the WebP sizes. The Jainsem stills are frames of the collection reel.
- `npm run build` prerenders the page; GitHub Actions deploys `main` to Pages.
