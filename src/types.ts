import type { ImageKey } from '@/data/images'
import type { IconName } from '@/components/ui/Icon'
import type { PillTone } from '@/components/ui/Pill'

/* ---------- marketplace ---------- */

export type CategoryName =
  | 'Wedding'
  | 'Pre-wedding'
  | 'Corporate event'
  | 'Product & e-commerce'
  | 'Real estate'
  | 'Portrait & headshots'
  | 'Food & restaurant'
  | 'Hotel & travel'

export type CategoryFilter = CategoryName | 'All'

export interface Category {
  name: CategoryName
  image: ImageKey
  startingFrom: number
  icon: IconName
}

export type Offering = 'Edited photos' | 'Printed album' | 'Video' | 'Drone' | 'Raw files'

export interface TeamMember {
  name: string
  role: string
  avatar: ImageKey
}

export interface Provider {
  id: string
  name: string
  owner: string
  city: string
  cover: ImageKey
  avatar: ImageKey
  portfolio: ImageKey[]
  rating: number
  reviewCount: number
  completedProjects: number
  replyTime: string
  onTimeRate: number
  repeatRate: number
  startingPrice: number
  priceUnit: string
  categories: CategoryName[]
  offers: Offering[]
  bookedDates: string[]
  availabilityTag?: string
  yearsInBusiness: number
  about: string
  team: TeamMember[]
}

export interface ServicePackage {
  name: string
  price: number
  popular?: boolean
  items: string[]
}

export interface Review {
  author: string
  context: string
  rating: number
  text: string
}

/* ---------- briefs and quotes ---------- */

export type WeddingEvent = 'Haldi' | 'Mehendi' | 'Sangeet' | 'Wedding ceremony' | 'Reception'

export interface QuoteTag {
  tone: PillTone
  label: string
}

export interface Quote {
  id: string
  providerId: string
  total: number
  team: string
  coverage: string
  eventsCovered: WeddingEvent[]
  photos: string
  album: string
  rawFiles: string
  rawIncluded: boolean
  deliveryDays: number
  revisionRounds: number
  /** Percentage per milestone. Configurable per project, never hard-coded in logic. */
  milestonePlan: number[]
  cancellation: string
  cancellationRefundable: boolean
  validUntil: string
  tags: QuoteTag[]
}

/* ---------- projects ---------- */

/** Customer-facing project phase. Maps onto the lifecycle in lib/project.ts. */
export type ProjectPhase = 'booked' | 'review' | 'final'

/**
 * Settlement state of a milestone, kept separate from payment records.
 * held = paid by the client and held by the payment partner, not yet released.
 */
export type MilestoneStatus = 'released' | 'held' | 'upcoming' | 'locked'

export interface Milestone {
  id: string
  name: string
  amount: number
  status: MilestoneStatus
  note: string
}

export interface Deliverable {
  id: string
  label: string
  done: boolean
  note: string
}

export type GalleryTag = 'Ring ceremony' | 'Family' | 'Candids' | 'Details'

export interface GalleryPhoto {
  id: string
  image: ImageKey
  tag: GalleryTag
  /** CSS object-position so repeated sample images crop differently. */
  focus: string
}

export type ChangeStatus = 'in_progress' | 'awaiting_price' | 'priced' | 'accepted' | 'declined'

export interface ChangeRequest {
  id: string
  title: string
  raisedOn: string
  scope: 'in' | 'out'
  status: ChangeStatus
  price?: number
  extraDays?: number
  dueOn?: string
  reason?: string
}

/** A gateway-confirmed payment record. Never created from a client callback alone. */
export interface PaymentRecord {
  date: string
  label: string
  milestoneId: string
  paymentId: string
  utr: string
  amount: number
  status: 'confirmed' | 'held' | 'released'
}

export interface ActivityEvent {
  at: string
  text: string
  actor: string
  kind: 'payment' | 'event'
}

export interface ChatMessage {
  from: 'client' | 'provider'
  name: string
  at: string
  text: string
}

export interface ProjectFile {
  name: string
  detail: string
  kind: 'document' | 'invoice'
}

export interface ProjectDetail {
  id: string
  title: string
  providerId: string
  dateLabel: string
  durationLabel: string
  venue: string
  coverImage: ImageKey
  phase: ProjectPhase
  reviewDeadline?: string
  finalDue?: string
  printTarget: number
  totalPhotos: number
  revisionsIncluded: number
  revisionsUsed: number
  /** Words that signal a request is outside the signed scope. */
  outOfScopeTerms: string[]
  milestones: Milestone[]
  deliverables: Deliverable[]
  gallery: GalleryPhoto[]
  picks: string[]
  changeRequests: ChangeRequest[]
  payments: PaymentRecord[]
  activity: ActivityEvent[]
  messages: ChatMessage[]
  files: ProjectFile[]
  team: TeamMember[]
  dispute?: { caseId: string; reason: string }
}
