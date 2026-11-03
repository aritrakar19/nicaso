import { useState } from 'react'
import { WEDDING_BRIEF } from '@/data/quotes'
import { getProvider } from '@/data/providers'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Chip, Field, Select, Textarea } from '@/components/ui/Controls'
import { Icon } from '@/components/ui/Icon'
import { Pill } from '@/components/ui/Pill'
import { Container, IconTile, InfoNote, MonoId, PageHeader, Panel, SuccessBadge } from '@/components/ui/Layout'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/cn'
import { href } from '@/lib/router'
import { useAppStore } from '@/state/AppStore'

type ReportType = 'work' | 'security'

const WORK_REASONS = ['Photos not delivered', 'Only part was delivered', 'Quality is not as agreed', 'Missed the agreed time', 'Disagreement about scope', 'Wrong payment amount']
const SECURITY_REASONS = ['Suspicious payment request', 'Someone got into my account', 'Fake provider or impersonation', 'My photos or data were exposed', 'Harassment or threats', 'Malicious file or link']

const NO_PROJECT = 'none'

function newCaseId(type: ReportType): string {
  const n = String(Math.floor(100 + Math.random() * 900)).padStart(5, '0')
  return `${type === 'work' ? 'DSP' : 'SEC'}-2026-${n}`
}

function Steps({ items }: { items: { title: string; detail: string; done?: boolean }[] }) {
  return (
    <ol>
      {items.map((s, i) => (
        <li key={s.title} className="relative grid grid-cols-[28px_minmax(0,1fr)] gap-3 pb-[18px]">
          {i < items.length - 1 && <span className="absolute bottom-0.5 left-[13px] top-7 w-0.5 bg-line" aria-hidden="true" />}
          <span className={cn('grid size-7 place-items-center rounded-full text-xs font-bold', s.done ? 'bg-ok text-white' : 'bg-tint-2 text-brand-ink')}>
            {s.done ? <Icon name="check" size={14} /> : i + 1}
          </span>
          <div>
            <b className="block text-[14.5px]">{s.title}</b>
            <small className="text-[13px] text-ink-2">{s.detail}</small>
          </div>
        </li>
      ))}
    </ol>
  )
}

