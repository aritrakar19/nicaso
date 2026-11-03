import type { ReactNode } from 'react'
import type { Quote } from '@/types'
import { QUOTES, WEDDING_BRIEF, WEDDING_EVENTS } from '@/data/quotes'
import { getProvider } from '@/data/providers'
import { IMG } from '@/data/images'
import { ButtonLink } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { Pill } from '@/components/ui/Pill'
import { Container, PageHeader } from '@/components/ui/Layout'
import { cn } from '@/lib/cn'
import { inr } from '@/lib/format'
import { href } from '@/lib/router'
import { useAppStore } from '@/state/AppStore'

type Tone = 'good' | 'bad' | undefined

const fastest = Math.min(...QUOTES.map((q) => q.deliveryDays))

const ROWS: { label: string; cell: (q: Quote) => ReactNode; tone?: (q: Quote) => Tone }[] = [
  { label: 'Team', cell: (q) => q.team },
  { label: 'Coverage', cell: (q) => q.coverage },
  {
    label: 'Events covered',
    cell: (q) => (
      <ul className="flex flex-col gap-1">
        {WEDDING_EVENTS.map((e) =>
          q.eventsCovered.includes(e) ? (
            <li key={e} className="flex items-center gap-1.5 text-[13.5px]">
              <Icon name="check" size={14} className="text-ok" />
              {e}
            </li>
          ) : (
            <li key={e} className="flex items-center gap-1.5 text-[13.5px] font-semibold text-bad">
              <Icon name="x" size={14} />
              {e} not covered
            </li>
          ),
        )}
      </ul>
    ),
  },
  { label: 'Edited photos', cell: (q) => q.photos },
  { label: 'Album', cell: (q) => q.album },
  { label: 'Raw files', cell: (q) => q.rawFiles, tone: (q) => (q.rawIncluded ? 'good' : undefined) },
  { label: 'Delivery', cell: (q) => `${q.deliveryDays} days after the wedding`, tone: (q) => (q.deliveryDays === fastest ? 'good' : undefined) },
  { label: 'Revision rounds', cell: (q) => `${q.revisionRounds} rounds` },
  { label: 'Payment plan', cell: (q) => q.milestonePlan.map((x) => `${x}%`).join(' · ') },
  { label: 'If you cancel', cell: (q) => q.cancellation, tone: (q) => (q.cancellationRefundable ? undefined : 'bad') },
  {
    label: 'Track record',
    cell: (q) => {
      const p = getProvider(q.providerId)!
      return `${p.rating} ★ · ${p.completedProjects} projects · ${p.onTimeRate}% on time`
    },
  },
  { label: 'Quote valid until', cell: (q) => q.validUntil },
]

export function QuotesPage() {
  const { state } = useAppStore()
  const booked = state.weddingProjectId ? state.projects[state.weddingProjectId] : undefined

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'My projects', href: href({ name: 'projects' }) }, { label: WEDDING_BRIEF.title }]}
        title="Compare your quotes"
        subtitle={`${WEDDING_BRIEF.dates} · ${WEDDING_BRIEF.venue} · ${QUOTES.length} of ${WEDDING_BRIEF.invited} quotes received`}
      >
        {booked ? (
          <div className="mt-[22px] flex flex-wrap items-center justify-between gap-4 rounded-[18px] border border-ok/30 bg-ok-bg px-5 py-4">
            <span className="flex items-center gap-3 font-semibold text-ok-ink">
              <Icon name="check" />
              You booked {getProvider(booked.providerId)?.name}. The other quotes have been declined politely for you.
            </span>
            <ButtonLink href={href({ name: 'project', id: booked.id })} size="sm">
              Open project
            </ButtonLink>
          </div>
        ) : (
          <div className="mt-[22px] flex items-start gap-3.5 rounded-[18px] border border-[#dccff7] bg-linear-to-b from-lilac to-white px-5 py-[18px]">
            <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-brand-gradient text-white">
              <Icon name="spark" />
            </span>
            <div>
              <p className="text-[14.5px]">
                Northlight and Frames cover all 5 events with 2 photographers. Lensary is ₹6,000 cheaper but does not cover the Sangeet. Frames delivers fastest, in 14 days, and includes a third revision round.
              </p>
              <small className="mt-1.5 block text-[12.5px] text-ink-3">Auto-summary of the quotes below. Check the details before you decide.</small>
            </div>
          </div>
        )}
      </PageHeader>

      <Container className="pb-[100px]">
        <div className="mt-5 overflow-x-auto rounded-[22px] border border-line bg-white">
          <table className="w-full min-w-[840px] border-collapse text-left text-sm">
            <caption className="sr-only">Quotes for {WEDDING_BRIEF.title}, compared</caption>
            <thead>
              <tr>
                <th scope="col" className="w-[19%] px-[18px] pb-[18px] pt-5 align-top text-[13px] font-semibold text-ink-3">
                  Same brief, three answers
                </th>
                {QUOTES.map((q) => {
                  const p = getProvider(q.providerId)!
                  return (
                    <th key={q.id} scope="col" className="w-[27%] px-[18px] pb-[18px] pt-5 align-top font-normal">
                      <div className="flex flex-col gap-2.5">
                        <div className="flex items-center gap-2.5">
                          <img src={IMG[p.avatar]} alt="" className="size-10 rounded-full object-cover" />
                          <div>
                            <b className="block font-display text-base font-semibold leading-tight">{p.name}</b>
                            <small className="font-mono text-[12px] text-ink-3">{q.id}</small>
                          </div>
                        </div>
                        <b className="font-display text-[26px] font-semibold">{inr(q.total)}</b>
                        <div className="flex flex-wrap gap-1.5">
                          {booked?.providerId === q.providerId && <Pill tone="ok">Booked</Pill>}
                          {q.tags.map((t) => (
                            <Pill key={t.label} tone={t.tone}>
                              {t.label}
                            </Pill>
                          ))}
                        </div>
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label}>
                  <th scope="row" className="border-t border-line bg-tint px-[18px] py-3.5 align-top text-[13.5px] font-semibold text-ink-2">
                    {row.label}
                  </th>
                  {QUOTES.map((q) => {
                    const tone = row.tone?.(q)
                    return (
                      <td key={q.id} className={cn('border-t border-line px-[18px] py-3.5 align-top', tone === 'good' && 'font-semibold text-ok', tone === 'bad' && 'font-semibold text-bad')}>
                        {row.cell(q)}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="border-t border-line" />
                {QUOTES.map((q) => (
                  <td key={q.id} className="border-t border-line px-[18px] py-[18px]">
                    <div className="flex flex-col gap-2">
                      {!booked && (
                        <ButtonLink href={href({ name: 'checkout', providerId: q.providerId })} size="sm">
                          Choose this quote
                        </ButtonLink>
                      )}
                      <ButtonLink href={href({ name: 'provider', id: q.providerId })} variant="secondary" size="sm">
                        View profile
                      </ButtonLink>
                    </div>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="mt-3 text-[12.5px] text-ink-3">Choosing a quote does not charge you. You review the scope and milestone plan first.</p>
      </Container>
    </>
  )
}
