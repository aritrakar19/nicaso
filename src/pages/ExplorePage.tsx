import { useMemo, useState, type ReactNode } from 'react'
import type { CategoryFilter, Offering } from '@/types'
import { CATEGORIES, CITY, OFFERINGS } from '@/data/categories'
import { PROVIDERS, getProvider, isAvailable } from '@/data/providers'
import { IMG } from '@/data/images'
import { ProviderCard } from '@/components/marketplace/ProviderCard'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Chip, Input, RadioDot } from '@/components/ui/Controls'
import { Container, InfoNote, PageHeader } from '@/components/ui/Layout'
import { cn } from '@/lib/cn'
import { href } from '@/lib/router'
import { useAppStore } from '@/state/AppStore'

type Sort = 'projects' | 'rating' | 'price'
const BUDGETS: { value: string; label: string; range?: [number, number] }[] = [
  { value: 'any', label: 'Any budget' },
  { value: 'low', label: 'Under ₹10,000', range: [0, 9999] },
  { value: 'mid', label: '₹10,000 – ₹40,000', range: [10000, 40000] },
  { value: 'high', label: 'Above ₹40,000', range: [40001, Infinity] },
]

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="mb-2.5 font-sans text-xs font-bold uppercase tracking-[0.08em] text-ink-3">{title}</h4>
      {children}
    </div>
  )
}

export function ExplorePage() {
  const { state, actions } = useAppStore()
  const category = state.category
  const [sort, setSort] = useState<Sort>('projects')
  const [budget, setBudget] = useState('any')
  const [date, setDate] = useState('2026-12-13')
  const [mustInclude, setMustInclude] = useState<Offering[]>(['Edited photos'])

  const results = useMemo(() => {
    const range = BUDGETS.find((b) => b.value === budget)?.range
    return PROVIDERS.filter((p) => category === 'All' || p.categories.includes(category))
      .filter((p) => !range || (p.startingPrice >= range[0] && p.startingPrice <= range[1]))
      .filter((p) => !date || isAvailable(p, date))
      .filter((p) => mustInclude.every((o) => p.offers.includes(o)))
      .sort((a, b) => (sort === 'price' ? a.startingPrice - b.startingPrice : sort === 'rating' ? b.rating - a.rating : b.completedProjects - a.completedProjects))
  }, [category, budget, date, mustInclude, sort])

  const countFor = (c: CategoryFilter) => (c === 'All' ? PROVIDERS.length : PROVIDERS.filter((p) => p.categories.includes(c)).length)
  const toggleOffer = (o: Offering) => setMustInclude((list) => (list.includes(o) ? list.filter((x) => x !== o) : [...list, o]))
  const clearFilters = () => {
    actions.setCategory('All')
    setBudget('any')
    setMustInclude([])
  }

  return (
    <>
      <PageHeader crumbs={[{ label: 'Home', href: href({ name: 'home' }) }, { label: 'Find photographers' }]} title={`Photographers in ${CITY}`} />
      <Container className="grid gap-8 pb-[100px] pt-7 lg:grid-cols-[260px_1fr]">
        <aside aria-label="Filters" className="flex flex-col gap-6 lg:sticky lg:top-[92px] lg:self-start">
          <FilterGroup title="Category">
            <div className="flex flex-wrap gap-2">
              {(['All', ...CATEGORIES.map((c) => c.name)] as CategoryFilter[]).map((c) => (
                <Chip key={c} active={category === c} count={countFor(c)} onClick={() => actions.setCategory(c)}>
                  {c}
                </Chip>
              ))}
            </div>
          </FilterGroup>
          <FilterGroup title="Available on">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Available on date" />
          </FilterGroup>
          <FilterGroup title="Starting price">
            <div className="grid gap-1" role="radiogroup" aria-label="Starting price">
              {BUDGETS.map((b) => (
                <button
                  key={b.value}
                  type="button"
                  role="radio"
                  aria-checked={budget === b.value}
                  onClick={() => setBudget(b.value)}
                  className="flex w-full items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-sm font-medium hover:bg-tint"
                >
                  <RadioDot checked={budget === b.value} />
                  {b.label}
                </button>
              ))}
            </div>
          </FilterGroup>
          <FilterGroup title="Must include">
            <div className="flex flex-wrap gap-2">
              {OFFERINGS.map((o) => (
                <Chip key={o} active={mustInclude.includes(o)} onClick={() => toggleOffer(o)}>
                  {o}
                </Chip>
              ))}
            </div>
          </FilterGroup>
          <InfoNote>
            <b className="text-ink">Everyone here is verified.</b> Providers appear in search only after ID, business and bank checks pass.
          </InfoNote>
        </aside>

        <div className="min-w-0">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-[18px] rounded-[18px] border border-line bg-tint px-5 py-[18px]">
            <div>
              <b className="block font-display text-[17px] font-semibold">Not sure who to pick?</b>
              <p className="text-sm text-ink-2">Post one brief and get up to 5 quotes in the same format.</p>
            </div>
            <ButtonLink href={href({ name: 'brief' })} size="sm">
              Post a brief
            </ButtonLink>
          </div>
          <div className="mb-[18px] flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-[22px]" aria-live="polite">
              {results.length} verified {results.length === 1 ? 'provider' : 'providers'}
              {category !== 'All' && ` for ${category.toLowerCase()}`}
            </h2>
            <label className="flex items-center gap-2 text-sm text-ink-2">
              Sort by
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="h-10 rounded-[10px] border border-line-2 bg-white px-3 text-sm font-semibold text-ink">
                <option value="projects">Most projects done</option>
                <option value="rating">Highest rated</option>
                <option value="price">Lowest starting price</option>
              </select>
            </label>
          </div>
          {results.length > 0 ? (
            <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(270px,1fr))]">
              {results.map((p) => (
                <ProviderCard key={p.id} provider={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-[20px] border border-dashed border-line-2 p-12 text-center text-ink-2">
              <b className="text-ink">No providers match these filters.</b>
              <p className="mt-1.5">Try a different date or price range, or post a brief and we will find matches for you.</p>
              <Button variant="secondary" size="sm" className="mt-4" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </Container>

      {state.shortlist.length > 0 && (
        <div className="fixed bottom-[calc(84px+env(safe-area-inset-bottom,0px))] left-1/2 z-[45] flex w-[min(560px,calc(100%-32px))] -translate-x-1/2 items-center gap-3.5 rounded-[18px] bg-night py-2.5 pl-4 pr-2.5 text-white shadow-float lg:bottom-5">
          <div className="flex">
            {state.shortlist.slice(0, 4).map((id, i) => {
              const p = getProvider(id)
              return p ? <img key={id} src={IMG[p.avatar]} alt="" className={cn('size-8 rounded-full border-2 border-night object-cover', i > 0 && '-ml-2')} /> : null
            })}
          </div>
          <div className="min-w-0 flex-1 text-sm">
            <b className="block">{state.shortlist.length} shortlisted</b>
            <small className="text-[#b9aedb]">Send them one brief and compare quotes</small>
          </div>
          <ButtonLink href={href({ name: 'brief' })} size="sm">
            Request quotes
          </ButtonLink>
        </div>
      )}
    </>
  )
}
