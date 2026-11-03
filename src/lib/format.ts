/** Formats rupees with Indian digit grouping, e.g. 110000 -> ₹1,10,000. */
export function inr(amount: number): string {
  return '₹' + Math.round(amount).toLocaleString('en-IN')
}

/** Formats an ISO date (yyyy-mm-dd) as "13 Dec 2026". */
export function formatDate(iso: string): string {
  if (!iso) return '—'
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function plural(count: number, one: string, many = one + 's'): string {
  return `${count} ${count === 1 ? one : many}`
}
