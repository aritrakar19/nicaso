import { Fragment, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Icon, type IconName } from './Icon'

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('mx-auto w-full max-w-[1200px] px-5', className)}>{children}</div>
}

export interface Crumb {
  label: string
  href?: string
}

export function PageHeader({ crumbs, title, subtitle, children }: { crumbs?: Crumb[]; title?: string; subtitle?: ReactNode; children?: ReactNode }) {
  return (
    <Container className="pt-7">
      {crumbs && (
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-[13.5px] text-ink-3">
          {crumbs.map((c, i) => (
            <Fragment key={c.label}>
              {i > 0 && <Icon name="chevronRight" size={14} />}
              {c.href ? (
                <a href={c.href} className="font-semibold text-ink-2 hover:text-brand-ink">
                  {c.label}
                </a>
              ) : (
                <span aria-current="page">{c.label}</span>
              )}
            </Fragment>
          ))}
        </nav>
      )}
      {title && <h1 className="mt-2.5 text-[clamp(26px,3vw,34px)] leading-tight">{title}</h1>}
      {subtitle && <p className="mt-1.5 text-ink-2">{subtitle}</p>}
      {children}
    </Container>
  )
}

export function Panel({ title, description, children, className }: { title?: string; description?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn('rounded-[22px] border border-line bg-white p-5 sm:p-[26px]', className)}>
      {title && <h2 className="text-xl">{title}</h2>}
      {description && <p className="mb-[18px] mt-1 text-sm text-ink-2">{description}</p>}
      {children}
    </section>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="text-xs font-bold uppercase tracking-[0.12em] text-brand">{children}</span>
}

export function SectionHead({ eyebrow, title, text, action }: { eyebrow: string; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className={cn('mb-10', action ? 'flex flex-wrap items-end justify-between gap-5' : 'max-w-[720px]')}>
      <div className="max-w-[720px]">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-2.5 text-[clamp(28px,3.4vw,40px)] leading-[1.12]">{title}</h2>
        {text && <p className="mt-3.5 max-w-[62ch] text-[16.5px] text-ink-2">{text}</p>}
      </div>
      {action}
    </div>
  )
}

export function InfoNote({ icon = 'shield', children, className }: { icon?: IconName; children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-start gap-3 rounded-[14px] bg-tint p-3.5 text-[13.5px] text-ink-2', className)}>
      <Icon name={icon} size={18} className="mt-0.5 text-brand" />
      <span>{children}</span>
    </div>
  )
}

export function IconTile({ icon, tone = 'brand', size = 'md' }: { icon: IconName; tone?: 'brand' | 'warn' | 'bad' | 'ok' | 'muted'; size?: 'sm' | 'md' | 'lg' }) {
  const tones = {
    brand: 'bg-tint-2 text-brand-ink',
    warn: 'bg-warn-bg text-warn',
    bad: 'bg-bad-bg text-bad',
    ok: 'bg-ok-bg text-ok',
    muted: 'bg-mist text-ink-3',
  }
  const sizes = { sm: 'size-9 rounded-[10px]', md: 'size-10 rounded-xl', lg: 'size-[46px] rounded-[13px]' }
  return (
    <span className={cn('grid shrink-0 place-items-center', tones[tone], sizes[size])}>
      <Icon name={icon} size={size === 'lg' ? 22 : 18} />
    </span>
  )
}

export function SuccessBadge({ size = 64 }: { size?: number }) {
  return (
    <span className="grid shrink-0 place-items-center rounded-full bg-ok-bg text-ok" style={{ width: size, height: size }}>
      <Icon name="check" size={Math.round(size * 0.46)} />
    </span>
  )
}

export function MonoId({ children }: { children: ReactNode }) {
  return <span className="rounded-[10px] border border-line bg-tint px-3 py-1.5 font-mono text-sm text-brand-ink">{children}</span>
}
