import { useState } from 'react'
import type { CategoryName, WeddingEvent } from '@/types'
import { CATEGORIES } from '@/data/categories'
import { WEDDING_BRIEF, WEDDING_EVENTS } from '@/data/quotes'
import { getProvider } from '@/data/providers'
import { IMG } from '@/data/images'
import { Button, ButtonLink } from '@/components/ui/Button'
import { CheckRow, Chip, Field, Input, Stepper, Textarea } from '@/components/ui/Controls'
import { Icon } from '@/components/ui/Icon'
import { Container, MonoId, PageHeader, SuccessBadge } from '@/components/ui/Layout'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/cn'
import { formatDate } from '@/lib/format'
import { href } from '@/lib/router'
import { useAppStore } from '@/state/AppStore'

interface BriefDraft {
  category: CategoryName
  title: string
  events: WeddingEvent[]
  start: string
  end: string
  hours: number
  venue: string
  area: string
  photos: number
  album: boolean
  raw: boolean
  video: boolean
  drone: boolean
  deliverBy: string
  budget: string
  suggestMore: boolean
  notes: string
}

const STEPS = ['Event', 'Date and place', 'Deliverables', 'Budget and send'] as const

const BUDGETS = [
  { value: '30-45', label: '₹30k – ₹45k' },
  { value: '45-60', label: '₹45k – ₹60k' },
  { value: '60-75', label: '₹60k – ₹75k' },
  { value: '75-100', label: '₹75k – ₹1L' },
]

const SUB_EVENT_CATEGORIES: CategoryName[] = ['Wedding', 'Pre-wedding']

function StepHeading({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <h2 className="text-2xl">{title}</h2>
      <p className="mt-1 text-ink-2">{text}</p>
    </div>
  )
}

