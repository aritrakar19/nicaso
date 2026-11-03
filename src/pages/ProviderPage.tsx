import { useState, type ReactNode } from 'react'
import { IMG } from '@/data/images'
import { SAMPLE_REVIEWS, getProvider, isAvailable, isEventProvider, packagesFor } from '@/data/providers'
import { Stars } from '@/components/marketplace/ProviderCard'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Controls'
import { Icon } from '@/components/ui/Icon'
import { Pill } from '@/components/ui/Pill'
import { Container, InfoNote, PageHeader } from '@/components/ui/Layout'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/cn'
import { inr } from '@/lib/format'
import { href } from '@/lib/router'
import { useAppStore } from '@/state/AppStore'
import { NotFoundPage } from './NotFoundPage'

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-11">
      <h2 className="mb-4 text-[22px]">{title}</h2>
      {children}
    </section>
  )
}

export function ProviderPage({ id }: { id: string }) {
  const provider = getProvider(id)
  const { state, actions } = useAppStore()
  const toast = useToast()
  const [date, setDate] = useState('2026-12-13')
  if (!provider) return <NotFoundPage />

  const p = provider
  const shortlisted = state.shortlist.includes(p.id)
  const free = isAvailable(p, date)
  const packages = packagesFor(p)
  const stats: [string, string][] = [
    [String(p.completedProjects), 'Projects completed on NICASO'],
    [`${p.onTimeRate}%`, 'Delivered by the agreed date'],
    [p.replyTime, 'Usual reply time'],
    [`${p.repeatRate}%`, 'Clients who booked again'],
  ]

  return (
    <>
      <PageHeader crumbs={[{ label: 'Find photographers', href: href({ name: 'explore' }) }, { label: p.name }]} />
      <Container>
        <div className="mt-[18px] grid grid-cols-[2fr_1fr] grid-rows-[150px_150px] gap-2 overflow-hidden rounded-[22px] sm:grid-cols-[2fr_1fr_1fr] sm:grid-rows-[210px_210px]">
          {p.portfolio.map((k, i) => (
            <img
              key={i}
              src={IMG[k]}
              alt={i === 0 ? `${p.name} portfolio` : ''}
              className={cn('size-full object-cover', i === 0 && 'row-span-2', i >= 3 && 'hidden sm:block')}
            />
          ))}
        </div>
      </Container>

      <Container className="grid gap-11 pb-[100px] pt-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          <div className="flex items-center gap-[18px]">
            <img src={IMG[p.avatar]} alt="" className="size-[72px] shrink-0 rounded-full object-cover" />
            <div className="min-w-0">
              <h1 className="text-[clamp(26px,3vw,34px)] leading-tight">{p.name}</h1>
              <p className="text-ink-2">
                {p.owner} · {p.city} · {p.yearsInBusiness} years in business
              </p>
            </div>
          </div>
          <div className="mt-[18px] flex flex-wrap gap-2">
            <Pill tone="brand"><Icon name="idCard" size={14} />ID verified</Pill>
            <Pill tone="brand"><Icon name="briefcase" size={14} />Business verified</Pill>
            <Pill tone="brand"><Icon name="bank" size={14} />Bank account verified</Pill>
            <Pill><Icon name="star" size={13} />{p.rating} from {p.reviewCount} booked clients</Pill>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[18px] border border-line bg-line sm:grid-cols-4">
            {stats.map(([value, label]) => (
              <div key={label} className="bg-white px-[18px] py-4">
                <b className="block font-display text-2xl font-semibold tabular-nums">{value}</b>
                <span className="text-[13px] text-ink-2">{label}</span>
              </div>
            ))}
          </div>

          <Block title="About">
            <p className="max-w-[68ch] text-[15.5px] text-ink-2">{p.about}</p>
          </Block>

          <Block title="Packages">
            <div className="grid gap-3.5 xl:grid-cols-3">
              {packages.map((k) => (
                <div key={k.name} className={cn('flex flex-col gap-3.5 rounded-[18px] border bg-white p-5', k.popular ? 'border-brand shadow-[inset_0_0_0_1px_var(--color-brand)]' : 'border-line')}>
                  <h3 className="flex items-center justify-between gap-2 text-lg">
                    {k.name}
                    {k.popular && <Pill tone="brand">Most booked</Pill>}
                  </h3>
                  <b className="font-display text-2xl font-semibold">{inr(k.price)}</b>
                  <ul className="grid gap-2 text-sm text-ink-2">
                    {k.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Icon name="check" size={15} className="mt-[3px] text-brand" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <ButtonLink href={href({ name: 'brief' })} variant={k.popular ? 'primary' : 'secondary'} size="sm" className="mt-auto">
                    Request this package
                  </ButtonLink>
                </div>
              ))}
            </div>
            <p className="mt-2.5 text-[12.5px] text-ink-3">Prices are a starting point. Your quote is based on your date, hours and deliverables.</p>
          </Block>

          <Block title="Reviews from booked clients">
            <div className="grid gap-3.5">
              {SAMPLE_REVIEWS.map((r) => (
                <article key={r.author} className="rounded-[18px] border border-line p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <b className="font-bold">{r.author}</b>
                    <span className="inline-flex text-star" aria-label={`${r.rating} out of 5`}>
                      {Array.from({ length: r.rating }, (_, i) => (
                        <Icon key={i} name="star" size={14} />
                      ))}
                    </span>
                  </div>
                  <p className="mt-2.5 text-ink-2">{r.text}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Pill tone="ok"><Icon name="check" size={13} />Booked on NICASO</Pill>
                    <Pill>{r.context}</Pill>
                  </div>
                </article>
              ))}
            </div>
          </Block>

          <Block title="Policies">
            <div className="grid gap-3.5 sm:grid-cols-3">
              {[
                ['Cancellation', '50% of the booking amount back if you cancel 30+ days before. Nothing back after that.'],
                ['Revisions', '2 rounds included. Each extra round is ₹1,500 and goes through a change request.'],
                ['Raw files', isEventProvider(p) ? 'Included in Signature and Full story. ₹6,000 add-on for Essentials.' : 'Available on request for ₹1,000 per batch.'],
              ].map(([title, text]) => (
                <div key={title} className="rounded-2xl bg-tint p-4">
                  <b className="mb-1.5 block font-bold">{title}</b>
                  <p className="text-sm text-ink-2">{text}</p>
                </div>
              ))}
            </div>
          </Block>
        </div>

        <aside className="flex flex-col gap-3.5 lg:sticky lg:top-[92px] lg:self-start">
          <div className="rounded-[22px] border border-line bg-white p-[22px] shadow-card">
            <small className="text-ink-3">Starting from</small>
            <div>
              <b className="font-display text-[28px] font-semibold">{inr(p.startingPrice)}</b> <span className="text-ink-3">{p.priceUnit}</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[13.5px] text-ink-2">
              <Stars rating={p.rating} /> · {p.reviewCount} reviews
            </div>
            <Field label="Check a date" htmlFor="pv-date" className="mt-4">
              <Input id="pv-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </Field>
            <div aria-live="polite" className={cn('mt-3 flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-sm font-semibold', free ? 'bg-ok-bg text-ok' : 'bg-warn-bg text-warn')}>
              <Icon name={free ? 'check' : 'alert'} size={17} />
              {free ? 'Free on this date' : 'Already booked. Try another date.'}
            </div>
            <ButtonLink href={href({ name: 'brief' })} size="lg" block className="mt-3.5">
              Request a quote
            </ButtonLink>
            <Button
              variant="secondary"
              block
              className="mt-2"
              aria-pressed={shortlisted}
              onClick={() => {
                actions.toggleShortlist(p.id)
                toast(shortlisted ? 'Removed from your shortlist' : 'Added to your shortlist')
              }}
            >
              <Icon name="heart" size={17} fill={shortlisted ? 'currentColor' : 'none'} />
              {shortlisted ? 'Shortlisted' : 'Add to shortlist'}
            </Button>
            <p className="mt-3 text-center text-[13px] text-ink-3">You pay nothing until you accept a quote.</p>
          </div>
          <InfoNote icon="lock">Keep chats and payments on NICASO. Payments made outside the app are not covered by milestones or disputes.</InfoNote>
        </aside>
      </Container>
    </>
  )
}
