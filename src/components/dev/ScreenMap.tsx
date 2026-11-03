import { useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { href, type AppRoute, type Route } from '@/lib/router'
import { ENGAGEMENT_ID } from '@/data/projects'

const SCREENS: { label: string; route: AppRoute }[] = [
  { label: 'Home', route: { name: 'home' } },
  { label: 'Find photographers', route: { name: 'explore' } },
  { label: 'Photographer profile', route: { name: 'provider', id: 'northlight' } },
  { label: 'Post a brief', route: { name: 'brief' } },
  { label: 'Compare quotes', route: { name: 'quotes' } },
  { label: 'Scope and booking payment', route: { name: 'checkout', providerId: 'northlight' } },
  { label: 'My projects', route: { name: 'projects' } },
  { label: 'Project workspace', route: { name: 'project', id: ENGAGEMENT_ID } },
  { label: 'Help and safety', route: { name: 'help' } },
]

/** Development-only shortcut to every client screen. Not rendered in production builds. */
export function ScreenMap({ route }: { route: Route }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      {open && (
        <div className="fixed bottom-[calc(138px+env(safe-area-inset-bottom,0px))] left-[18px] z-[80] w-[300px] max-w-[calc(100vw-36px)] rounded-[20px] border border-line bg-white p-2.5 shadow-float lg:bottom-[72px]">
          <div className="px-3 pb-2 pt-2.5">
            <b className="block font-display text-base font-semibold">Screens</b>
            <small className="text-[12.5px] text-ink-3">Dev shortcut · hidden in production</small>
          </div>
          {SCREENS.map((s, i) => (
            <a
              key={s.label}
              href={href(s.route)}
              onClick={() => setOpen(false)}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-3 py-[9px] text-sm font-semibold',
                route.name === s.route.name ? 'bg-tint-2 text-brand-ink' : 'text-ink-2 hover:bg-tint hover:text-ink',
              )}
            >
              <span className="w-5 font-mono text-[11.5px] text-ink-3">{String(i + 1).padStart(2, '0')}</span>
              {s.label}
            </a>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="fixed bottom-[calc(84px+env(safe-area-inset-bottom,0px))] left-[18px] z-[80] inline-flex h-11 items-center gap-2 rounded-full border border-line-2 bg-white px-4 text-[13.5px] font-bold text-brand-ink shadow-float lg:bottom-[18px]"
      >
        <Icon name={open ? 'x' : 'grid'} size={17} />
        {open ? 'Close' : 'Screens'}
      </button>
    </>
  )
}
