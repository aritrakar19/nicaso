import type { Provider, Review, ServicePackage } from '@/types'
import { EVENT_CATEGORIES } from './categories'

export const PROVIDERS: Provider[] = [
  {
    id: 'northlight',
    name: 'Northlight Collective',
    owner: 'Sneha Kapoor & Kabir Sen',
    city: 'New Town, Kolkata',
    cover: 'varmala',
    avatar: 'face4',
    portfolio: ['varmala', 'ringExchange', 'bridePortrait', 'garlandExchange', 'corridorPortrait'],
    rating: 4.9,
    reviewCount: 203,
    completedProjects: 77,
    replyTime: '~1 hr',
    onTimeRate: 98,
    repeatRate: 34,
    startingPrice: 38000,
    priceUnit: 'per event day',
    categories: ['Wedding', 'Pre-wedding', 'Corporate event'],
    offers: ['Edited photos', 'Printed album', 'Video', 'Raw files'],
    bookedDates: ['2026-11-29', '2026-12-20'],
    availabilityTag: 'Free on 13–14 Dec',
    yearsInBusiness: 9,
    about:
      'A two-person team covering Bengali, Marwari and destination weddings since 2017. We work candid-first and share a shot list with every couple before the day, so nothing important is missed.',
    team: [
      { name: 'Sneha Kapoor', role: 'Lead photographer', avatar: 'face4' },
      { name: 'Kabir Sen', role: 'Second photographer', avatar: 'face2' },
    ],
  },
  {
    id: 'lensary',
    name: 'Lensary Studio',
    owner: 'Riya Banerjee',
    city: 'Salt Lake, Kolkata',
    cover: 'royalCouple',
    avatar: 'face1',
    portfolio: ['royalCouple', 'couple', 'bridePortrait', 'preWedding', 'weddingDetails'],
    rating: 4.9,
    reviewCount: 128,
    completedProjects: 42,
    replyTime: '~2 hrs',
    onTimeRate: 96,
    repeatRate: 28,
    startingPrice: 45000,
    priceUnit: 'per wedding day',
    categories: ['Wedding', 'Pre-wedding', 'Portrait & headshots'],
    offers: ['Edited photos', 'Printed album'],
    bookedDates: ['2026-12-20'],
    availabilityTag: 'Free on 13–14 Dec',
    yearsInBusiness: 6,
    about:
      'Riya shoots weddings and portraits with a soft, editorial style. Every couple gets a planning call two weeks before the date and a printed proof sheet before the album goes to print.',
    team: [{ name: 'Riya Banerjee', role: 'Lead photographer', avatar: 'face1' }],
  },
  {
    id: 'frames',
    name: 'Frames by Arjun',
    owner: 'Arjun Mehta',
    city: 'Ballygunge, Kolkata',
    cover: 'corridorPortrait',
    avatar: 'face2',
    portfolio: ['corridorPortrait', 'garlandExchange', 'varmala', 'couple', 'weddingDetails'],
    rating: 4.8,
    reviewCount: 86,
    completedProjects: 31,
    replyTime: '~4 hrs',
    onTimeRate: 94,
    repeatRate: 22,
    startingPrice: 36000,
    priceUnit: 'per wedding day',
    categories: ['Wedding', 'Pre-wedding'],
    offers: ['Edited photos', 'Printed album', 'Raw files', 'Drone'],
    bookedDates: ['2026-12-06', '2026-12-20'],
    availabilityTag: '2 dates left in Dec',
    yearsInBusiness: 5,
    about:
      'Dramatic, well-lit wedding portraits and fast turnaround. Arjun works with a second shooter and a licensed drone operator for venues that allow it.',
    team: [{ name: 'Arjun Mehta', role: 'Lead photographer', avatar: 'face2' }],
  },
  {
    id: 'mishti',
    name: 'Studio Mishti',
    owner: 'Debanjan Roy',
    city: 'Howrah',
    cover: 'watch',
    avatar: 'face3',
    portfolio: ['watch', 'headphones', 'sneaker', 'food', 'watch'],
    rating: 4.7,
    reviewCount: 54,
    completedProjects: 58,
    replyTime: '~3 hrs',
    onTimeRate: 97,
    repeatRate: 41,
    startingPrice: 6500,
    priceUnit: 'per 25 photos',
    categories: ['Product & e-commerce', 'Food & restaurant'],
    offers: ['Edited photos', 'Raw files'],
    bookedDates: [],
    yearsInBusiness: 7,
    about:
      'A small product studio with a daylight set and a white-sweep cove. We shoot catalogues for local brands, cafés and online sellers, with consistent lighting across every batch.',
    team: [{ name: 'Debanjan Roy', role: 'Photographer', avatar: 'face3' }],
  },
  {
    id: 'skyline',
    name: 'Skyline Spaces',
    owner: 'Ishita Ghosh',
    city: 'Rajarhat, Kolkata',
    cover: 'interior',
    avatar: 'face5',
    portfolio: ['interior', 'house', 'hotel', 'interior', 'house'],
    rating: 4.8,
    reviewCount: 41,
    completedProjects: 36,
    replyTime: '~2 hrs',
    onTimeRate: 99,
    repeatRate: 37,
    startingPrice: 4500,
    priceUnit: 'per property',
    categories: ['Real estate', 'Hotel & travel'],
    offers: ['Edited photos', 'Drone'],
    bookedDates: [],
    yearsInBusiness: 4,
    about:
      'Interior and architecture photography for brokers, builders and boutique hotels. Wide-angle, true-to-colour, delivered ready for listing sites.',
    team: [{ name: 'Ishita Ghosh', role: 'Photographer', avatar: 'face5' }],
  },
  {
    id: 'stagecraft',
    name: 'Stagecraft Media',
    owner: 'Vikram Das',
    city: 'Park Street, Kolkata',
    cover: 'conference',
    avatar: 'face3',
    portfolio: ['conference', 'headshot', 'conference', 'headshot', 'conference'],
    rating: 4.6,
    reviewCount: 29,
    completedProjects: 24,
    replyTime: '~5 hrs',
    onTimeRate: 92,
    repeatRate: 30,
    startingPrice: 18000,
    priceUnit: 'per event day',
    categories: ['Corporate event'],
    offers: ['Edited photos', 'Video'],
    bookedDates: [],
    yearsInBusiness: 8,
    about:
      'Conferences, product launches and offsites. Same-day highlight selects for your social team and team headshots on a portable set.',
    team: [{ name: 'Vikram Das', role: 'Photographer', avatar: 'face3' }],
  },
]

