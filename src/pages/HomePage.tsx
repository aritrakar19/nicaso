import type { ReactNode } from 'react'
import { IMG } from '@/data/images'
import { CATEGORIES } from '@/data/categories'
import { PROVIDERS, getProvider } from '@/data/providers'
import { SearchBar } from '@/components/marketplace/SearchBar'
import { ProviderCard } from '@/components/marketplace/ProviderCard'
import { ButtonLink, TextLink } from '@/components/ui/Button'
import { Icon, type IconName } from '@/components/ui/Icon'
import { Container, IconTile, SectionHead } from '@/components/ui/Layout'
import { cn } from '@/lib/cn'
import { inr } from '@/lib/format'
import { href } from '@/lib/router'
import { useAppStore } from '@/state/AppStore'

const PROBLEMS: [topic: string, today: string, withUs: string][] = [
  ['Price', 'Prices come only after a call or a DM.', 'Quotes arrive in the same format, so you compare price, hours, photo count and delivery date side by side.'],
  ['Scope', 'What was promised sits somewhere in a WhatsApp chat.', 'A written scope lists every event, deliverable and revision round before you pay anything.'],
  ['Payment', '50% advance by UPI, then you hope it goes well.', 'You pay in milestones. The photographer gets each part when that step is done.'],
  ['Delivery', 'A Google Drive link, weeks later.', 'A private gallery where you pick favourites, ask for agreed fixes and approve.'],
  ['Extras', '"Can you also cover the sangeet?" turns into an argument.', 'Extra work becomes a change request with a price, agreed before anyone starts.'],
  ['Problems', 'Nobody to call when something goes wrong.', 'Report a problem or fraud from the project. Contract, chats and payments are kept as evidence.'],
]

const STEPS: [IconName, string, string][] = [
  ['briefcase', 'Post a brief', 'Event, date, place and what you want delivered. About 2 minutes.'],
  ['compare', 'Compare quotes', 'Up to 5 verified providers reply with price, hours, photos and delivery date.'],
  ['file', 'Sign the scope', 'Deliverables, revision rounds and cancellation rules are written down.'],
  ['wallet', 'Pay by milestone', 'Pay 20% to book. The rest is released as each step is done.'],
  ['image', 'Review and approve', 'Pick favourites, ask for agreed fixes, then approve the final delivery.'],
]

const EXAMPLE_TOTAL = 55000
const EXAMPLE_PLAN: [number, string, string][] = [
  [20, 'Booking', 'Paid when you book'],
  [30, 'Shoot done', 'Released after the shoot'],
  [30, 'First delivery', 'Released when you approve the photos'],
  [20, 'Final approval', 'Released when you accept the album'],
]

const VERIFICATION: [IconName, string, string][] = [
  ['idCard', 'Identity checked', 'Government ID matched to the person who runs the account.'],
  ['briefcase', 'Business checked', 'Studio registration or GST details, where the provider has them.'],
  ['bank', 'Bank account verified', 'Payouts go only to an account verified by our payment partner.'],
  ['image', 'Portfolio reviewed', 'Our team checks the sample work is their own.'],
]

function Section({ tint, children }: { tint?: boolean; children: ReactNode }) {
  return <section className={cn('py-[60px] sm:py-[88px]', tint && 'border-y border-line bg-tint')}>{children}</section>
}

