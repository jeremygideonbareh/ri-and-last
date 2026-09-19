/*
 * All site content, from Ri & Last's Instagram (@rilast_erisilk_weaving_khweng),
 * checked 19 Sep 2026: the bio, post captions, the award post, the two
 * lookbook shoots, the "Behind the loom" post and the collection reel.
 * Prices are not published, so every piece is "price on enquiry".
 */

export const brand = {
  name: 'Ri & Last',
  full: 'Ri & Last Eri Silk Weaving & Dyeing Unit',
  line: 'Eri silk weaving and dyeing unit',
  place: 'Khweng, Ri-Bhoi, Meghalaya',
  instagram: 'https://www.instagram.com/rilast_erisilk_weaving_khweng/',
  handle: 'rilast_erisilk_weaving_khweng',
  threads: 'https://www.threads.com/@rilast_erisilk_weaving_khweng',
  maps: 'https://www.google.com/maps/search/?api=1&query=Ri+%26+Last+Eri+Silk+Weaving+Khweng+Meghalaya',
  followers: '2,750+',
  posts: 262,
  bio: ['Handcrafted Eri silk wonders (Ryndia)', 'Indigenous designs & natural dyes', 'Tradition with a modern twist'],
  /**
   * The WhatsApp number for enquiries, digits only with country code
   * (e.g. '919876543210'). Until it is set, enquiries open an Instagram DM.
   */
  whatsapp: '',
}

/** Where an enquiry goes: WhatsApp with the message ready, or Instagram DMs. */
export function enquiryHref(message: string) {
  if (brand.whatsapp) return `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(message)}`
  return `https://ig.me/m/${brand.handle}`
}
export const enquiryChannel = () => (brand.whatsapp ? 'WhatsApp' : 'Instagram')

export type Family = 'ivory' | 'reds' | 'blues' | 'greens' | 'purples'

export type Piece = {
  no: string
  name: string
  image: string
  family: Family
  /** a swatch for the colour chips */
  swatch: string
  motif: string
}

// The twelve Jainsem from the collection reel ("Tell us your favourite number").
export const jainsem: Piece[] = [
  { no: '01', name: 'Ivory & Plum', image: 'jainsem-01', family: 'ivory', swatch: '#6b2f45', motif: 'Deep plum diamonds woven across wide bands' },
  { no: '02', name: 'Ivory & Olive', image: 'jainsem-02', family: 'ivory', swatch: '#8a8a3a', motif: 'Olive checks and a scatter of small woven dots' },
  { no: '03', name: 'Maroon', image: 'jainsem-03', family: 'reds', swatch: '#7c1230', motif: 'Solid maroon with a band of cream and red motifs' },
  { no: '04', name: 'Lilac', image: 'jainsem-04', family: 'purples', swatch: '#b79ac7', motif: 'Soft lilac with deep navy borders' },
  { no: '05', name: 'Ivory & Turmeric', image: 'jainsem-05', family: 'ivory', swatch: '#c9954a', motif: 'Warm turmeric lattices on natural ivory' },
  { no: '06', name: 'Leaf Green', image: 'jainsem-06', family: 'greens', swatch: '#6e9e3a', motif: 'Fresh green with a red and navy motif band' },
  { no: '07', name: 'Scarlet', image: 'jainsem-07', family: 'reds', swatch: '#c01e36', motif: 'Scarlet with fine woven dots and borders' },
  { no: '08', name: 'Ivory & Madder', image: 'jainsem-08', family: 'ivory', swatch: '#8c2a36', motif: 'Madder-red diamonds and scattered motifs' },
  { no: '09', name: 'Royal Blue', image: 'jainsem-09', family: 'blues', swatch: '#2a45a0', motif: 'Royal blue with pale sky-blue woven bands' },
  { no: '10', name: 'Ivory & Rose', image: 'jainsem-10', family: 'ivory', swatch: '#c2505e', motif: 'A rose-red lattice running the full width' },
  { no: '11', name: 'Turquoise', image: 'jainsem-11', family: 'blues', swatch: '#27a9c5', motif: 'Turquoise with navy flowers in two bands' },
  { no: '12', name: 'Ivory & Slate', image: 'jainsem-12', family: 'ivory', swatch: '#4d5870', motif: 'Slate and navy geometry on ivory' },
]

export const families: { id: Family | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ivory', label: 'Ivory' },
  { id: 'reds', label: 'Reds' },
  { id: 'blues', label: 'Blues' },
  { id: 'purples', label: 'Lilac' },
  { id: 'greens', label: 'Green' },
]

