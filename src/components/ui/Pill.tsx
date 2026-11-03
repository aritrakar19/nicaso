import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type PillTone = 'ok' | 'warn' | 'bad' | 'brand' | 'muted'

const tones: Record<PillTone, string> = {
  ok: 'bg-ok-bg text-ok',
  warn: 'bg-warn-bg text-warn',
  bad: 'bg-bad-bg text-bad',
  brand: 'bg-tint-2 text-brand-ink',
  muted: 'bg-mist text-ink-2',
}

export function Pill({ tone = 'muted', dot, children, className }: { tone?: PillTone; dot?: boolean; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex min-h-[26px] items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-[3px] text-[12.5px] font-semibold leading-tight',
        tones[tone],
        className,
      )}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}

export function CountBadge({ count, tone = 'solid' }: { count: number; tone?: 'solid' | 'soft' }) {
  return (
    <span
      className={cn(
        'inline-grid h-[18px] min-w-[18px] place-items-center rounded-full px-[5px] text-[11px] font-bold',
        tone === 'solid' ? 'bg-brand text-white' : 'bg-tint-2 text-brand-ink',
      )}
    >
      {count}
    </span>
  )
}
