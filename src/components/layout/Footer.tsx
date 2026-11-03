import { Logo } from '@/components/brand/Logo'
import { Container } from '@/components/ui/Layout'
import { href } from '@/lib/router'

const COLUMNS: { title: string; links: { label: string; href?: string }[] }[] = [
  {
    title: 'For clients',
    links: [
      { label: 'Find photographers', href: href({ name: 'explore' }) },
      { label: 'Post a brief', href: href({ name: 'brief' }) },
      { label: 'How payments work' },
      { label: 'What Verified means' },
    ],
  },
  {
    title: 'For photographers',
    links: [{ label: 'Join as a provider' }, { label: 'Studio tools and pricing' }, { label: 'Get verified' }, { label: 'Payout schedule' }],
  },
  {
    title: 'Help and safety',
    links: [
      { label: 'Report a problem', href: href({ name: 'help' }) },
      { label: 'Report fraud or a security issue', href: href({ name: 'help' }) },
      { label: 'Cancellation and refunds' },
      { label: 'Privacy' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-line bg-white py-11">
      <Container className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-3 text-xs font-bold tracking-[0.18em] text-ink-3">CREATE · CAPTURE · CONNECT</p>
          <p className="mt-3 max-w-[34ch] text-sm text-ink-2">Hire photographers in Kolkata with a written scope, milestone payments and one place for your photos.</p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 font-sans text-xs font-bold uppercase tracking-widest text-ink-3">{col.title}</h4>
            <ul className="space-y-1.5 text-sm text-ink-2">
              {col.links.map((l) => (
                <li key={l.label}>{l.href ? <a href={l.href} className="hover:text-brand-ink">{l.label}</a> : l.label}</li>
              ))}
            </ul>
          </div>
        ))}
        <div className="flex flex-wrap justify-between gap-4 border-t border-line pt-5 text-[12.5px] text-ink-3 sm:col-span-2 lg:col-span-4">
          <span>Payments are collected and paid out by a licensed payment partner. NICASO is not a bank, wallet or escrow service.</span>
          <span>© 2026 NICASO</span>
        </div>
      </Container>
    </footer>
  )
}