export function HelpPage() {
  const { state, actions } = useAppStore()
  const toast = useToast()
  const projects = Object.values(state.projects)
  const [type, setType] = useState<ReportType | null>(null)
  const [reason, setReason] = useState('')
  const [projectId, setProjectId] = useState(projects[0]?.id ?? NO_PROJECT)
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState<string[]>([])
  const [submitted, setSubmitted] = useState<{ caseId: string; type: ReportType; reason: string; projectId: string } | null>(null)

  const canSubmit = Boolean(type && reason && description.trim().length >= 10)
  const linked = submitted ? state.projects[submitted.projectId] : undefined

  const submit = () => {
    if (!type) return
    const caseId = newCaseId(type)
    if (type === 'work' && state.projects[projectId]) actions.openDispute(projectId, caseId, reason)
    setSubmitted({ caseId, type, reason, projectId })
    window.scrollTo(0, 0)
    toast('Report received')
  }

  const reset = () => {
    setSubmitted(null)
    setType(null)
    setReason('')
    setDescription('')
    setFiles([])
  }

  if (submitted) {
    const security = submitted.type === 'security'
    return (
      <Container className="max-w-[760px] pb-[100px] pt-12">
        <div className="grid gap-4 rounded-[22px] border border-line bg-white p-6 sm:p-10">
          <div className="flex items-center gap-3.5">
            <SuccessBadge size={56} />
            <div className="grid justify-items-start gap-1.5">
              <h1 className="text-[26px]">We have your report</h1>
              <MonoId>{submitted.caseId}</MonoId>
            </div>
          </div>
          <p className="text-ink-2">
            A {security ? 'trust and safety specialist' : 'case manager'} will reply within {security ? '4 hours' : '1 working day'}. Keep this ID for any follow-up.
          </p>
          <Panel title="Already done">
            <ul className="mt-3 grid gap-2.5 text-[14.5px]">
              {linked ? (
                <li className="flex items-start gap-2.5">
                  <Icon name="lock" size={16} className="mt-[3px] text-ok" />
                  Evidence locked: signed scope, {linked.messages.length} messages, {linked.totalPhotos} uploads and {linked.payments.length} payment records
                </li>
              ) : (
                <li className="flex items-start gap-2.5">
                  <Icon name="lock" size={16} className="mt-[3px] text-ok" />
                  Your account activity from the last 30 days is preserved for the review
                </li>
              )}
              <li className="flex items-start gap-2.5">
                <Icon name="wallet" size={16} className="mt-[3px] text-ok" />
                {security ? 'Payouts on linked projects are on hold while we check' : 'Unreleased payments on this project are paused'}
              </li>
              {submitted.reason === 'Someone got into my account' && (
                <li className="flex items-start gap-2.5">
                  <Icon name="shield" size={16} className="mt-[3px] text-ok" />
                  Signed you out on all other devices. Change your password next.
                </li>
              )}
            </ul>
          </Panel>
          <Steps
            items={[
              { title: 'Received', detail: 'Now', done: true },
              { title: 'First review', detail: security ? 'Within 4 hours' : 'Within 1 working day' },
              { title: 'Investigation', detail: 'We may ask you or the other side for more details' },
              { title: 'Resolution', detail: 'You get the outcome and the reason, and the case is closed in the record' },
            ]}
          />
          <div className="flex flex-wrap gap-2.5">
            {linked ? <ButtonLink href={href({ name: 'project', id: linked.id })}>Back to project</ButtonLink> : <ButtonLink href={href({ name: 'projects' })}>Go to my projects</ButtonLink>}
            <Button variant="secondary" onClick={reset}>
              Report something else
            </Button>
          </div>
        </div>
      </Container>
    )
  }

  const typeCard = (value: ReportType, icon: 'flag' | 'shield', tone: 'warn' | 'bad', title: string, text: string) => (
    <button
      type="button"
      role="radio"
      aria-checked={type === value}
      onClick={() => {
        setType(value)
        setReason('')
      }}
      className={cn('flex flex-col gap-2.5 rounded-[20px] border-[1.5px] bg-white p-[22px] text-left', type === value ? 'border-brand bg-lilac shadow-[0_0_0_3px_rgb(123_47_242/0.12)]' : 'border-line-2')}
    >
      <IconTile icon={icon} tone={tone} size="lg" />
      <b className="font-display text-lg font-semibold">{title}</b>
      <p className="text-sm text-ink-2">{text}</p>
    </button>
  )

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Home', href: href({ name: 'home' }) }, { label: 'Help and safety' }]}
        title="Report a problem"
        subtitle="Tell us what happened. Problems with the work and security issues go to different teams."
      />
      <Container className="grid gap-8 pb-[100px] pt-7 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid min-w-0 content-start gap-5">
          <div className="grid gap-3.5 sm:grid-cols-2" role="radiogroup" aria-label="Type of report">
            {typeCard('work', 'flag', 'warn', 'A problem with the work', 'Late, missing or not what was agreed. Opens a dispute on the project.')}
            {typeCard('security', 'shield', 'bad', 'Fraud, security or safety', 'Scams, account access, fake providers, leaked photos or threats.')}
          </div>

          {type && (
            <Panel>
              <div className="grid gap-5">
                <Field label="What happened?">
                  <div className="flex flex-wrap gap-2">
                    {(type === 'work' ? WORK_REASONS : SECURITY_REASONS).map((r) => (
                      <Chip key={r} active={reason === r} onClick={() => setReason(r)}>
                        {r}
                      </Chip>
                    ))}
                  </div>
                </Field>
                <Field label="Which project?" htmlFor="report-project">
                  <Select id="report-project" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} · {getProvider(p.providerId)?.name}
                      </option>
                    ))}
                    {!state.weddingProjectId && <option value={WEDDING_BRIEF.id}>{WEDDING_BRIEF.title} · quotes stage</option>}
                    <option value={NO_PROJECT}>Not linked to a project</option>
                  </Select>
                </Field>
                <Field label="Describe it" htmlFor="report-description" hint={description.trim().length < 10 ? 'A sentence or two is enough to start.' : 'Thanks. You can add more later.'}>
                  <Textarea
                    id="report-description"
                    placeholder={type === 'work' ? 'What was agreed, what you received, and what you would like to happen.' : 'What you saw, when it happened, and any amounts involved.'}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Field>
                <Field label={<>Evidence <span className="font-medium text-ink-3">(optional)</span></>}>
                  <label className="relative flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-[1.5px] border-dashed border-line-2 bg-white p-[22px] text-center text-sm text-ink-2 hover:border-brand hover:bg-lilac">
                    <input type="file" multiple className="absolute inset-0 cursor-pointer opacity-0" onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((f) => f.name))} />
                    <Icon name="upload" size={22} className="text-brand" />
                    <b className="text-ink">Add screenshots or files</b>
                    <span className="text-[12.5px] text-ink-3">Payment screenshots, chats from outside the app, photos. Project records are attached for you.</span>
                  </label>
                  {files.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-2">
                      {files.map((f) => (
                        <Pill key={f}>
                          <Icon name="file" size={13} />
                          {f}
                        </Pill>
                      ))}
                    </div>
                  )}
                </Field>
                <div className="flex justify-end">
                  <Button size="lg" disabled={!canSubmit} onClick={submit}>
                    Submit report
                  </Button>
                </div>
              </div>
            </Panel>
          )}
        </div>

        <aside className="flex flex-col gap-3.5 lg:sticky lg:top-[92px] lg:self-start">
          {type === 'security' && (
            <div className="rounded-[18px] bg-bad-bg p-[18px] text-bad-ink">
              <b className="block font-display text-[17px] font-semibold">Lost money to a scam?</b>
              <p className="mt-1.5 text-sm">
                Call the national cyber crime helpline right away. Then report it at{' '}
                <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="font-bold underline">
                  cybercrime.gov.in
                </a>
                .
              </p>
              <div className="mt-2.5 font-display text-[30px] font-bold tracking-wide tabular-nums">1930</div>
              <p className="text-[13px]">We will keep the records you may need for that report.</p>
            </div>
          )}
          <div className="rounded-[20px] border border-line bg-white p-[18px]">
            <h3 className="mb-3 text-base">What happens next</h3>
            <Steps
              items={[
                { title: 'You get a case ID', detail: 'Right after you submit' },
                { title: 'Evidence is locked', detail: 'Scope, messages, uploads and payments are kept as they are now' },
                { title: type === 'security' ? 'Specialist review' : 'Case review', detail: type === 'security' ? 'Within 4 hours' : 'Within 1 working day' },
                { title: 'Outcome', detail: 'Correction, extra delivery, refund or adjustment, depending on the terms' },
              ]}
            />
          </div>
          <InfoNote icon="lock">
            <b className="text-ink">NICASO will never ask for your OTP or UPI PIN.</b> Anyone who does is not from us.
          </InfoNote>
        </aside>
      </Container>
    </>
  )
}
