import type { GalleryPhoto, Milestone, ProjectDetail, Provider, Quote } from '@/types'
import type { PaymentConfirmation } from '@/services/payments'
import { inr } from '@/lib/format'
import { MILESTONE_NAMES, WEDDING_BRIEF, WEDDING_EVENTS, milestoneAmounts, serviceFee } from './quotes'

export const ENGAGEMENT_ID = 'PRJ-2026-04817'
export const WEDDING_PROJECT_ID = 'PRJ-2026-05120'

const gallery: GalleryPhoto[] = [
  { id: 'NL_0118', image: 'ringExchange', tag: 'Ring ceremony', focus: '50% 30%' },
  { id: 'NL_0142', image: 'varmala', tag: 'Ring ceremony', focus: '50% 40%' },
  { id: 'NL_0203', image: 'royalCouple', tag: 'Family', focus: '40% 30%' },
  { id: 'NL_0067', image: 'bridePortrait', tag: 'Candids', focus: '50% 30%' },
  { id: 'NL_0251', image: 'garlandExchange', tag: 'Family', focus: '50% 40%' },
  { id: 'NL_0310', image: 'corridorPortrait', tag: 'Details', focus: '50% 40%' },
  { id: 'NL_0129', image: 'couple', tag: 'Ring ceremony', focus: '50% 50%' },
  { id: 'NL_0344', image: 'preWedding', tag: 'Candids', focus: '50% 50%' },
  { id: 'NL_0021', image: 'weddingDetails', tag: 'Details', focus: '50% 50%' },
  { id: 'NL_0015', image: 'bridePortrait', tag: 'Details', focus: '60% 80%' },
  { id: 'NL_0388', image: 'royalCouple', tag: 'Candids', focus: '75% 20%' },
  { id: 'NL_0277', image: 'varmala', tag: 'Family', focus: '30% 75%' },
]

export const engagementProject: ProjectDetail = {
  id: ENGAGEMENT_ID,
  title: 'Engagement ceremony',
  providerId: 'northlight',
  dateLabel: '18 Oct 2026',
  durationLabel: '5 hrs',
  venue: 'The Bonedi Bari, Shyambazar',
  coverImage: 'ringExchange',
  phase: 'review',
  reviewDeadline: '8 Nov',
  finalDue: '15 Nov',
  printTarget: 40,
  totalPhotos: 412,
  revisionsIncluded: 2,
  revisionsUsed: 1,
  outOfScopeTerms: ['video', 'reel', 'film', 'sangeet', 'mehendi', 'haldi', 'extra hour', 'more hours', 'drone', 'raw', 'album', 'another day', 'second day'],
  milestones: [
    { id: 'm1', name: 'Booking', amount: 7600, status: 'released', note: 'Paid and released · 22 Sep' },
    { id: 'm2', name: 'Shoot done', amount: 11400, status: 'released', note: 'Released after you confirmed the shoot · 19 Oct' },
    { id: 'm3', name: 'First delivery', amount: 11400, status: 'held', note: 'Paid by you and held · released when you approve' },
    { id: 'm4', name: 'Final approval', amount: 7600, status: 'locked', note: 'Unlocks after the first delivery is approved' },
  ],
  deliverables: [
    { id: 'coverage', label: 'Ring ceremony and family portraits, 5 hrs', done: true, note: 'Done 18 Oct' },
    { id: 'photos', label: '300+ edited photos', done: true, note: '412 uploaded' },
    { id: 'prints', label: '40 photos printed, 8×12', done: false, note: 'Waiting for your picks' },
    { id: 'revisions', label: '2 revision rounds', done: false, note: '1 in use (CR-1)' },
  ],
  gallery,
  picks: ['NL_0118', 'NL_0067', 'NL_0129'],
  changeRequests: [
    { id: 'CR-2', title: 'Add a 1-minute highlight reel', raisedOn: '2 Nov', scope: 'out', status: 'priced', price: 6500, extraDays: 5 },
    { id: 'CR-1', title: 'Fix the lighting on 6 stage photos', raisedOn: '2 Nov', scope: 'in', status: 'in_progress', dueOn: '5 Nov' },
  ],
  payments: [
    { date: '22 Sep', label: 'Booking + service fee', milestoneId: 'm1', paymentId: 'pay_MZ71kQ2c', utr: '426511290034', amount: 8497, status: 'confirmed' },
    { date: '15 Oct', label: 'Shoot done', milestoneId: 'm2', paymentId: 'pay_N2b8LpX0', utr: '428810457712', amount: 11400, status: 'released' },
    { date: '1 Nov', label: 'First delivery', milestoneId: 'm3', paymentId: 'pay_NB3q9TzW', utr: '430501128839', amount: 11400, status: 'held' },
  ],
  activity: [
    { at: '2 Nov, 10:30', text: 'CR-2 priced at ₹6,500 and 5 extra days', actor: 'Sneha Kapoor', kind: 'event' },
    { at: '2 Nov, 09:15', text: 'CR-1 and CR-2 raised', actor: 'You', kind: 'event' },
    { at: '1 Nov, 20:15', text: '₹11,400 paid for milestone 3, held by payment partner', actor: 'Payment partner', kind: 'payment' },
    { at: '1 Nov, 18:42', text: '412 edited photos uploaded', actor: 'Sneha Kapoor', kind: 'event' },
    { at: '19 Oct, 09:12', text: '₹11,400 released for milestone 2', actor: 'Payment partner', kind: 'payment' },
    { at: '19 Oct, 09:10', text: 'You confirmed the shoot happened', actor: 'You', kind: 'event' },
    { at: '18 Oct, 22:30', text: 'Shoot marked done, 5 h 20 min on site', actor: 'Sneha Kapoor', kind: 'event' },
    { at: '22 Sep, 14:02', text: 'Booking payment confirmed', actor: 'Payment partner', kind: 'payment' },
    { at: '21 Sep, 19:47', text: 'Scope v1 signed by both sides', actor: 'You and Northlight', kind: 'event' },
  ],
  messages: [
    { from: 'provider', name: 'Sneha', at: '1 Nov, 18:45', text: 'All 412 photos are up. Pick your 40 favourites for prints by 8 Nov and we will start printing.' },
    { from: 'client', name: 'You', at: '1 Nov, 21:02', text: 'They look lovely! Can the stage photos be a little brighter?' },
    { from: 'provider', name: 'Sneha', at: '1 Nov, 21:10', text: 'Yes, that is one of your included revisions. I have logged it as CR-1.' },
  ],
  files: [
    { name: 'Scope and contract v1', detail: 'Signed by you and Northlight · 21 Sep', kind: 'document' },
    { name: 'Quote Q-0974', detail: '₹38,000 · accepted 21 Sep', kind: 'document' },
    { name: 'Shot list', detail: 'Shared by Sneha · 10 Oct', kind: 'document' },
    { name: 'Invoice INV-0412', detail: 'Booking milestone · 22 Sep', kind: 'invoice' },
    { name: 'Invoice INV-0488', detail: 'Shoot done milestone · 19 Oct', kind: 'invoice' },
  ],
  team: [
    { name: 'Sneha Kapoor', role: 'Lead photographer', avatar: 'face4' },
    { name: 'Kabir Sen', role: 'Second photographer', avatar: 'face2' },
  ],
}