function Hero() {
  return (
    <section className="overflow-hidden border-b border-line bg-linear-to-b from-tint to-white">
      <Container className="grid items-center gap-10 pb-16 pt-[52px] lg:grid-cols-[1.1fr_.9fr] lg:gap-14">
        <div>
          <span className="inline-flex items-center gap-2.5 rounded-full border border-line-2 bg-white py-1.5 pl-2.5 pr-3.5 text-[13px] font-semibold text-brand-ink">
            <span className="size-2 rounded-full bg-ok shadow-[0_0_0_4px_var(--color-ok-bg)]" />
            Now in Kolkata · weddings, events, products and spaces
          </span>
          <h1 className="mt-5 text-[clamp(34px,4.5vw,54px)] leading-[1.06]">
            Book a photographer and <em className="text-brand-gradient not-italic">see every step</em> until your photos arrive.
          </h1>
          <p className="mt-[18px] max-w-[54ch] text-[17.5px] text-ink-2">
            Compare verified photographers, agree the exact scope, pay in milestones and approve your photos in one place, instead of across Instagram DMs, WhatsApp, UPI links and Drive folders.
          </p>
          <SearchBar />
          <div className="mt-[22px] flex flex-wrap gap-x-[22px] gap-y-2.5 text-[13.5px] font-medium text-ink-2">
            {(
              [
                ['shield', 'ID and bank details verified'],
                ['wallet', 'Pay in milestones, not all upfront'],
                ['flag', 'Report a problem from any project'],
              ] as [IconName, string][]
            ).map(([icon, text]) => (
              <span key={text} className="inline-flex items-center gap-2">
                <Icon name={icon} className="text-brand" />
                {text}
              </span>
            ))}
          </div>
        </div>

        <div className="relative w-full max-w-[470px] justify-self-center lg:justify-self-end">
          <img src={IMG.ringExchange} alt="A couple exchanging rings as petals fall" className="aspect-[4/5] w-full rounded-[28px] object-cover object-[50%_30%] shadow-float" />
          <div className="absolute left-3 top-4 w-[230px] rounded-2xl border border-line bg-white px-4 py-3.5 shadow-float sm:top-11 sm:w-[258px] lg:-left-9">
            <div className="flex items-center gap-3">
              <span className="grid size-[34px] shrink-0 place-items-center rounded-[10px] bg-ok-bg text-ok">
                <Icon name="check" size={17} />
              </span>
              <div>
                <b className="block text-sm font-bold leading-snug">Shoot day payment released</b>
                <small className="block text-[12.5px] text-ink-3">Milestone 2 of 4 · ₹11,400</small>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-[2fr_3fr_3fr_2fr] gap-1">
              <i className="h-1.5 rounded-sm bg-brand" />
              <i className="h-1.5 rounded-sm bg-brand" />
              <i className="h-1.5 rounded-sm bg-[linear-gradient(90deg,var(--color-brand)_40%,var(--color-tint-2)_40%)]" />
              <i className="h-1.5 rounded-sm bg-line" />
            </div>
          </div>
          <div className="absolute bottom-4 right-3 w-[210px] rounded-2xl border border-line bg-white px-4 py-3.5 shadow-float sm:bottom-10 sm:w-[236px] lg:-right-6">
            <div className="mb-2.5 flex items-center">
              {(['bridePortrait', 'royalCouple', 'varmala'] as const).map((k, i) => (
                <img key={k} src={IMG[k]} alt="" className={cn('size-[34px] rounded-full border-2 border-white object-cover', i > 0 && '-ml-2')} />
              ))}
              <span className="ml-1.5 rounded-full bg-tint-2 px-2 py-[3px] text-xs font-bold text-brand-ink">+409</span>
            </div>
            <b className="block text-sm font-bold">412 photos ready to review</b>
            <small className="block text-[12.5px] text-ink-3">Pick your favourites by 8 Nov</small>
          </div>
        </div>
      </Container>
    </section>
  )
}

