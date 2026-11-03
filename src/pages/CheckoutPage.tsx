import { useState } from 'react'
import { MILESTONE_CONDITIONS, MILESTONE_NAMES, WEDDING_BRIEF, WEDDING_EVENTS, getQuoteForProvider, milestoneAmounts, serviceFee } from '@/data/quotes'
import { getProvider } from '@/data/providers'
import { WEDDING_PROJECT_ID, buildWeddingProject } from '@/data/projects'
import { Button, ButtonLink } from '@/components/ui/Button'
import { CheckBox, Field, Input, RadioDot } from '@/components/ui/Controls'
import { Icon } from '@/components/ui/Icon'
import { Container, PageHeader, Panel, SuccessBadge } from '@/components/ui/Layout'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/cn'
import { inr } from '@/lib/format'
import { href } from '@/lib/router'
import { newIdempotencyKey, payMilestone, type PaymentConfirmation, type PaymentMethod } from '@/services/payments'
import { useAppStore } from '@/state/AppStore'
import { NotFoundPage } from './NotFoundPage'

const METHODS: { value: PaymentMethod; title: string; detail: string }[] = [
  { value: 'upi', title: 'UPI', detail: 'Google Pay, PhonePe, Paytm or any UPI app' },
  { value: 'card', title: 'Debit or credit card', detail: 'Visa, Mastercard, RuPay' },
  { value: 'netbanking', title: 'Net banking', detail: 'All major Indian banks' },
]

type Phase = { kind: 'idle' } | { kind: 'pending' } | { kind: 'failed'; message: string } | { kind: 'done'; payment: PaymentConfirmation }

