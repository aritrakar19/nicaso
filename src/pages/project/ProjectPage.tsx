import { useState, type ReactNode } from 'react'
import type { ProjectDetail, Provider } from '@/types'
import { IMG } from '@/data/images'
import { getProvider } from '@/data/providers'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Chip, Field, Input, Textarea } from '@/components/ui/Controls'
import { Icon, type IconName } from '@/components/ui/Icon'
import { CountBadge, Pill } from '@/components/ui/Pill'
import { Container } from '@/components/ui/Layout'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/cn'
import { inr } from '@/lib/format'
import { href } from '@/lib/router'
import { revisionsLeft } from '@/lib/project'
import { checkScope, scopeMessage } from '@/lib/scope'
import { useAppStore } from '@/state/AppStore'
import { NotFoundPage } from '../NotFoundPage'
import { LifecycleBar } from './parts'
import { ActivityTab, ChangesTab, FilesTab, GalleryTab, OverviewTab, PaymentsTab } from './tabs'

type Tab = 'overview' | 'gallery' | 'payments' | 'changes' | 'files' | 'activity'

function NextStep({ project, provider, onTab, onApprove }: { project: ProjectDetail; provider: Provider; onTab: (t: Tab) => void; onApprove: () => void }) {
  const held = project.milestones.find((m) => m.status === 'held')
  const upcoming = project.milestones.find((m) => m.status === 'upcoming')
  let icon: IconName = 'image'
  let label = 'Your next step'
  let title = ''
  let body = ''
  let actions: ReactNode = null

  if (project.dispute) {
    icon = 'flag'
    label = 'Dispute open'
    title = `We are reviewing case ${project.dispute.caseId}`
    body = `Reason: ${project.dispute.reason}. Unreleased payments on this project are paused until the case is resolved.`
    actions = <ButtonLink href={href({ name: 'help' })} variant="white">View case</ButtonLink>
  } else if (project.phase === 'review') {
    title = `Review ${project.totalPhotos} photos and pick ${project.printTarget} for prints`
    body = `Your review window closes on ${project.reviewDeadline}. Approving releases ${inr(held?.amount ?? 0)} to ${provider.name}. You keep ${revisionsLeft(project)} revision round after that.`
    actions = (
      <>
        <Button variant="white" onClick={() => onTab('gallery')}>Open gallery</Button>
        <Button variant="outlineWhite" onClick={onApprove}>Approve delivery</Button>
      </>
    )
  } else if (project.phase === 'final') {
    icon = 'clock'
    label = 'What happens now'
    title = `${provider.name} is printing your ${project.printTarget} photos`
    body = `Final files and prints are due by ${project.finalDue}. You approve once more to release the last ${inr(upcoming?.amount ?? 0)}.`
    actions = <Button variant="white" onClick={() => onTab('payments')}>See payments</Button>
  } else {
    icon = 'calendar'
    label = 'You are booked'
    title = `${provider.name} has your dates: ${project.dateLabel}`
    body = `${provider.team[0]?.name ?? provider.name} will call you on 1 Dec to plan the shot list. The next milestone, ${inr(upcoming?.amount ?? 0)}, is due before the first event.`
    actions = <Button variant="white" onClick={() => onTab('files')}>View signed scope</Button>
  }

  return (
    <div className="mt-[22px] grid items-center gap-5 rounded-[22px] bg-brand-gradient px-6 py-[22px] text-white shadow-next sm:grid-cols-[auto_minmax(0,1fr)_auto]">
      <span className="hidden size-[52px] place-items-center rounded-[14px] bg-white/20 sm:grid">
        <Icon name={icon} size={26} />
      </span>
      <div className="min-w-0">
        <small className="text-xs font-bold uppercase tracking-widest opacity-80">{label}</small>
        <h2 className="mt-0.5 text-[21px] text-white">{title}</h2>
        <p className="mt-1 text-[14.5px] text-white/85">{body}</p>
      </div>
      <div className="flex flex-wrap gap-2.5">{actions}</div>
    </div>
  )
}

