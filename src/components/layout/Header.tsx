import { useEffect, useRef, useState } from 'react'
import { Logo } from '@/components/brand/Logo'
import { ButtonLink } from '@/components/ui/Button'
import { Icon, type IconName } from '@/components/ui/Icon'
import { CountBadge } from '@/components/ui/Pill'
import { Container } from '@/components/ui/Layout'
import { cn } from '@/lib/cn'
import { inr } from '@/lib/format'
import { href, type Section } from '@/lib/router'
import { needsAction } from '@/lib/project'
import { getProvider } from '@/data/providers'
import { useAppStore } from '@/state/AppStore'

export const NAV: { key: Section; label: string; href: string }[] = [
  { key: 'home', label: 'Home', href: href({ name: 'home' }) },
  { key: 'explore', label: 'Find photographers', href: href({ name: 'explore' }) },
  { key: 'projects', label: 'My projects', href: href({ name: 'projects' }) },
  { key: 'help', label: 'Help & safety', href: href({ name: 'help' }) },
]

interface Notice {
  icon: IconName
  title: string
  detail: string
  href: string
}

function useNotices(): Notice[] {
  const { state } = useAppStore()
  const notices: Notice[] = []
  for (const p of Object.values(state.projects)) {
    const provider = getProvider(p.providerId)?.name ?? 'Your provider'
    const link = href({ name: 'project', id: p.id })
    if (p.phase === 'review') notices.push({ icon: 'image', title: `${provider} uploaded ${p.totalPhotos} photos`, detail: `${p.title} · review by ${p.reviewDeadline}`, href: link })
    for (const c of p.changeRequests.filter((c) => c.status === 'priced'))
      notices.push({ icon: 'wallet', title: `Change request ${c.id} has a price`, detail: `${inr(c.price ?? 0)} and ${c.extraDays} extra days · waiting for you`, href: link })
    if (p.phase === 'booked') notices.push({ icon: 'check', title: `Your dates with ${provider} are booked`, detail: `${p.title} · ${p.dateLabel}`, href: link })
  }
  if (!state.weddingProjectId)
    notices.push({ icon: 'compare', title: '3 quotes received for your wedding', detail: 'The first one expires on 8 Nov', href: href({ name: 'quotes' }) })
  return notices
}

function NotificationsMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const notices = useNotices()

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onHash = () => setOpen(false)
    document.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    window.addEventListener('hashchange', onHash)
    return () => {
      document.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('hashchange', onHash)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={`Notifications (${notices.length})`}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="relative grid size-10 place-items-center rounded-xl border border-line bg-white text-ink-2 hover:bg-tint"
      >
        <Icon name="bell" />
        {notices.length > 0 && <span className="absolute right-[9px] top-2 size-[9px] rounded-full border-2 border-white bg-pink" />}
      </button>
      {open && (
        <div role="dialog" aria-label="Notifications" className="absolute -right-[50px] top-[50px] z-[70] w-[360px] max-w-[calc(100vw-32px)] rounded-[18px] border border-line bg-white p-2 shadow-float">
          <div className="flex items-center justify-between px-3 pb-2 pt-2.5 font-bold">
            <span>Notifications</span>
            <button type="button" className="text-sm font-semibold text-brand-ink hover:underline" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
          {notices.map((n) => (
            <a key={n.title} href={n.href} className="flex w-full gap-3 rounded-xl p-3 hover:bg-tint">
              <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-tint-2 text-brand-ink">
                <Icon name={n.icon} size={17} />
              </span>
              <span>
                <b className="block text-sm font-semibold leading-snug">{n.title}</b>
                <small className="text-[12.5px] text-ink-3">{n.detail}</small>
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export function Header({ section }: { section: Section }) {
  const { state } = useAppStore()
  const actionCount = Object.values(state.projects).filter(needsAction).length

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur-md">
      <Container className="flex h-[68px] items-center gap-7">
        <a href={href({ name: 'home' })} aria-label="NICASO home">
          <Logo />
        </a>
        <nav aria-label="Main" className="hidden gap-0.5 lg:flex">
          {NAV.map((n) => (
            <a
              key={n.key}
              href={n.href}
              aria-current={section === n.key ? 'page' : undefined}
              className={cn(
                'inline-flex h-10 items-center gap-2 rounded-[10px] px-[13px] text-sm font-semibold',
                section === n.key ? 'bg-tint-2 text-brand-ink' : 'text-ink-2 hover:bg-tint hover:text-ink',
              )}
            >
              {n.label}
              {n.key === 'projects' && actionCount > 0 && <CountBadge count={actionCount} />}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2.5">
          <span className="hidden lg:block">
            <ButtonLink href={href({ name: 'brief' })} size="sm">
              <Icon name="plus" size={16} />
              Post a brief
            </ButtonLink>
          </span>
          <NotificationsMenu />
          <span title="Ananya Das" className="grid size-10 place-items-center rounded-full bg-brand-gradient text-[13.5px] font-bold tracking-wide text-white">
            AD
          </span>
        </div>
      </Container>
    </header>
  )
}
