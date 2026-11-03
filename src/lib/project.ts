import type { Milestone, ProjectDetail, ProjectPhase } from '@/types'

/** Customer-visible lifecycle, from PRD section 9. */
export const LIFECYCLE = [
  'Brief',
  'Quote',
  'Scope signed',
  'Booking paid',
  'Shoot',
  'Photos uploaded',
  'Your review',
  'Final delivery',
  'Closed',
] as const

const CURRENT_STAGE: Record<ProjectPhase, number> = { booked: 4, review: 6, final: 7 }

export function currentStage(phase: ProjectPhase): number {
  return CURRENT_STAGE[phase]
}

export interface PaymentTotals {
  contract: number
  paid: number
  released: number
  held: number
}

export function paymentTotals(milestones: Milestone[]): PaymentTotals {
  const sum = (status: Milestone['status']) =>
    milestones.filter((m) => m.status === status).reduce((t, m) => t + m.amount, 0)
  const released = sum('released')
  const held = sum('held')
  return {
    contract: milestones.reduce((t, m) => t + m.amount, 0),
    paid: released + held,
    released,
    held,
  }
}

export function revisionsLeft(p: ProjectDetail): number {
  return Math.max(0, p.revisionsIncluded - p.revisionsUsed)
}

/** Does this project need the customer to do something? */
export function needsAction(p: ProjectDetail): boolean {
  return p.phase === 'review' || p.changeRequests.some((c) => c.status === 'priced')
}

export const MILESTONE_LABEL: Record<Milestone['status'], string> = {
  released: 'Released',
  held: 'Held',
  upcoming: 'Upcoming',
  locked: 'Locked',
}