export function BriefPage() {
  const { state } = useAppStore()
  const toast = useToast()
  const [step, setStep] = useState(0)
  const [sent, setSent] = useState(false)
  const [d, setDraft] = useState<BriefDraft>({
    category: 'Wedding',
    title: WEDDING_BRIEF.title,
    events: [...WEDDING_EVENTS],
    start: '2026-12-13',
    end: '2026-12-14',
    hours: 14,
    venue: WEDDING_BRIEF.venue,
    area: 'Kolkata 700034',
    photos: 500,
    album: true,
    raw: true,
    video: false,
    drone: false,
    deliverBy: '2027-01-10',
    budget: '60-75',
    suggestMore: true,
    notes: 'Bengali wedding. Please include family portraits right after the ceremony.',
  })
  const set = <K extends keyof BriefDraft>(key: K, value: BriefDraft[K]) => setDraft((o) => ({ ...o, [key]: value }))
  const toggleEvent = (e: WeddingEvent) => set('events', d.events.includes(e) ? d.events.filter((x) => x !== e) : [...d.events, e])

  const hasSubEvents = SUB_EVENT_CATEGORIES.includes(d.category)
  const stepValid = [
    Boolean(d.title.trim()) && (!hasSubEvents || d.events.length > 0),
    Boolean(d.start && d.venue.trim()) && (!d.end || d.end >= d.start),
    d.photos > 0 && Boolean(d.deliverBy),
    Boolean(d.budget),
  ]
  const detailChecks = [d.title.trim(), !hasSubEvents || d.events.length, d.start, d.venue.trim(), d.area.trim(), d.photos > 0, d.deliverBy, d.budget, d.notes.trim()]
  const completeness = Math.round((detailChecks.filter(Boolean).length / detailChecks.length) * 100)
  const deliverables = [`${d.photos}+ edited photos`, d.album && 'printed album', d.raw && 'raw files', d.video && 'highlight film', d.drone && 'drone'].filter(Boolean).join(', ')
  const shortlisted = state.shortlist.map(getProvider).filter((p) => p !== undefined)

  if (sent) {
    return (
      <Container className="max-w-[760px] pb-[100px] pt-12">
        <div className="flex flex-col items-center gap-3 rounded-[22px] border border-line bg-white p-10 text-center">
          <SuccessBadge />
          <h1 className="text-[26px]">Your brief is out</h1>
          <p className="max-w-[52ch] text-ink-2">
            Sent to {shortlisted.length} shortlisted {shortlisted.length === 1 ? 'provider' : 'providers'}
            {d.suggestMore && ' and up to 2 more verified matches'}. Most providers reply within 3 hours. We will notify you as each quote arrives.
          </p>
          <MonoId>Brief {WEDDING_BRIEF.id}</MonoId>
          <div className="mt-2.5 flex flex-wrap justify-center gap-2.5">
            <ButtonLink href={href({ name: 'quotes' })}>See quotes received so far (3)</ButtonLink>
            <ButtonLink href={href({ name: 'projects' })} variant="secondary">
              Go to my projects
            </ButtonLink>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Find photographers', href: href({ name: 'explore' }) }, { label: 'Post a brief' }]}
        title="Tell photographers what you need"
        subtitle="They quote on exactly this, so the clearer it is, the easier the quotes are to compare."
      />
      <Container className="grid gap-9 pb-[100px] pt-7 lg:grid-cols-[minmax(0,1fr)_370px]">
        <div className="min-w-0">
          <ol className="mb-[22px] grid grid-cols-4 gap-2.5" aria-label="Brief steps">
            {STEPS.map((name, i) => (
              <li key={name}>
                <button
                  type="button"
                  aria-current={i === step ? 'step' : undefined}
                  onClick={() => i <= step || stepValid.slice(0, i).every(Boolean) ? setStep(i) : undefined}
                  className={cn('flex w-full flex-col gap-2 text-left text-[13px] font-semibold', i === step ? 'text-brand-ink' : i < step ? 'text-ink-2' : 'text-ink-3')}
                >
                  <i className={cn('h-[5px] rounded-[3px]', i <= step ? 'bg-brand' : 'bg-line')} />
                  <span className="hidden sm:inline">
                    {i + 1}. {name}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className="rounded-[22px] border border-line bg-white p-5 sm:p-[30px]">
            <div className="grid gap-5">
              {step === 0 && (
                <>
                  <StepHeading title="What are you shooting?" text="Pick the closest match." />
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4" role="radiogroup" aria-label="Category">
                    {CATEGORIES.map((c) => {
                      const on = d.category === c.name
                      return (
                        <button
                          key={c.name}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          onClick={() => set('category', c.name)}
                          className={cn(
                            'flex flex-col gap-2.5 rounded-[14px] border-[1.5px] bg-white p-3.5 text-left text-sm font-semibold leading-snug',
                            on ? 'border-brand bg-lilac shadow-[0_0_0_3px_rgb(123_47_242/0.12)]' : 'border-line-2',
                          )}
                        >
                          <Icon name={c.icon} size={22} className={on ? 'text-brand' : 'text-ink-3'} />
                          {c.name}
                        </button>
                      )
                    })}
                  </div>
                  <Field label="Name this project" htmlFor="brief-title" error={!d.title.trim() && 'Add a name so you can find this project later.'}>
                    <Input id="brief-title" value={d.title} onChange={(e) => set('title', e.target.value)} />
                  </Field>
                  {hasSubEvents && (
                    <Field
                      label="Which events should be covered?"
                      hint="Only ticked events go into the scope. Adding one later needs a change request."
                      error={d.events.length === 0 && 'Pick at least one event.'}
                    >
                      <div className="flex flex-wrap gap-2">
                        {WEDDING_EVENTS.map((e) => (
                          <Chip key={e} active={d.events.includes(e)} onClick={() => toggleEvent(e)}>
                            {d.events.includes(e) && <Icon name="check" size={14} />}
                            {e}
                          </Chip>
                        ))}
                      </div>
                    </Field>
                  )}
                </>
              )}

              {step === 1 && (
                <>
                  <StepHeading title="When and where?" text="Providers check their calendar against these dates." />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="First day" htmlFor="brief-start">
                      <Input id="brief-start" type="date" value={d.start} onChange={(e) => set('start', e.target.value)} />
                    </Field>
                    <Field label="Last day" htmlFor="brief-end" error={d.end && d.end < d.start ? 'The last day must be on or after the first day.' : undefined}>
                      <Input id="brief-end" type="date" value={d.end} onChange={(e) => set('end', e.target.value)} />
                    </Field>
                  </div>
                  <Field label="Total hours of coverage">
                    <Stepper label="hours of coverage" value={d.hours} min={2} onChange={(n) => set('hours', n)} suffix=" hrs" />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Venue" htmlFor="brief-venue" error={!d.venue.trim() && 'Add the venue so providers can plan travel.'}>
                      <Input id="brief-venue" value={d.venue} onChange={(e) => set('venue', e.target.value)} />
                    </Field>
                    <Field label="Area and PIN code" htmlFor="brief-area">
                      <Input id="brief-area" value={d.area} onChange={(e) => set('area', e.target.value)} />
                    </Field>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <StepHeading title="What should be delivered?" text="This becomes the checklist the provider delivers against." />
                  <Field label="Edited photos, at least">
                    <Stepper label="edited photos" value={d.photos} step={50} min={50} onChange={(n) => set('photos', n)} />
                  </Field>
                  <div className="grid gap-2.5">
                    <CheckRow checked={d.album} onChange={(v) => set('album', v)} title="Printed album" description="Usually 30–40 pages, made after you pick photos" />
                    <CheckRow checked={d.raw} onChange={(v) => set('raw', v)} title="Raw, unedited files" description="All photos straight from the camera" />
                    <CheckRow checked={d.video} onChange={(v) => set('video', v)} title="Highlight film" description="A 3–5 minute edited video" />
                    <CheckRow checked={d.drone} onChange={(v) => set('drone', v)} title="Drone shots" description="Needs venue permission" />
                  </div>
                  <Field label="Need final delivery by" htmlFor="brief-by">
                    <Input id="brief-by" type="date" className="max-w-[260px]" value={d.deliverBy} onChange={(e) => set('deliverBy', e.target.value)} />
                  </Field>
                </>
              )}

              {step === 3 && (
                <>
                  <StepHeading title="Budget and who gets it" text="Your budget is shown to providers as a range." />
                  <Field label="Budget">
                    <div className="flex flex-wrap gap-2">
                      {BUDGETS.map((b) => (
                        <Chip key={b.value} active={d.budget === b.value} onClick={() => set('budget', b.value)}>
                          {b.label}
                        </Chip>
                      ))}
                    </div>
                  </Field>
                  <Field label="Send to">
                    {shortlisted.length > 0 ? (
                      <div className="grid gap-2">
                        {shortlisted.map((p) => (
                          <div key={p.id} className="flex items-center gap-3 rounded-[14px] border border-lilac-line bg-lilac px-[15px] py-[11px]">
                            <img src={IMG[p.avatar]} alt="" className="size-[34px] rounded-full object-cover" />
                            <span className="min-w-0 flex-1">
                              <b className="block text-[14.5px] font-semibold">{p.name}</b>
                              <small className="text-[12.5px] text-ink-3">From your shortlist · replies in {p.replyTime}</small>
                            </span>
                            <Icon name="check" className="text-brand" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-ink-2">Your shortlist is empty. We will match you with up to 5 verified providers.</p>
                    )}
                  </Field>
                  <CheckRow checked={d.suggestMore} onChange={(v) => set('suggestMore', v)} title="Also suggest up to 2 more verified providers" description="Matched on your date, area and budget" />
                  <Field label="Anything else they should know?" htmlFor="brief-notes">
                    <Textarea id="brief-notes" value={d.notes} onChange={(e) => set('notes', e.target.value)} />
                  </Field>
                </>
              )}
            </div>

            <div className="mt-7 flex justify-between gap-3 border-t border-line pt-[22px]">
              {step === 0 ? (
                <ButtonLink href={href({ name: 'explore' })} variant="secondary">
                  <Icon name="arrowLeft" size={17} />
                  Cancel
                </ButtonLink>
              ) : (
                <Button variant="secondary" onClick={() => setStep(step - 1)}>
                  <Icon name="arrowLeft" size={17} />
                  Back
                </Button>
              )}
              {step < STEPS.length - 1 ? (
                <Button disabled={!stepValid[step]} onClick={() => setStep(step + 1)}>
                  Continue
                  <Icon name="arrowRight" size={17} />
                </Button>
              ) : (
                <Button
                  disabled={!stepValid.every(Boolean)}
                  onClick={() => {
                    setSent(true)
                    window.scrollTo(0, 0)
                    toast('Brief sent')
                  }}
                >
                  Send brief
                  <Icon name="send" size={17} />
                </Button>
              )}
            </div>
          </div>
        </div>

        <aside aria-label="Brief summary" className="self-start overflow-hidden rounded-[22px] border border-line bg-white lg:sticky lg:top-[92px]">
          <div className="border-b border-line bg-tint px-5 py-[18px]">
            <b className="block font-display text-[17px] font-semibold">What providers will see</b>
            <small className="text-ink-3">Updates as you type</small>
          </div>
          <dl className="px-5 py-1.5">
            {[
              ['Project', d.title || '—'],
              ['Category', d.category],
              ...(hasSubEvents ? [['Events', d.events.length ? d.events.join(', ') : 'None picked']] : []),
              ['Dates', `${formatDate(d.start)}${d.end && d.end !== d.start ? ' – ' + formatDate(d.end) : ''} · ${d.hours} hrs`],
              ['Venue', `${d.venue || '—'}, ${d.area}`],
              ['Deliverables', deliverables],
              ['Deliver by', formatDate(d.deliverBy)],
              ['Budget', BUDGETS.find((b) => b.value === d.budget)?.label ?? '—'],
            ].map(([k, v], i) => (
              <div key={k} className={cn('grid grid-cols-[110px_1fr] gap-3 py-[11px] text-sm', i > 0 && 'border-t border-line')}>
                <dt className="text-ink-3">{k}</dt>
                <dd className="min-w-0 font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="border-t border-line px-5 pb-5 pt-4">
            <div className="flex justify-between text-[13.5px] font-bold">
              <span>Brief detail</span>
              <span className="tabular-nums">{completeness}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded bg-line" role="progressbar" aria-valuenow={completeness} aria-valuemin={0} aria-valuemax={100} aria-label="Brief detail">
              <i className="block h-full rounded bg-brand-gradient transition-[width] duration-300" style={{ width: `${completeness}%` }} />
            </div>
            <p className="mt-2 text-[13px] text-ink-2">{completeness >= 90 ? 'Clear enough for providers to quote without calling you.' : 'Add the missing details to get more accurate quotes.'}</p>
          </div>
        </aside>
      </Container>
    </>
  )
}
