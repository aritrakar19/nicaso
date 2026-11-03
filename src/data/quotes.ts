import type { Quote, WeddingEvent } from '@/types'

export const WEDDING_EVENTS: WeddingEvent[] = ['Haldi', 'Mehendi', 'Sangeet', 'Wedding ceremony', 'Reception']

/** The sample brief the customer already sent; quotes below answer it. */
export const WEDDING_BRIEF = {
  id: 'BR-2026-07731',
  title: "Ananya & Rohit's wedding",
  dates: '13–14 Dec 2026',
  venue: 'Rajbari Banquets, Behala',
  invited: 5,
}

export const QUOTES: Quote[] = [
  {
    id: 'Q-1182',
    providerId: 'northlight',
    total: 68000,
    team: '2 photographers',
    coverage: '2 days · 14 hrs',
    eventsCovered: ['Haldi', 'Mehendi', 'Sangeet', 'Wedding ceremony', 'Reception'],
    photos: '600+ edited photos',
    album: '30-page album',
    rawFiles: 'Included',
    rawIncluded: true,
    deliveryDays: 21,
    revisionRounds: 2,
    milestonePlan: [20, 30, 30, 20],
    cancellation: '50% of booking back up to 30 days before',
    cancellationRefundable: true,
    validUntil: '10 Nov',
    tags: [
      { tone: 'brand', label: 'Covers all 5 events' },
      { tone: 'muted', label: 'You booked them before' },
    ],
  },
  {
    id: 'Q-1179',
    providerId: 'lensary',
    total: 62000,
    team: '1 photographer + assistant',
    coverage: '2 days · 12 hrs',
    eventsCovered: ['Haldi', 'Mehendi', 'Wedding ceremony', 'Reception'],
    photos: '500+ edited photos',
    album: '30-page album',
    rawFiles: '₹6,000 extra',
    rawIncluded: false,
    deliveryDays: 25,
    revisionRounds: 2,
    milestonePlan: [20, 30, 30, 20],
    cancellation: 'Booking amount not refundable',
    cancellationRefundable: false,
    validUntil: '8 Nov',
    tags: [
      { tone: 'ok', label: 'Lowest price' },
      { tone: 'warn', label: 'Sangeet not covered' },
    ],
  },
  {
    id: 'Q-1185',
    providerId: 'frames',
    total: 71000,
    team: '2 photographers',
    coverage: '2 days · 14 hrs',
    eventsCovered: ['Haldi', 'Mehendi', 'Sangeet', 'Wedding ceremony', 'Reception'],
    photos: '550+ edited photos',
    album: '40-page album',
    rawFiles: 'Included',
    rawIncluded: true,
    deliveryDays: 14,
    revisionRounds: 3,
    milestonePlan: [30, 20, 30, 20],
    cancellation: 'Full refund up to 45 days before',
    cancellationRefundable: true,
    validUntil: '12 Nov',
    tags: [{ tone: 'ok', label: 'Fastest delivery' }],
  },
]

export function getQuoteForProvider(providerId: string): Quote | undefined {
  return QUOTES.find((q) => q.providerId === providerId)
}

export const MILESTONE_NAMES = ['Booking', 'Shoot done', 'First delivery', 'Final approval']

export const MILESTONE_CONDITIONS = [
  'Paid now. Confirms your dates with the provider.',
  'Due before the first event. Released after you both confirm the shoot happened.',
  'Released when edited photos are uploaded and you approve them.',
  'Released when you accept the album and final files.',
]

/** Platform service fee (2%) plus 18% GST on the fee. Charged with the booking milestone. */
export function serviceFee(total: number): number {
  return Math.round(total * 0.02 * 1.18)
}

export function milestoneAmounts(q: Quote): number[] {
  return q.milestonePlan.map((pct) => Math.round((q.total * pct) / 100))
}
