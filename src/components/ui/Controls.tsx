import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import { Icon } from './Icon'

/* ---------- chips ---------- */

export function Chip({ active, count, className, children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean; count?: number }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        'inline-flex min-h-[34px] items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13.5px] font-semibold leading-tight transition-colors',
        active ? 'border-brand bg-brand text-white' : 'border-line-2 bg-white text-ink-2 hover:border-[#c0b3e2]',
        className,
      )}
      {...rest}
    >
      {children}
      {count !== undefined && <span className="text-xs opacity-75">{count}</span>}
    </button>
  )
}

/* ---------- form fields ---------- */

export const inputClass =
  'h-[46px] w-full rounded-xl border border-line-2 bg-white px-3.5 outline-none transition focus:border-brand focus:ring-3 focus:ring-brand/15'

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputClass, className)} {...rest} />
}

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(inputClass, 'h-auto min-h-[104px] resize-y py-3 leading-normal', className)} {...rest} />
}

export function Select({ className, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(inputClass, className)} {...rest} />
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: {
  label: ReactNode
  htmlFor?: string
  hint?: ReactNode
  error?: ReactNode
  children: ReactNode
  className?: string
}) {
  const Label = htmlFor ? 'label' : 'span'
  return (
    <div className={cn('flex min-w-0 flex-col gap-[7px]', className)}>
      <Label {...(htmlFor ? { htmlFor } : {})} className="text-sm font-semibold">
        {label}
      </Label>
      {children}
      {error ? <span className="text-[12.5px] font-semibold text-bad">{error}</span> : hint ? <span className="text-[12.5px] text-ink-3">{hint}</span> : null}
    </div>
  )
}

/* ---------- checkbox / radio ---------- */

export function CheckBox({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid size-[22px] shrink-0 place-items-center rounded-[7px] border-[1.5px] text-white',
        checked ? 'border-brand bg-brand' : 'border-line-2 bg-white',
      )}
    >
      {checked && <Icon name="check" size={14} />}
    </span>
  )
}

export function RadioDot({ checked }: { checked: boolean }) {
  return (
    <span aria-hidden="true" className={cn('grid size-[18px] shrink-0 place-items-center rounded-full border-[1.5px]', checked ? 'border-brand' : 'border-line-2')}>
      {checked && <span className="size-[9px] rounded-full bg-brand" />}
    </span>
  )
}

export function CheckRow({
  checked,
  onChange,
  title,
  description,
  leading,
}: {
  checked: boolean
  onChange: (next: boolean) => void
  title: ReactNode
  description?: ReactNode
  leading?: ReactNode
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'flex w-full items-center gap-3 rounded-[14px] border px-[15px] py-[13px] text-left transition-colors',
        checked ? 'border-lilac-line bg-lilac' : 'border-line bg-white hover:border-line-2',
      )}
    >
      {leading ?? <CheckBox checked={checked} />}
      <span className="min-w-0 flex-1">
        <b className="block text-[14.5px] font-semibold">{title}</b>
        {description && <small className="text-[12.5px] text-ink-3">{description}</small>}
      </span>
    </button>
  )
}

export function Stepper({ value, onChange, step = 1, min = 0, suffix, label }: { value: number; onChange: (n: number) => void; step?: number; min?: number; suffix?: string; label: string }) {
  const btn = 'grid h-full w-11 place-items-center text-xl font-semibold text-brand-ink hover:bg-tint'
  return (
    <div className="inline-flex h-[46px] items-center overflow-hidden rounded-xl border border-line-2 bg-white" role="group" aria-label={label}>
      <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - step))} aria-label={`Decrease ${label}`}>
        −
      </button>
      <span className="min-w-16 text-center font-bold tabular-nums" aria-live="polite">
        {value}
        {suffix}
      </span>
      <button type="button" className={btn} onClick={() => onChange(value + step)} aria-label={`Increase ${label}`}>
        +
      </button>
    </div>
  )
}
