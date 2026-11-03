import { useId } from 'react'
import { cn } from '@/lib/cn'

const safeId = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '')

/** Viewfinder brackets around an aperture "N" (logo option 2). */
export function LogoMark({ className }: { className?: string }) {
  const id = safeId(useId())
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}n`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#5a1fd8" />
          <stop offset=".6" stopColor="#9a34ee" />
          <stop offset="1" stopColor="#d257d8" />
        </linearGradient>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8a2ff0" />
          <stop offset="1" stopColor="#d257d8" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3.5 13V8A4.5 4.5 0 0 1 8 3.5h5" />
        <path d="M35 3.5h5A4.5 4.5 0 0 1 44.5 8v5" />
        <path d="M44.5 35v5a4.5 4.5 0 0 1-4.5 4.5h-5" />
        <path d="M13 44.5H8A4.5 4.5 0 0 1 3.5 40v-5" />
      </g>
      <path d="M14.5 34V15l18 18.5V22.5" fill="none" stroke={`url(#${id}n)`} strokeWidth="5.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32.5" cy="15.5" r="6.6" fill={`url(#${id}a)`} />
      <path
        d="M34.9 15.5 34.05 21.3M33.7 17.58 28.26 19.74M31.3 17.58 26.7 13.95M30.1 15.5 30.95 9.7M31.3 13.42 36.74 11.26M33.7 13.42 38.3 17.05"
        stroke="#fff"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** "NICASO" with the crossbar-less A and its gradient notch. */
export function Wordmark({ className }: { className?: string }) {
  const id = safeId(useId())
  return (
    <span
      role="img"
      aria-label="NICASO"
      className={cn('inline-flex items-baseline font-display text-[21px] font-semibold leading-none tracking-[0.1em]', className)}
    >
      <span aria-hidden="true">NIC</span>
      <svg viewBox="0 0 20 20" aria-hidden="true" className="ml-[0.02em] mr-[0.1em] block h-[0.72em] w-[0.76em] overflow-visible">
        <defs>
          <linearGradient id={`${id}w`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#5a1fd8" />
            <stop offset="1" stopColor="#d257d8" />
          </linearGradient>
        </defs>
        <path d="M2.2 19 10 1.8 17.8 19" fill="none" stroke="currentColor" strokeWidth="3.1" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M10 11.4 13.3 18.4H6.7Z" fill={`url(#${id}w)`} />
      </svg>
      <span aria-hidden="true">SO</span>
    </span>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5 text-ink', className)}>
      <LogoMark className="size-9" />
      <Wordmark />
    </span>
  )
}