export function getProvider(id: string): Provider | undefined {
  return PROVIDERS.find((p) => p.id === id)
}

export function isEventProvider(p: Provider): boolean {
  return p.categories.some((c) => EVENT_CATEGORIES.includes(c))
}

export function isAvailable(p: Provider, isoDate: string): boolean {
  return !p.bookedDates.includes(isoDate)
}

const roundToThousand = (n: number) => Math.round(n / 1000) * 1000

export function packagesFor(p: Provider): ServicePackage[] {
  if (isEventProvider(p)) {
    return [
      {
        name: 'Essentials',
        price: p.startingPrice,
        items: ['1 photographer, 6 hours', '300+ edited photos', 'Online gallery for 12 months', '2 revision rounds', 'Delivery in 21 days'],
      },
      {
        name: 'Signature',
        price: roundToThousand(p.startingPrice * 1.8),
        popular: true,
        items: ['2 photographers, 2 days', '500+ edited photos', '30-page printed album', '2 revision rounds', 'Delivery in 21 days'],
      },
      {
        name: 'Full story',
        price: roundToThousand(p.startingPrice * 2.9),
        items: ['2 photographers + videographer', 'Up to 3 days, all events', '700+ photos and a 5-minute film', '40-page printed album', 'Delivery in 30 days'],
      },
    ]
  }
  return [
    { name: 'Starter', price: p.startingPrice, items: ['25 edited photos', 'Simple set or white background', '1 revision round', 'Delivery in 5 days'] },
    { name: 'Catalogue', price: p.startingPrice * 3, popular: true, items: ['100 edited photos', '2 set-ups and props', '2 revision rounds', 'Delivery in 7 days'] },
    { name: 'Brand day', price: p.startingPrice * 6, items: ['Full day on location', '250 edited photos', 'Usage rights for ads', 'Delivery in 10 days'] },
  ]
}

export const SAMPLE_REVIEWS: Review[] = [
  {
    author: 'Moumita C.',
    context: 'Wedding · Feb 2026',
    rating: 5,
    text: 'They sent a shot list two weeks before and stuck to it. We got our gallery in 18 days, three days early. One family group photo was missing and they found it in the raw files within a day.',
  },
  {
    author: 'Rahul & Priyanka',
    context: 'Pre-wedding · Nov 2025',
    rating: 5,
    text: 'Clear quote, no surprise charges. When we asked for an extra location, they sent a price through the app first, which we appreciated.',
  },
  {
    author: 'Sohini D.',
    context: 'Reception · Jan 2026',
    rating: 4,
    text: 'Photos are lovely. The album took a week longer than planned, but they told us in advance and the delay was logged in the project.',
  },
]
