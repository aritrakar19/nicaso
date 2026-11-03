import type { Provider } from '@/types'
import { IMG } from '@/data/images'
import { Icon } from '@/components/ui/Icon'
import { ButtonLink } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { inr } from '@/lib/format'
import { href } from '@/lib/router'
import { useAppStore } from '@/state/AppStore'

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 font-bold text-ink">
      <Icon name="star" size={14} className="text-star" />
      {rating}
    </span>
  )
}

/** Marketplace card. Shows only factual trust signals, never "best" claims. */
export function ProviderCard({ provider: p }: { provider: Provider }) {
  const { state, actions } = useAppStore()
  const shortlisted = state.shortlist.includes(p.id)
  const link = href({ name: 'provider', id: p.id })

  return (
    <article className="relative flex flex-col overflow-hidden rounded-[20px] border border-line bg-white transition hover:border-line-2 hover:shadow-card">
      <a href={link} aria-label={`View ${p.name}`} className="relative block aspect-[16/10.5] bg-tint-2">
        <img src={IMG[p.cover]} alt="" loading="lazy" className="size-full object-cover" />
        {p.availabilityTag && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-[5px] text-xs font-bold text-ink">
            <Icon name="calendar" size={13} />
            {p.availabilityTag}
          </span>
        )}
      </a>
      <button
        type="button"
        onClick={() => actions.toggleShortlist(p.id)}
        aria-pressed={shortlisted}
        aria-label={shortlisted ? `Remove ${p.name} from shortlist` : `Add ${p.name} to shortlist`}
        className={cn('absolute right-3 top-3 z-[2] grid size-9 place-items-center rounded-full', shortlisted ? 'bg-brand text-white' : 'bg-white/95 text-ink-2')}
      >
        <Icon name="heart" size={17} fill={shortlisted ? 'currentColor' : 'none'} />
      </button>
      <div className="flex flex-1 flex-col gap-3 px-[18px] pb-[18px]">
        <div className="relative -mt-[22px] flex items-end gap-3">
          <img src={IMG[p.avatar]} alt="" className="size-[52px] shrink-0 rounded-full border-[3px] border-white object-cover shadow-[0_2px_8px_rgba(0,0,0,.12)]" />
          <div className="min-w-0">
            <a href={link} className="inline-flex items-center gap-1.5 font-display text-[17px] font-semibold leading-tight hover:text-brand-ink">
              {p.name}
              <Icon name="shield" size={16} className="text-brand" />
              <span className="sr-only">Verified</span>
            </a>
            <div className="truncate text-[12.5px] text-ink-3">
              {p.owner} · {p.city}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13.5px] text-ink-2">
          <Stars rating={p.rating} />
          <span className="text-ink-3">{p.reviewCount} reviews</span>
          <span className="size-[3px] rounded-full bg-ink-3" />
          <span>
            <b className="text-ink">{p.completedProjects}</b> projects on NICASO
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-lg bg-tint px-[9px] py-1 text-[12.5px] font-medium text-ink-2">Replies in {p.replyTime}</span>
          <span className="rounded-lg bg-tint px-[9px] py-1 text-[12.5px] font-medium text-ink-2">{p.onTimeRate}% delivered on time</span>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3.5">
          <div>
            <small className="text-ink-3">From </small>
            <b className="font-display text-lg font-semibold">{inr(p.startingPrice)}</b> <small className="text-ink-3">{p.priceUnit}</small>
          </div>
          <ButtonLink href={link} variant="soft" size="sm">
            View
          </ButtonLink>
        </div>
      </div>
    </article>
  )
}
