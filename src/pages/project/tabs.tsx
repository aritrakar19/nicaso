import { useState } from 'react'
import type { GalleryTag, ProjectDetail, Provider } from '@/types'
import { IMG } from '@/data/images'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Controls'
import { Icon } from '@/components/ui/Icon'
import { Pill } from '@/components/ui/Pill'
import { Panel } from '@/components/ui/Layout'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/cn'
import { inr } from '@/lib/format'
import { paymentTotals, revisionsLeft } from '@/lib/project'
import { useAppStore } from '@/state/AppStore'
import { MilestoneList } from './parts'

export function OverviewTab({ project }: { project: ProjectDetail }) {
  const totals = paymentTotals(project.milestones)
  return (
    <div className="grid gap-[18px]">
      <Panel title="Milestones" description={`${inr(totals.contract)} contract · money moves only when a step is done`}>
        <MilestoneList project={project} />
      </Panel>
      <Panel title="Deliverables checklist" description="From your signed scope">
        <ul>
          {project.deliverables.map((d, i) => (
            <li key={d.id} className={cn('grid grid-cols-[24px_minmax(0,1fr)_auto] items-center gap-2.5 py-[11px] text-[14.5px]', i > 0 && 'border-t border-line')}>
              <Icon name={d.done ? 'check' : 'clock'} size={17} className={d.done ? 'text-ok' : 'text-ink-3'} />
              <b className="font-semibold">{d.label}</b>
              <span className="text-right text-[13px] text-ink-2">{d.id === 'revisions' ? `${project.revisionsUsed} of ${project.revisionsIncluded} used` : d.note}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}

const FILTERS: ('All' | 'Favourites' | GalleryTag)[] = ['All', 'Favourites', 'Ring ceremony', 'Family', 'Candids', 'Details']

export function GalleryTab({ project, onApprove, onRequestFix }: { project: ProjectDetail; onApprove: () => void; onRequestFix: () => void }) {
  const { actions } = useAppStore()
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')

  if (project.gallery.length === 0) {
    return (
      <div className="rounded-[20px] border border-dashed border-line-2 p-12 text-center text-ink-2">
        <Icon name="image" size={28} className="mx-auto text-brand" />
        <b className="mt-3 block text-ink">Photos appear here after the shoot</b>
        <p className="mt-1.5">Your photographer uploads edited photos to this private gallery. You will get a notification when they are ready.</p>
      </div>
    )
  }

  const photos = project.gallery.filter((g) => filter === 'All' || (filter === 'Favourites' ? project.picks.includes(g.id) : g.tag === filter))
  const pickPct = Math.min(100, (project.picks.length / project.printTarget) * 100)
  const approved = project.phase !== 'review'

  return (
    <div>
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <Chip key={f} active={filter === f} count={f === 'Favourites' ? project.picks.length : undefined} onClick={() => setFilter(f)}>
              {f}
            </Chip>
          ))}
        </div>
        <div className="flex min-w-[220px] flex-col gap-1.5">
          <small className="text-[13px] text-ink-2">
            <b>
              {project.picks.length} of {project.printTarget}
            </b>{' '}
            picked for prints
          </small>
          <div className="h-2 overflow-hidden rounded bg-line" role="progressbar" aria-valuenow={project.picks.length} aria-valuemin={0} aria-valuemax={project.printTarget} aria-label="Photos picked for prints">
            <i className="block h-full bg-brand transition-[width] duration-200" style={{ width: `${pickPct}%` }} />
          </div>
        </div>
      </div>

      {photos.length > 0 ? (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
          {photos.map((g) => {
            const picked = project.picks.includes(g.id)
            return (
              <figure key={g.id} className={cn('relative aspect-square overflow-hidden rounded-[14px] bg-tint-2', picked && 'outline-3 -outline-offset-3 outline-brand')}>
                <img src={IMG[g.image]} alt={`${g.tag}, ${g.id}`} loading="lazy" className="size-full object-cover" style={{ objectPosition: g.focus }} />
                <span className="pointer-events-none absolute inset-0 grid -rotate-[24deg] place-items-center font-display text-[13px] font-bold tracking-[0.3em] text-white/40" aria-hidden="true">
                  PREVIEW
                </span>
                <figcaption className="absolute bottom-2 left-2 rounded-md bg-[#140a28]/55 px-[7px] py-[3px] font-mono text-[10.5px] text-white">{g.id}</figcaption>
                <button
                  type="button"
                  aria-pressed={picked}
                  aria-label={picked ? `Remove ${g.id} from picks` : `Pick ${g.id} for prints`}
                  onClick={() => actions.togglePick(project.id, g.id)}
                  className={cn('absolute right-2 top-2 grid size-[34px] place-items-center rounded-full', picked ? 'bg-brand text-white' : 'bg-white/90 text-ink-2')}
                >
                  <Icon name="heart" size={17} fill={picked ? 'currentColor' : 'none'} />
                </button>
              </figure>
            )
          })}
        </div>
      ) : (
        <div className="rounded-[20px] border border-dashed border-line-2 p-12 text-center text-ink-2">No photos in this filter yet. Tap the heart on a photo to pick it.</div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3.5 rounded-2xl bg-tint px-[18px] py-4">
        <p className="text-[13.5px] text-ink-2">
          Showing {project.gallery.length} of {project.totalPhotos}. Previews are watermarked. Full-resolution files unlock when you approve.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={onRequestFix}>
            Request a fix
          </Button>
          <Button size="sm" disabled={approved || Boolean(project.dispute)} onClick={onApprove}>
            {approved ? 'Approved' : 'Approve delivery'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export function PaymentsTab({ project }: { project: ProjectDetail }) {
  const t = paymentTotals(project.milestones)
  const stats: [string, number][] = [
    ['Contract', t.contract],
    ['Paid by you', t.paid],
    ['Released to provider', t.released],
    ['Held by partner', t.held],
  ]
  const statusPill = { confirmed: ['ok', 'Confirmed'], held: ['warn', 'Held'], released: ['ok', 'Released'] } as const
  return (
    <div className="grid gap-[18px]">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[18px] border border-line bg-line sm:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label} className="bg-white px-4 py-3.5">
            <span className="block text-[12.5px] font-semibold text-ink-3">{label}</span>
            <b className="font-display text-[21px] font-semibold tabular-nums">{inr(value)}</b>
          </div>
        ))}
      </div>
      <Panel title="Milestones" description="The payment partner holds what you pay until the matching step is done.">
        <MilestoneList project={project} />
      </Panel>
      <Panel title="Payment records" description="Each record is confirmed by the payment partner, not by the app.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-xs font-bold uppercase tracking-[0.06em] text-ink-3">
                <th className="px-3 pb-2.5">Date</th>
                <th className="px-3 pb-2.5">For</th>
                <th className="px-3 pb-2.5">Reference</th>
                <th className="px-3 pb-2.5 text-right">Amount</th>
                <th className="px-3 pb-2.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {project.payments.map((r) => {
                const [tone, label] = statusPill[r.status]
                return (
                  <tr key={r.paymentId} className="border-t border-line align-top">
                    <td className="px-3 py-[13px]">{r.date}</td>
                    <td className="px-3 py-[13px]">{r.label}</td>
                    <td className="px-3 py-[13px] font-mono text-[12.5px]">
                      {r.paymentId} · UTR {r.utr}
                    </td>
                    <td className="px-3 py-[13px] text-right tabular-nums">{inr(r.amount)}</td>
                    <td className="px-3 py-[13px]">
                      <Pill tone={tone}>{label}</Pill>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}

export function ChangesTab({ project, provider, onNew }: { project: ProjectDetail; provider: Provider; onNew: () => void }) {
  const { actions } = useAppStore()
  const toast = useToast()
  return (
    <div>
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-[56ch] text-ink-2">
          Anything you ask for after signing is checked against the scope. Fixes inside it use your revision rounds ({revisionsLeft(project)} of {project.revisionsIncluded} left). Anything new gets a price first.
        </p>
        <Button size="sm" onClick={onNew}>
          <Icon name="plus" size={16} />
          New request
        </Button>
      </div>
      {project.changeRequests.length === 0 && (
        <div className="rounded-[20px] border border-dashed border-line-2 p-10 text-center text-ink-2">No change requests yet. Use them for fixes or anything extra you want added.</div>
      )}
      <div className="grid gap-3">
        {project.changeRequests.map((c) => (
          <article key={c.id} className="rounded-[18px] border border-line bg-white px-5 py-[18px]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <b className="text-[15.5px] font-bold">
                  <span className="mr-1.5 font-mono text-[0.86em] text-ink-3">{c.id}</span>
                  {c.title}
                </b>
                <div className="text-[12.5px] text-ink-3">Raised by you · {c.raisedOn}</div>
              </div>
              <Pill tone={c.scope === 'in' ? 'ok' : 'warn'}>{c.scope === 'in' ? 'Inside your scope' : 'Outside your scope'}</Pill>
            </div>
            {c.status === 'in_progress' && (
              <p className="mt-2 text-sm text-ink-2">Covered by your included revision rounds. No extra cost. {provider.name} is working on it{c.dueOn ? `, due ${c.dueOn}` : ''}.</p>
            )}
            {c.status === 'awaiting_price' && (
              <p className="mt-2 text-sm text-ink-2">{c.reason ? `${c.reason}. ` : 'Not in your signed scope. '}Waiting for {provider.name} to send a price and time estimate, usually within a day.</p>
            )}
            {c.status === 'priced' && (
              <>
                <p className="mt-2 text-sm text-ink-2">Not in your signed scope. {provider.name} sent a price. Nothing starts until you accept.</p>
                <div className="mt-3 flex flex-wrap gap-4">
                  {[
                    ['Price', inr(c.price ?? 0)],
                    ['Extra time', `${c.extraDays} days`],
                    ['Paid', 'On delivery'],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-xl bg-tint px-3.5 py-2.5">
                      <span className="block text-xs font-semibold text-ink-3">{k}</span>
                      <b className="font-display text-lg font-semibold">{v}</b>
                    </div>
                  ))}
                </div>
                <div className="mt-3.5 flex flex-wrap gap-2.5">
                  <Button
                    size="sm"
                    onClick={() => {
                      actions.respondChange(project.id, c.id, true)
                      toast(`${c.id} accepted. A ${inr(c.price ?? 0)} milestone was added.`)
                    }}
                  >
                    Accept and add to project
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      actions.respondChange(project.id, c.id, false)
                      toast(`${c.id} declined. The scope stays as signed.`)
                    }}
                  >
                    Decline
                  </Button>
                </div>
              </>
            )}
            {c.status === 'accepted' && <p className="mt-2 text-sm text-ink-2">Accepted. Added as a new milestone of {inr(c.price ?? 0)} and {c.extraDays} days to the delivery date.</p>}
            {c.status === 'declined' && <p className="mt-2 text-sm text-ink-2">Declined. Your scope and price stay as signed.</p>}
          </article>
        ))}
      </div>
    </div>
  )
}

export function FilesTab({ project }: { project: ProjectDetail }) {
  const toast = useToast()
  return (
    <Panel>
      <ul>
        {project.files.map((f, i) => (
          <li key={f.name} className={cn('flex items-center gap-3.5 py-3.5', i > 0 && 'border-t border-line')}>
            <span className="grid size-[42px] shrink-0 place-items-center rounded-xl bg-tint-2 text-brand-ink">
              <Icon name={f.kind === 'invoice' ? 'wallet' : 'file'} size={19} />
            </span>
            <span className="min-w-0 flex-1">
              <b className="block text-[14.5px]">{f.name}</b>
              <small className="text-[12.5px] text-ink-3">{f.detail}</small>
            </span>
            <Button variant="secondary" size="sm" onClick={() => toast('PDF downloads arrive with the document service')}>
              <Icon name="download" size={16} />
              PDF
            </Button>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

export function ActivityTab({ project }: { project: ProjectDetail }) {
  return (
    <Panel title="Project history" description="Every action is recorded with who did it and when. This is the evidence used if there is a dispute.">
      <ol>
        {project.activity.map((a, i) => (
          <li key={`${a.at}-${a.text}`} className="relative grid grid-cols-[22px_minmax(0,1fr)] gap-x-3 pb-5 sm:grid-cols-[120px_22px_minmax(0,1fr)] sm:gap-x-3.5">
            {i < project.activity.length - 1 && <span className="absolute bottom-0 left-2.5 top-[22px] w-0.5 bg-line sm:left-[144px]" aria-hidden="true" />}
            <time className="col-start-2 row-start-2 text-[12.5px] text-ink-3 sm:col-start-1 sm:row-start-1 sm:pt-0.5 sm:text-right">{a.at}</time>
            <span className={cn('relative z-[1] grid size-[22px] place-items-center rounded-full', a.kind === 'payment' ? 'bg-ok-bg text-ok' : 'bg-tint-2 text-brand-ink')}>
              <Icon name={a.kind === 'payment' ? 'wallet' : 'check'} size={12} />
            </span>
            <div>
              <b className="block text-[14.5px] font-semibold">{a.text}</b>
              <small className="text-[12.5px] text-ink-3">{a.actor}</small>
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  )
}
