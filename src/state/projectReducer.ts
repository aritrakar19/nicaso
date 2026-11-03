import type { ChangeRequest, ProjectDetail } from '@/types'
import { checkScope } from '@/lib/scope'
import { inr } from '@/lib/format'

/*
 * Pure project transitions. In production each of these is a server command;
 * the UI applies the server's response. Keeping them pure makes them easy to test.
 */

export function approveDelivery(p: ProjectDetail): ProjectDetail {
  if (p.phase !== 'review' || p.dispute) return p
  const held = p.milestones.find((m) => m.status === 'held')
  if (!held) return p
  let unlocked = false
  return {
    ...p,
    phase: 'final',
    milestones: p.milestones.map((m) => {
      if (m.id === held.id) return { ...m, status: 'released', note: 'Released after your approval · today' }
      if (!unlocked && m.status === 'locked') {
        unlocked = true
        return { ...m, status: 'upcoming', note: 'Due when final files and prints are delivered' }
      }
      return m
    }),
    deliverables: p.deliverables.map((d) => (d.id === 'prints' ? { ...d, note: 'Printing now' } : d)),
    payments: p.payments.map((r) => (r.milestoneId === held.id ? { ...r, status: 'released' } : r)),
    activity: [
      { at: 'Today', text: `You approved the first delivery · ${inr(held.amount)} released`, actor: 'You', kind: 'payment' },
      ...p.activity,
    ],
  }
}

export function togglePick(p: ProjectDetail, photoId: string): ProjectDetail {
  const picks = p.picks.includes(photoId) ? p.picks.filter((id) => id !== photoId) : [...p.picks, photoId]
  return { ...p, picks }
}

export function raiseChange(p: ProjectDetail, title: string): ProjectDetail {
  const result = checkScope(title, p)
  if (result.kind === 'empty') return p
  const inScope = result.kind === 'revision'
  const cr: ChangeRequest = {
    id: `CR-${p.changeRequests.length + 1}`,
    title: title.trim(),
    raisedOn: 'Today',
    scope: inScope ? 'in' : 'out',
    status: inScope ? 'in_progress' : 'awaiting_price',
    reason: result.kind === 'no_rounds' ? 'All included revision rounds are used' : undefined,
  }
  return {
    ...p,
    revisionsUsed: inScope ? p.revisionsUsed + 1 : p.revisionsUsed,
    changeRequests: [cr, ...p.changeRequests],
    activity: [{ at: 'Today', text: `${cr.id} raised: ${cr.title}`, actor: 'You', kind: 'event' }, ...p.activity],
  }
}

export function respondChange(p: ProjectDetail, changeId: string, accept: boolean): ProjectDetail {
  const cr = p.changeRequests.find((c) => c.id === changeId)
  if (!cr || cr.status !== 'priced') return p
  const changeRequests = p.changeRequests.map((c) =>
    c.id === changeId ? { ...c, status: accept ? ('accepted' as const) : ('declined' as const) } : c,
  )
  if (!accept) {
    return {
      ...p,
      changeRequests,
      activity: [{ at: 'Today', text: `${cr.id} declined, scope stays as signed`, actor: 'You', kind: 'event' }, ...p.activity],
    }
  }
  return {
    ...p,
    changeRequests,
    milestones: [
      ...p.milestones,
      {
        id: `co-${cr.id}`,
        name: `Change order ${cr.id} · ${cr.title.toLowerCase()}`,
        amount: cr.price ?? 0,
        status: 'upcoming',
        note: 'Added from an accepted change request · due on delivery',
      },
    ],
    activity: [
      { at: 'Today', text: `${cr.id} accepted · ${inr(cr.price ?? 0)} change order added`, actor: 'You', kind: 'event' },
      ...p.activity,
    ],
  }
}

export function sendMessage(p: ProjectDetail, text: string): ProjectDetail {
  const t = text.trim()
  if (!t) return p
  return { ...p, messages: [...p.messages, { from: 'client', name: 'You', at: 'Just now', text: t }] }
}

export function openDispute(p: ProjectDetail, caseId: string, reason: string): ProjectDetail {
  return {
    ...p,
    dispute: { caseId, reason },
    activity: [{ at: 'Today', text: `Dispute ${caseId} opened: ${reason}. Unreleased payments paused.`, actor: 'You', kind: 'event' }, ...p.activity],
  }
}