// Beyond the Jainsem: stoles, mufflers and shawls from the showroom posts.
export const lines = [
  { id: 'stoles', title: 'Stoles', image: 'stoles-showroom', body: 'Light Eri silk stoles in a spectrum of natural shades, for everyday wear or gifting.' },
  { id: 'mufflers', title: 'Mufflers', image: 'stole-rack', body: 'Warm, soft Eri silk mufflers for Meghalaya winters, woven in solid colours and borders.' },
  { id: 'shawls', title: 'Shawls', image: 'shawl-motif-pink', body: 'Shawls with indigenous motifs worked into the weave, made to be handed down.' },
]

// The two lookbook shoots.
export const lookbooks = [
  {
    id: 'indigo',
    title: 'A shade of blue made for quiet confidence',
    colour: 'Indigo',
    tone: '#233a86',
    ink: '#f2ebdd',
    images: ['indigo-1', 'indigo-3', 'indigo-4', 'indigo-5', 'indigo-6'],
    credit: 'Model @phiba_syiemmm · Photography @elvis_jones_photographer',
  },
  {
    id: 'lavender',
    title: 'The kind of colour that makes you look twice',
    colour: 'Lavender pink',
    tone: '#c79ab8',
    ink: '#1d1712',
    images: ['lavender-1', 'lavender-3', 'lavender-5', 'lavender-6', 'lavender-8'],
    credit: 'From the lavender pink Jainsem shoot · Model @hadasa_ramde on the reel',
  },
]

// "Every beautiful piece begins with careful preparation." (Behind the loom)
export const craft = [
  { step: 'Yarn', image: 'yarn-skein', title: 'Ryndia, the peace silk', body: 'Eri silk is spun from cocoons the moth has already left, so no life is taken for the thread. The yarn is soft, warm and breathable.' },
  { step: 'Spinning', image: 'warping-wheel', title: 'Spun and wound by hand', body: 'The yarn is spun, reeled and wound onto bobbins, ready to be counted into a warp.' },
  { step: 'Dyeing', image: 'dye-leaves', title: 'Coloured with natural dyes', body: 'Leaves and plants are boiled into dye baths, and the yarn takes its colour from them, skein by skein.' },
  { step: 'Warping', image: 'warp-pink', title: 'Warping, denting, designing', body: 'Threads are measured, colours arranged and patterns planned, one step at a time: the quiet foundations of every piece.' },
  { step: 'Weaving', image: 'weaving-pink', title: 'Woven on the loom in Khweng', body: 'Line by line, the motifs grow under the weaver’s hands on the frame loom.' },
  { step: 'Finished', image: 'stole-rack', title: 'Ready for you', body: 'Finished, fringed and hung in the showroom, each piece one of a kind.' },
]

export const award = {
  title: 'Gold Winner',
  category: 'Cultural Ambassador',
  event: 'Indian Responsible Tourism State Awards 2025, Meghalaya (3rd edition)',
  by: 'Outlook Responsible Tourism',
  when: 'World Tourism Day 2025',
  presenter: 'presented by the Chief Minister of Meghalaya, Shri Conrad K. Sangma',
  thanks: 'With heartfelt thanks to Meghalaya Tourism for believing in our work.',
  images: ['award-trophy', 'award-certificate', 'award-stage', 'award-tourism-day'],
}

export const showroom = {
  images: ['showroom-ivory', 'stoles-showroom', 'jainsem-ivory-model', 'collection-rack'],
}

export const steps = [
  { title: 'Choose', body: 'Pick a piece, or several. Add them to your enquiry as you browse.' },
  { title: 'Message', body: 'Send the list to us in one tap. The piece numbers go with it.' },
  { title: 'Confirm', body: 'We reply with availability and the price of the exact piece.' },
  { title: 'Receive', body: 'Collect it from the showroom in Khweng, or ask us about delivery.' },
]

export const care = [
  'Hand wash gently in cold water with a mild soap.',
  'Do not wring. Press the water out in a towel.',
  'Dry flat in the shade; natural dyes love to stay out of strong sun.',
  'Iron on a low setting, on the reverse.',
]

export const nav = [
  { id: 'collection', label: 'Collection' },
  { id: 'lookbook', label: 'Lookbook' },
  { id: 'craft', label: 'The craft' },
  { id: 'award', label: 'Award' },
  { id: 'visit', label: 'Visit' },
]
