import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'soft' | 'white' | 'outlineWhite'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white shadow-brand hover:bg-brand-dark disabled:bg-[#cbc2e2] disabled:shadow-none',
  secondary: 'border border-line-2 bg-white text-ink hover:border-[#c8bde4] hover:bg-tint disabled:text-ink-3',
  soft: 'bg-tint-2 text-brand-ink hover:bg-brand-soft',
  white: 'bg-white text-brand-ink hover:bg-[#f4efff]',
  outlineWhite: 'border border-white/55 text-white hover:bg-white/10',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-[38px] rounded-[10px] px-3.5 text-[13.5px]',
  md: 'h-11 rounded-xl px-[18px] text-[14.5px]',
  lg: 'h-[52px] rounded-[14px] px-6 text-[15.5px]',
}

interface StyleProps {
  variant?: ButtonVariant
  size?: ButtonSize
  block?: boolean
}

export function buttonClass({ variant = 'primary', size = 'md', block = false }: StyleProps = {}): string {
  return cn(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap text-center font-semibold transition-colors',
    variants[variant],
    sizes[size],
    block && 'w-full',
  )
}

export function Button({ variant, size, block, className, type = 'button', ...rest }: StyleProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={cn(buttonClass({ variant, size, block }), className)} {...rest} />
}

export function ButtonLink({ variant, size, block, className, ...rest }: StyleProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={cn(buttonClass({ variant, size, block }), className)} {...rest} />
}

export function TextLink({ className, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={cn('inline-flex items-center gap-1.5 font-semibold text-brand-ink hover:underline', className)} {...rest} />
}