function WhySection() {
  return (
    <Section>
      <Container>
        <SectionHead
          eyebrow="Why NICASO"
          title="Today, one photo shoot is spread across six apps."
          text="You find someone on Instagram, agree on WhatsApp, pay by UPI and get photos on Drive. When something goes wrong, nothing is written down. NICASO turns the whole job into one project with a record."
        />
        <div className="overflow-hidden rounded-[22px] border border-line bg-white">
          <div className="hidden grid-cols-[150px_1fr_1fr] bg-tint text-xs font-bold uppercase tracking-widest text-ink-3 sm:grid">
            <div className="px-[22px] py-[17px]" />
            <div className="px-[22px] py-[17px]">Today</div>
            <div className="px-[22px] py-[17px] text-brand">On NICASO</div>
          </div>
          {PROBLEMS.map(([topic, today, withUs], i) => (
            <div key={topic} className={cn('grid border-line sm:grid-cols-[150px_1fr_1fr]', i === 0 ? 'sm:border-t' : 'border-t')}>
              <div className="px-[18px] pt-[18px] font-display text-base font-semibold sm:px-[22px] sm:py-[17px]">{topic}</div>
              <div className="flex items-start gap-3 px-[18px] py-3 text-ink-2 sm:px-[22px] sm:py-[17px]">
                <Icon name="x" size={16} className="mt-[3px] text-[#b9b4ca]" />
                <span>{today}</span>
              </div>
              <div className="flex items-start gap-3 bg-lilac px-[18px] py-3 font-medium sm:border-l sm:border-line sm:px-[22px] sm:py-[17px]">
                <Icon name="check" size={16} className="mt-[3px] text-brand" />
                <span>{withUs}</span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

function HowItWorks() {
  return (
    <Section tint>
      <Container>
        <SectionHead eyebrow="How it works" title="Five steps, and you always know which one you are on." />
        <div className="grid gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
          {STEPS.map(([icon, title, text], i) => (
            <div key={title} className="rounded-[20px] border border-line bg-white p-[22px]">
              <div className="flex items-center justify-between">
                <IconTile icon={icon} size="lg" />
                <span className="font-mono text-xs text-ink-3">Step {i + 1}</span>
              </div>
              <h3 className="mt-4 text-lg">{title}</h3>
              <p className="mt-1.5 text-sm text-ink-2">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-[18px] rounded-[22px] bg-night p-6 text-white sm:p-7">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h3 className="text-xl text-white">Example: a {inr(EXAMPLE_TOTAL)} wedding package</h3>
            <span className="text-sm text-[#b9aedb]">The milestone split is set per project. This is a common one.</span>
          </div>
          <div className="mt-[22px] grid grid-cols-2 gap-2.5 sm:grid-cols-[2fr_3fr_3fr_2fr]">
            {EXAMPLE_PLAN.map(([pct, name, cond], i) => (
              <div key={name}>
                <div className={cn('h-2.5 rounded-[5px]', i === 0 ? 'bg-brand-gradient' : 'bg-white/15')} />
                <b className="mt-3 block font-display text-xl font-semibold">{inr((EXAMPLE_TOTAL * pct) / 100)}</b>
                <span className="block text-[13px] font-semibold text-night-text">
                  {name} · {pct}%
                </span>
                <small className="mt-1 block text-[12.5px] leading-snug text-night-muted">{cond}</small>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}

function Categories() {
  const { actions } = useAppStore()
  return (
    <Section>
      <Container>
        <SectionHead
          eyebrow="Categories"
          title="Not only weddings"
          action={
            <TextLink href={href({ name: 'explore' })} onClick={() => actions.setCategory('All')}>
              Browse all photographers
              <Icon name="arrowRight" size={16} />
            </TextLink>
          }
        />
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <a
              key={c.name}
              href={href({ name: 'explore' })}
              onClick={() => actions.setCategory(c.name)}
              className="group relative block aspect-[4/3.3] overflow-hidden rounded-[18px] bg-tint-2"
            >
              <img src={IMG[c.image]} alt="" loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
              <span className="absolute inset-0 bg-linear-to-b from-transparent from-45% to-[#140a28]/75" />
              <span className="absolute inset-x-4 bottom-3.5 text-white">
                <b className="block font-display text-[17px] font-semibold leading-tight">{c.name}</b>
                <small className="text-[12.5px] opacity-85">From {inr(c.startingFrom)}</small>
              </span>
            </a>
          ))}
        </div>
        <p className="mt-4 text-[13.5px] text-ink-3">Book a product shoot, a property listing or a team headshot the same way you book a wedding.</p>
      </Container>
    </Section>
  )
}

function NearYou() {
  const { actions } = useAppStore()
  return (
    <Section tint>
      <Container>
        <SectionHead
          eyebrow="Near you"
          title="Verified photographers in Kolkata"
          action={
            <TextLink href={href({ name: 'explore' })} onClick={() => actions.setCategory('All')}>
              See all {PROVIDERS.length}
              <Icon name="arrowRight" size={16} />
            </TextLink>
          }
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROVIDERS.slice(0, 3).map((p) => (
            <ProviderCard key={p.id} provider={p} />
          ))}
        </div>
      </Container>
    </Section>
  )
}

function Trust() {
  const example = getProvider('northlight')!
  const signals: [string, string][] = [
    [String(example.completedProjects), 'projects completed'],
    [`${example.onTimeRate}%`, 'delivered on time'],
    [example.replyTime, 'usual reply time'],
    [`${example.repeatRate}%`, 'clients who rebooked'],
  ]
  return (
    <Section>
      <Container className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <SectionHead eyebrow="Trust" title="What the Verified badge means" text="A provider appears in search only after these checks pass. Every check is done again if their details change." />
          <div className="-mt-[18px] grid gap-3">
            {VERIFICATION.map(([icon, title, text]) => (
              <div key={title} className="flex items-start gap-3.5 rounded-2xl border border-line bg-white px-[18px] py-4">
                <IconTile icon={icon} />
                <div>
                  <b className="block font-bold">{title}</b>
                  <p className="text-sm text-ink-2">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[22px] border border-dashed border-line-2 bg-white p-7">
          <h3 className="text-xl">Verified does not mean "best"</h3>
          <p className="mt-2.5 text-ink-2">The badge confirms who someone is, not how good their photos will be. To judge quality, look at facts from real projects on NICASO:</p>
          <div className="mt-[18px] grid grid-cols-2 gap-2.5">
            {signals.map(([value, label]) => (
              <div key={label} className="rounded-xl bg-tint px-3.5 py-3">
                <b className="block font-display text-xl font-semibold">{value}</b>
                <span className="text-[12.5px] text-ink-2">{label}</span>
              </div>
            ))}
          </div>
          <p className="mt-3.5 text-[13px] text-ink-3">Example figures from {example.name}'s profile. Reviews come only from clients who booked through NICASO.</p>
        </div>
      </Container>
    </Section>
  )
}

function Protection() {
  const cards: { icon: IconName; tone: 'brand' | 'warn' | 'bad'; title: string; text: string; example: [string, string] }[] = [
    {
      icon: 'edit',
      tone: 'brand',
      title: 'Want something extra?',
      text: 'Raise a change request. If it is outside your scope, the photographer sends a price first and nothing starts until you accept.',
      example: ['Example:', '"Add a 1-minute highlight reel" · priced at ₹6,500, 5 extra days'],
    },
    {
      icon: 'flag',
      tone: 'warn',
      title: 'Not what you agreed?',
      text: 'Open a dispute from the project. Unreleased payments pause, and our team reviews the contract, messages and uploads.',
      example: ['Reasons:', 'not delivered, partly delivered, quality not as agreed, missed time, wrong amount'],
    },
    {
      icon: 'shield',
      tone: 'bad',
      title: 'Fraud or a security issue?',
      text: 'Report a fake provider, a suspicious payment request or account access. You get an incident ID and a specialist team handles it.',
      example: ['Lost money?', 'We also show you how to report to the national cyber crime helpline, 1930.'],
    },
  ]
  return (
    <Section tint>
      <Container>
        <SectionHead eyebrow="If something goes wrong" title="There is a clear way to raise it, and a record to back you up." />
        <div className="grid gap-4 lg:grid-cols-3">
          {cards.map((c) => (
            <div key={c.title} className="flex flex-col gap-3 rounded-[20px] border border-line bg-white p-6">
              <IconTile icon={c.icon} tone={c.tone} size="lg" />
              <h3 className="text-[19px]">{c.title}</h3>
              <p className="text-[14.5px] text-ink-2">{c.text}</p>
              <div className="mt-auto rounded-xl bg-tint px-3.5 py-3 text-[13px] text-ink-2">
                <b className="text-ink">{c.example[0]}</b> {c.example[1]}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

function CallToAction() {
  return (
    <Section>
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-7 rounded-[28px] bg-brand-gradient px-6 py-[30px] text-white sm:p-12">
          <div>
            <h2 className="max-w-[22ch] text-[clamp(26px,3vw,36px)] text-white">Have a date in mind? Post a brief in 2 minutes.</h2>
            <p className="mt-2.5 max-w-[52ch] text-white/85">Get up to 5 quotes from verified photographers. Posting is free and you pay nothing until you accept a quote.</p>
          </div>
          <ButtonLink href={href({ name: 'brief' })} variant="white" size="lg">
            Post a brief
            <Icon name="arrowRight" />
          </ButtonLink>
        </div>
      </Container>
    </Section>
  )
}

export function HomePage() {
  return (
    <>
      <Hero />
      <WhySection />
      <HowItWorks />
      <Categories />
      <NearYou />
      <Trust />
      <Protection />
      <CallToAction />
    </>
  )
}