/** Builds the wedding project once the booking milestone is confirmed by the payment partner. */
export function buildWeddingProject(quote: Quote, provider: Provider, payment: PaymentConfirmation): ProjectDetail {
  const amounts = milestoneAmounts(quote)
  const milestones: Milestone[] = MILESTONE_NAMES.map((name, i) => ({
    id: `m${i + 1}`,
    name,
    amount: amounts[i],
    status: i === 0 ? 'released' : i === 1 ? 'upcoming' : 'locked',
    note:
      i === 0
        ? 'Paid and released · today'
        : i === 1
          ? 'Due before 13 Dec · released after the shoot'
          : 'Unlocks after the previous milestone',
  }))
  const missing = WEDDING_EVENTS.filter((e) => !quote.eventsCovered.includes(e)).map((e) => e.toLowerCase())
  return {
    id: WEDDING_PROJECT_ID,
    title: WEDDING_BRIEF.title,
    providerId: provider.id,
    dateLabel: WEDDING_BRIEF.dates,
    durationLabel: quote.coverage,
    venue: WEDDING_BRIEF.venue,
    coverImage: 'couple',
    phase: 'booked',
    printTarget: 0,
    totalPhotos: 0,
    revisionsIncluded: quote.revisionRounds,
    revisionsUsed: 0,
    outOfScopeTerms: ['video', 'reel', 'film', 'drone', 'extra day', 'third day', 'pre-wedding', ...missing, ...(quote.rawIncluded ? [] : ['raw'])],
    milestones,
    deliverables: [
      { id: 'coverage', label: `${quote.eventsCovered.join(', ')} · ${quote.coverage}`, done: false, note: '13–14 Dec' },
      { id: 'photos', label: quote.photos, done: false, note: `Within ${quote.deliveryDays} days` },
      { id: 'album', label: quote.album, done: false, note: 'After you pick photos' },
      { id: 'raw', label: `Raw files: ${quote.rawFiles}`, done: false, note: quote.rawIncluded ? 'With final delivery' : 'Not in scope' },
    ],
    gallery: [],
    picks: [],
    changeRequests: [],
    payments: [
      {
        date: 'Today',
        label: 'Booking + service fee',
        milestoneId: 'm1',
        paymentId: payment.paymentId,
        utr: payment.utr,
        amount: amounts[0] + serviceFee(quote.total),
        status: 'confirmed',
      },
    ],
    activity: [
      { at: 'Today', text: `Booking payment of ${inr(payment.amount)} confirmed`, actor: 'Payment partner', kind: 'payment' },
      { at: 'Today', text: 'Scope v1 signed by both sides', actor: `You and ${provider.name}`, kind: 'event' },
      { at: 'Today', text: `Quote ${quote.id} accepted`, actor: 'You', kind: 'event' },
    ],
    messages: [
      {
        from: 'provider',
        name: provider.team[0]?.name.split(' ')[0] ?? provider.name,
        at: 'Today',
        text: 'Thank you for booking with us! I will call you on 1 Dec to plan the shot list for every event.',
      },
    ],
    files: [
      { name: 'Scope and contract v1', detail: `Signed by you and ${provider.name} · today`, kind: 'document' },
      { name: `Quote ${quote.id}`, detail: `${inr(quote.total)} · accepted today`, kind: 'document' },
      { name: 'Invoice INV-0521', detail: 'Booking milestone · today', kind: 'invoice' },
    ],
    team: provider.team,
  }
}
