import type { ProjectDetail } from '@/types'

export type ScopeResult =
  | { kind: 'empty' }
  | { kind: 'revision'; roundsLeft: number; roundsIncluded: number }
  | { kind: 'out'; term: string }
  | { kind: 'no_rounds' }

/**
 * First-pass check of a change request against the signed scope.
 * Advisory only: the provider confirms, and out-of-scope work always needs
 * a priced change order the customer accepts before work starts.
 */
export function checkScope(
  text: string,
  project: Pick<ProjectDetail, 'outOfScopeTerms' | 'revisionsIncluded' | 'revisionsUsed'>,
): ScopeResult {
  const s = text.toLowerCase().trim()
  if (!s) return { kind: 'empty' }
  const term = project.outOfScopeTerms.find((t) => s.includes(t))
  if (term) return { kind: 'out', term }
  const left = project.revisionsIncluded - project.revisionsUsed
  if (left <= 0) return { kind: 'no_rounds' }
  return { kind: 'revision', roundsLeft: left, roundsIncluded: project.revisionsIncluded }
}

export function scopeMessage(result: ScopeResult, providerName: string): string {
  switch (result.kind) {
    case 'empty':
      return ''
    case 'revision':
      return `This looks like a revision, so it is covered at no extra cost. You have ${result.roundsLeft} of ${result.roundsIncluded} revision rounds left and this uses one.`
    case 'out':
      return `This is not in your signed scope ("${result.term}" is not listed). ${providerName} will send a price and time first. Nothing starts until you accept.`
    case 'no_rounds':
      return `All included revision rounds are used. ${providerName} will price an extra round before starting.`
  }
}