export function CheckoutPage({ providerId }: { providerId: string }) {
  const quote = getQuoteForProvider(providerId)
  const provider = getProvider(providerId)
  const { state, actions } = useAppStore()
  const toast = useToast()
  const [agreed, setAgreed] = useState(false)
  const [method, setMethod] = useState<PaymentMethod>('upi')
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' })
  // One key per checkout, so a retry or double tap can never charge twice.
  const [idempotencyKey] = useState(newIdempotencyKey)

  if (!quote || !provider) return <NotFoundPage />

  const amounts = milestoneAmounts(quote)
  const fee = serviceFee(quote.total)
  const dueNow = amounts[0] + fee
  const alreadyBooked = state.weddingProjectId && phase.kind !== 'done'

  const pay = async () => {
    setPhase({ kind: 'pending' })
    try {
      const payment = await payMilestone({ projectRef: WEDDING_BRIEF.id, milestoneId: 'm1', amount: dueNow, method, idempotencyKey })
      actions.bookWedding(buildWeddingProject(quote, provider, payment))
      setPhase({ kind: 'done', payment })
      toast('Payment confirmed. You are booked.')
    } catch {
      setPhase({ kind: 'failed', message: 'The bank did not confirm the payment. Nothing was charged. Try again.' })
    }
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Compare quotes', href: href({ name: 'quotes' }) }, { label: 'Scope and booking' }]}
        title="Check the scope, then book"
        subtitle={
          <>
            {provider.name} · Quote <span className="font-mono text-[0.86em]">{quote.id}</span> · {inr(quote.total)} total
          </>
        }
      />
      <Container className="grid gap-8 pb-[100px] pt-7 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="grid min-w-0 content-start gap-[18px]">
          <Panel title="What you are buying" description="This scope is what the work is checked against. Both of you sign it.">
            <div className="mb-[18px] grid gap-3 sm:grid-cols-3">
              {[
                ['Dates', WEDDING_BRIEF.dates],
                ['Coverage', quote.coverage],
                ['Team', quote.team],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-tint px-3.5 py-3">
                  <span className="block text-xs font-semibold text-ink-3">{k}</span>
                  <b className="text-[14.5px] font-bold">{v}</b>
                </div>
              ))}
            </div>
            <ul className="grid gap-2.5 text-[14.5px]">
              {WEDDING_EVENTS.map((e) =>
                quote.eventsCovered.includes(e) ? (
                  <li key={e} className="flex items-start gap-2.5">
                    <Icon name="check" size={16} className="mt-[3px] text-ok" />
                    {e} covered
                  </li>
                ) : (
                  <li key={e} className="flex items-start gap-2.5 font-semibold text-warn">
                    <Icon name="alert" size={16} className="mt-[3px]" />
                    {e} is not covered by this quote
                  </li>
                ),
              )}
              <li className="flex items-start gap-2.5"><Icon name="check" size={16} className="mt-[3px] text-ok" />{quote.photos} in a private gallery</li>
              <li className="flex items-start gap-2.5"><Icon name="check" size={16} className="mt-[3px] text-ok" />{quote.album}, printed after you pick photos</li>
              <li className="flex items-start gap-2.5">
                <Icon name={quote.rawIncluded ? 'check' : 'alert'} size={16} className={cn('mt-[3px]', quote.rawIncluded ? 'text-ok' : 'text-warn')} />
                Raw files: {quote.rawFiles}
              </li>
              <li className="flex items-start gap-2.5"><Icon name="check" size={16} className="mt-[3px] text-ok" />{quote.revisionRounds} revision rounds · delivery within {quote.deliveryDays} days</li>
            </ul>
            <div className="mt-[18px] flex gap-2.5 rounded-[14px] bg-warn-bg px-4 py-3.5 text-sm text-warn-ink">
              <Icon name="edit" className="mt-0.5" />
              <span>
                <b>Anything not listed here</b>, like extra events, hours or a film, needs a change request with a price before work starts.
              </span>
            </div>
          </Panel>

          <Panel title="Milestone plan" description={`You pay ${quote.milestonePlan[0]}% now. Each later part is released only when its step is done.`}>
            <div className="hidden grid-cols-[28px_minmax(0,1.3fr)_60px_100px_minmax(0,2fr)] gap-3.5 pb-2.5 text-xs font-bold uppercase tracking-[0.06em] text-ink-3 sm:grid">
              <span />
              <span>Milestone</span>
              <span>Share</span>
              <span>Amount</span>
              <span>When it is released</span>
            </div>
            {MILESTONE_NAMES.map((name, i) => (
              <div key={name} className="grid grid-cols-[26px_minmax(0,1fr)_auto] items-start gap-x-2.5 gap-y-1 border-t border-line py-3.5 text-sm sm:grid-cols-[28px_minmax(0,1.3fr)_60px_100px_minmax(0,2fr)] sm:gap-3.5">
                <span className={cn('grid size-[26px] place-items-center rounded-full text-xs font-bold', i === 0 ? 'bg-brand text-white' : 'bg-tint-2 text-brand-ink')}>{i + 1}</span>
                <b>{name}</b>
                <span className="hidden tabular-nums sm:block">{quote.milestonePlan[i]}%</span>
                <b className="tabular-nums">{inr(amounts[i])}</b>
                <small className="col-start-2 col-end-4 text-ink-2 sm:col-auto">{MILESTONE_CONDITIONS[i]}</small>
              </div>
            ))}
            <button
              type="button"
              role="checkbox"
              aria-checked={agreed}
              onClick={() => setAgreed(!agreed)}
              className={cn('mt-[18px] flex w-full items-start gap-3 rounded-[14px] border p-4 text-left', agreed ? 'border-brand bg-lilac' : 'border-line-2')}
            >
              <CheckBox checked={agreed} />
              <span>
                I agree to this scope, the milestone plan and the cancellation rule: <b>{quote.cancellation.toLowerCase()}</b>.
              </span>
            </button>
          </Panel>
        </div>

        <aside className="lg:sticky lg:top-[92px] lg:self-start">
          <Panel>
            {alreadyBooked ? (
              <div className="flex flex-col items-center gap-3 py-5 text-center">
                <SuccessBadge size={56} />
                <h2 className="text-xl">Already booked</h2>
                <p className="text-sm text-ink-2">Your wedding is booked. Open the project to see payments and next steps.</p>
                <ButtonLink href={href({ name: 'project', id: WEDDING_PROJECT_ID })} block>
                  Open project
                </ButtonLink>
              </div>
            ) : phase.kind === 'pending' ? (
              <div className="flex flex-col items-center gap-3 py-5 text-center" role="status">
                <span className="size-11 animate-spin rounded-full border-4 border-tint-2 border-t-brand" aria-hidden="true" />
                <h2 className="text-xl">Waiting for your bank</h2>
                <p className="text-sm text-ink-2">Approve the request in your UPI app. We mark it paid only after the payment partner confirms it, not when the app says so.</p>
              </div>
            ) : phase.kind === 'done' ? (
              <div className="flex flex-col items-center gap-3 py-5 text-center">
                <SuccessBadge />
                <h2 className="text-xl">Booked</h2>
                <p className="text-sm text-ink-2">
                  {provider.name} has your dates. The booking milestone of {inr(amounts[0])} has been released to them.
                </p>
                <dl className="mt-2 grid w-full gap-2 text-[13px]">
                  {[
                    ['Amount', inr(phase.payment.amount), false],
                    ['Payment ref', phase.payment.paymentId, true],
                    ['UPI ref (UTR)', phase.payment.utr, true],
                    ['Project ID', WEDDING_PROJECT_ID, true],
                  ].map(([k, v, mono]) => (
                    <div key={String(k)} className="flex justify-between gap-2.5 rounded-[10px] bg-tint px-3 py-2.5">
                      <dt className="text-ink-3">{k}</dt>
                      <dd className={cn('font-bold', mono && 'font-mono')}>{v}</dd>
                    </div>
                  ))}
                </dl>
                <ButtonLink href={href({ name: 'project', id: WEDDING_PROJECT_ID })} block className="mt-2">
                  Open your project
                </ButtonLink>
              </div>
            ) : (
              <>
                <h2 className="text-xl">Pay to book</h2>
                <p className="mb-[18px] mt-1 text-sm text-ink-2">Milestone 1 of {MILESTONE_NAMES.length}</p>
                <dl className="grid gap-2.5 text-[14.5px]">
                  <div className="flex justify-between gap-3">
                    <dt className="text-ink-2">Booking ({quote.milestonePlan[0]}% of {inr(quote.total)})</dt>
                    <dd className="font-bold tabular-nums">{inr(amounts[0])}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-ink-2">Service fee (2% + GST)</dt>
                    <dd className="font-bold tabular-nums">{inr(fee)}</dd>
                  </div>
                  <div className="flex justify-between gap-3 border-t border-line pt-3 text-base font-bold">
                    <dt>Pay now</dt>
                    <dd className="tabular-nums">{inr(dueNow)}</dd>
                  </div>
                </dl>
                <div className="my-[18px] grid gap-2" role="radiogroup" aria-label="Payment method">
                  {METHODS.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      role="radio"
                      aria-checked={method === m.value}
                      onClick={() => setMethod(m.value)}
                      className={cn('flex w-full items-center gap-3 rounded-[14px] border px-3.5 py-3 text-left text-[14.5px] font-semibold', method === m.value ? 'border-brand bg-lilac' : 'border-line-2')}
                    >
                      <RadioDot checked={method === m.value} />
                      <span>
                        {m.title}
                        <small className="block text-[12.5px] font-medium text-ink-3">{m.detail}</small>
                      </span>
                    </button>
                  ))}
                </div>
                {method === 'upi' && (
                  <Field label="UPI ID" htmlFor="upi-id" className="mb-4">
                    <Input id="upi-id" defaultValue="ananya.das@okhdfcbank" autoComplete="off" />
                  </Field>
                )}
                {phase.kind === 'failed' && <p className="mb-3 rounded-xl bg-bad-bg px-3.5 py-2.5 text-sm font-semibold text-bad">{phase.message}</p>}
                <Button size="lg" block disabled={!agreed} onClick={pay}>
                  <Icon name="lock" size={17} />
                  Pay {inr(dueNow)}
                </Button>
                {!agreed && <p className="mt-2 text-center text-[12.5px] text-ink-3">Tick the agreement to continue.</p>}
                <p className="mt-3.5 flex items-start gap-2.5 text-[12.5px] text-ink-2">
                  <Icon name="shield" size={16} className="mt-px text-ok" />
                  Your payment goes to a licensed payment partner, not straight to the photographer. Later milestones are released only when their step is done.
                </p>
              </>
            )}
          </Panel>
        </aside>
      </Container>
    </>
  )
}