function Sidebar({ project, provider }: { project: ProjectDetail; provider: Provider }) {
  const { actions } = useAppStore()
  const [draft, setDraft] = useState('')
  const card = 'rounded-[20px] border border-line bg-white p-[18px]'
  return (
    <aside className="grid content-start gap-3.5">
      <div className={card}>
        <h3 className="mb-3 text-base">Team</h3>
        {project.team.map((m) => (
          <div key={m.name} className="flex items-center gap-3 py-2">
            <img src={IMG[m.avatar]} alt="" className="size-10 rounded-full object-cover" />
            <div>
              <b className="block text-sm">{m.name}</b>
              <small className="text-[12.5px] text-ink-3">{m.role}</small>
            </div>
          </div>
        ))}
      </div>
      <section className={card} aria-label="Messages" id="messages">
        <h3 className="mb-3 flex items-center justify-between text-base">
          Messages
          <Pill tone="ok" dot>
            Replies in {provider.replyTime}
          </Pill>
        </h3>
        <div className="flex max-h-[300px] flex-col gap-2.5 overflow-auto" aria-live="polite">
          {project.messages.map((m, i) => (
            <div key={i} className={cn('max-w-[88%] rounded-[14px] px-3 py-2.5 text-[13.5px]', m.from === 'client' ? 'self-end bg-brand text-white' : 'bg-tint')}>
              <small className="mb-0.5 block text-[11px] font-semibold opacity-70">
                {m.name} · {m.at}
              </small>
              {m.text}
            </div>
          ))}
        </div>
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            actions.sendMessage(project.id, draft)
            setDraft('')
          }}
        >
          <Input className="h-[42px]" aria-label="Write a message" placeholder="Write a message" value={draft} onChange={(e) => setDraft(e.target.value)} />
          <button type="submit" aria-label="Send message" className="grid size-[42px] shrink-0 place-items-center rounded-xl bg-brand text-white hover:bg-brand-dark">
            <Icon name="send" size={17} />
          </button>
        </form>
      </section>
      <div className={card}>
        <h3 className="mb-3 text-base">Need help?</h3>
        <p className="text-sm text-ink-2">If the work is not what you agreed, open a dispute. Payments that have not been released yet are paused while we review.</p>
        <ButtonLink href={href({ name: 'help' })} variant="secondary" size="sm" block className="mt-3">
          <Icon name="flag" size={16} />
          Report a problem
        </ButtonLink>
      </div>
    </aside>
  )
}

const SUGGESTIONS = ['Brighten 4 photos from the ring exchange', 'Add a short highlight reel', 'Remove a guest from 2 photos']

