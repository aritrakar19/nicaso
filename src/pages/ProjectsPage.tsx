import type { ImageKey } from '@/data/images'
import { IMG } from '@/data/images'
import { ENGAGEMENT_ID } from '@/data/projects'
import { QUOTES, WEDDING_BRIEF } from '@/data/quotes'
import { getProvider } from '@/data/providers'
import { ButtonLink } from '@/components/ui/Button'
import { Pill, type PillTone } from '@/components/ui/Pill'
import { Container, PageHeader } from '@/components/ui/Layout'
import { useToast } from '@/components/ui/Toast'
import { inr } from '@/lib/format'
import { href } from '@/lib/router'
import { needsAction, paymentTotals } from '@/lib/project'
import { useAppStore } from '@/state/AppStore'
import { Button } from '@/components/ui/Button'

interface Row {
  key: string
  image: ImageKey
  title: string
  who: string
  when: string
  id: string
  status: { tone: PillTone; label: string }
  next: string
  action: { label: string; href?: string; primary: boolean }
}

export function ProjectsPage() {
  const { state } = useAppStore()
  const toast = useToast()
  const engagement = state.projects[ENGAGEMENT_ID]
  const wedding = state.weddingProjectId ? state.projects[state.weddingProjectId] : undefined

  const rows: Row[] = []
  if (engagement) {
    const totals = paymentTotals(engagement.milestones)
    rows.push({
      key: engagement.id,
      image: engagement.coverImage,
      title: engagement.title,
      who: getProvider(engagement.providerId)?.name ?? '',
      when: engagement.dateLabel,
      id: engagement.id,
      status: needsAction(engagement) ? { tone: 'warn', label: 'Action needed' } : { tone: 'brand', label: 'In progress' },
      next:
        engagement.phase === 'review'
          ? `Review ${engagement.totalPhotos} photos and pick ${engagement.printTarget} for prints by ${engagement.reviewDeadline}`
          : `Prints due by ${engagement.finalDue} · ${inr(totals.released)} of ${inr(totals.contract)} released`,
      action: { label: 'Open project', href: href({ name: 'project', id: engagement.id }), primary: needsAction(engagement) },
    })
  }
  if (wedding) {
    const provider = getProvider(wedding.providerId)
    rows.push({
      key: wedding.id,
      image: wedding.coverImage,
      title: wedding.title,
      who: provider?.name ?? '',
      when: wedding.dateLabel,
      id: wedding.id,
      status: { tone: 'ok', label: 'Booked' },
      next: `Booking paid. Next: shot list call with ${provider?.team[0]?.name.split(' ')[0] ?? 'your photographer'} on 1 Dec`,
      action: { label: 'View project', href: href({ name: 'project', id: wedding.id }), primary: false },
    })
  } else {
    rows.push({
      key: WEDDING_BRIEF.id,
      image: 'couple',
      title: WEDDING_BRIEF.title,
      who: `Brief sent to ${WEDDING_BRIEF.invited} providers`,
      when: WEDDING_BRIEF.dates,
      id: WEDDING_BRIEF.id,
      status: { tone: 'brand', label: `${QUOTES.length} quotes received` },
      next: 'Compare quotes before the first one expires on 8 Nov',
      action: { label: 'Compare quotes', href: href({ name: 'quotes' }), primary: true },
    })
  }
  rows.push({
    key: 'PRJ-2026-03302',
    image: 'watch',
    title: 'Boi-Para bookstore catalogue',
    who: 'Studio Mishti',
    when: 'Aug 2026',
    id: 'PRJ-2026-03302',
    status: { tone: 'muted', label: 'Completed' },
    next: '120 photos delivered · all 4 milestones settled',
    action: { label: 'Leave a review', primary: false },
  })

  return (
    <>
      <PageHeader title="My projects" subtitle="Every booking is a project with its own scope, payments, photos and history." />
      <Container className="grid gap-3.5 pb-[100px] pt-6">
        {rows.map((r) => (
          <article key={r.key} className="grid grid-cols-[84px_minmax(0,1fr)] items-center gap-5 rounded-[20px] border border-line bg-white p-3.5 sm:grid-cols-[120px_minmax(0,1fr)_auto]">
            <img src={IMG[r.image]} alt="" className="size-[84px] rounded-[14px] object-cover sm:h-24 sm:w-[120px]" />
            <div className="min-w-0">
              <h2 className="text-lg">{r.title}</h2>
              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[13.5px] text-ink-2">
                <span>{r.who}</span>
                <span>{r.when}</span>
                <span className="font-mono text-[0.86em]">{r.id}</span>
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[13.5px]">
                <Pill tone={r.status.tone} dot>
                  {r.status.label}
                </Pill>
                <span>{r.next}</span>
              </div>
            </div>
            <div className="col-span-2 flex justify-end sm:col-span-1">
              {r.action.href ? (
                <ButtonLink href={r.action.href} variant={r.action.primary ? 'primary' : 'secondary'} size="sm">
                  {r.action.label}
                </ButtonLink>
              ) : (
                <Button variant="secondary" size="sm" onClick={() => toast('Reviews open after the review service is connected')}>
                  {r.action.label}
                </Button>
              )}
            </div>
          </article>
        ))}
      </Container>
    </>
  )
}