export function ProjectPage({ id }: { id: string }) {
  const { state, actions } = useAppStore()
  const toast = useToast()
  const [tab, setTab] = useState<Tab>('overview')
  const [modal, setModal] = useState<'approve' | 'change' | null>(null)
  const [changeText, setChangeText] = useState('')
  const project = state.projects[id]
  const provider = project ? getProvider(project.providerId) : undefined
  if (!project || !provider) return <NotFoundPage />

  const held = project.milestones.find((m) => m.status === 'held')
  const scope = checkScope(changeText, project)
  const pricedCount = project.changeRequests.filter((c) => c.status === 'priced').length
  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'gallery', label: 'Gallery', count: project.totalPhotos || undefined },
    { key: 'payments', label: 'Payments' },
    { key: 'changes', label: 'Changes', count: pricedCount || undefined },
    { key: 'files', label: 'Contract and files' },
    { key: 'activity', label: 'Activity' },
  ]

  const approve = () => {
    actions.approveDelivery(project.id)
    setModal(null)
    toast(`${inr(held?.amount ?? 0)} released to ${provider.name}. Final milestone unlocked.`)
  }
  const sendChange = () => {
    actions.raiseChange(project.id, changeText)
    toast(scope.kind === 'revision' ? `Revision request sent to ${provider.name}` : `Change request sent. ${provider.name} will reply with a price.`)
    setChangeText('')
    setModal(null)
    setTab('changes')
  }

  return (
    <>
      <Container className="pt-7">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[13.5px] text-ink-3">
          <a href={href({ name: 'projects' })} className="font-semibold text-ink-2 hover:text-brand-ink">My projects</a>
          <Icon name="chevronRight" size={14} />
          <span aria-current="page">{project.title}</span>
        </nav>
        <div className="mt-2.5 flex flex-wrap items-end justify-between gap-5">
          <div className="min-w-0">
            <h1 className="text-[clamp(26px,3vw,34px)] leading-tight">{project.title}</h1>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-ink-2">
              <span className="inline-flex items-center gap-1.5"><Icon name="calendar" size={15} />{project.dateLabel} · {project.durationLabel}</span>
              <span className="inline-flex items-center gap-1.5"><Icon name="pin" size={15} />{project.venue}</span>
              <span className="inline-flex items-center gap-1.5"><Icon name="users" size={15} />{provider.name}</span>
              <span className="font-mono text-[0.86em]">{project.id}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <ButtonLink href="#messages" variant="secondary" size="sm" onClick={(e) => { e.preventDefault(); document.getElementById('messages')?.scrollIntoView({ behavior: 'smooth' }) }}>
              <Icon name="chat" size={16} />
              Message
            </ButtonLink>
            <ButtonLink href={href({ name: 'help' })} variant="secondary" size="sm">
              <Icon name="flag" size={16} />
              Report a problem
            </ButtonLink>
          </div>
        </div>
        <LifecycleBar project={project} />
        <NextStep project={project} provider={provider} onTab={setTab} onApprove={() => setModal('approve')} />
        <div role="tablist" aria-label="Project sections" className="mt-[30px] flex gap-0.5 overflow-x-auto border-b border-line">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                '-mb-px inline-flex h-12 items-center gap-2 whitespace-nowrap border-b-2 px-3.5 text-[14.5px] font-semibold',
                tab === t.key ? 'border-brand text-brand-ink' : 'border-transparent text-ink-2 hover:text-ink',
              )}
            >
              {t.label}
              {t.count !== undefined && <CountBadge count={t.count} tone="soft" />}
            </button>
          ))}
        </div>
      </Container>

      <Container className="grid gap-7 pb-[100px] pt-[26px] lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0" role="tabpanel">
          {tab === 'overview' && <OverviewTab project={project} />}
          {tab === 'gallery' && <GalleryTab project={project} onApprove={() => setModal('approve')} onRequestFix={() => setModal('change')} />}
          {tab === 'payments' && <PaymentsTab project={project} />}
          {tab === 'changes' && <ChangesTab project={project} provider={provider} onNew={() => setModal('change')} />}
          {tab === 'files' && <FilesTab project={project} />}
          {tab === 'activity' && <ActivityTab project={project} />}
        </div>
        <Sidebar project={project} provider={provider} />
      </Container>

      <Modal
        open={modal === 'approve'}
        onClose={() => setModal(null)}
        title="Approve the first delivery?"
        description={
          <>
            This releases <b>{inr(held?.amount ?? 0)}</b> ({held?.name.toLowerCase()} milestone) to {provider.name}.
          </>
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal(null)}>Not yet</Button>
            <Button onClick={approve}>Approve and release {inr(held?.amount ?? 0)}</Button>
          </>
        }
      >
        <ul className="mt-[18px] grid gap-2.5 text-[14.5px]">
          {[
            `${project.totalPhotos} edited photos received`,
            `You still have ${revisionsLeft(project)} revision round after approving`,
            `Your ${project.picks.length} picks go to print. You can change them until ${project.reviewDeadline}`,
          ].map((t) => (
            <li key={t} className="flex items-start gap-2.5">
              <Icon name="check" size={16} className="mt-[3px] text-ok" />
              {t}
            </li>
          ))}
        </ul>
      </Modal>

      <Modal
        open={modal === 'change'}
        onClose={() => setModal(null)}
        title="What would you like changed or added?"
        description="We check it against your signed scope as you type."
        footer={
          <>
            <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
            <Button disabled={scope.kind === 'empty'} onClick={sendChange}>
              {scope.kind === 'revision' || scope.kind === 'empty' ? 'Send request' : 'Ask for a price'}
            </Button>
          </>
        }
      >
        <Field label="Describe it" htmlFor="change-text" className="mt-4">
          <Textarea id="change-text" placeholder="For example: brighten the stage photos, or add a short video" value={changeText} onChange={(e) => setChangeText(e.target.value)} />
        </Field>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <Chip key={s} onClick={() => setChangeText(s)}>
              {s}
            </Chip>
          ))}
        </div>
        {scope.kind !== 'empty' && (
          <div
            aria-live="polite"
            className={cn('mt-4 flex items-start gap-2.5 rounded-[14px] px-4 py-3.5 text-sm', scope.kind === 'revision' ? 'bg-ok-bg text-ok-ink' : 'bg-warn-bg text-warn-ink')}
          >
            <Icon name={scope.kind === 'revision' ? 'check' : 'alert'} className="mt-0.5" />
            <span>{scopeMessage(scope, provider.name)}</span>
          </div>
        )}
      </Modal>
    </>
  )
}
