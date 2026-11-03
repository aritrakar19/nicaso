import { useState } from 'react'
import type { CategoryName } from '@/types'
import { CATEGORIES, CITY } from '@/data/categories'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { navigate } from '@/lib/router'
import { useAppStore } from '@/state/AppStore'

const field = 'flex min-w-0 flex-col rounded-xl px-3.5 py-2'
const label = 'text-[11px] font-bold uppercase tracking-[0.08em] text-ink-3'
const control = 'w-full min-w-0 border-0 bg-transparent pt-[3px] text-[15px] font-semibold outline-none'

export function SearchBar() {
  const { actions } = useAppStore()
  const [category, setCategory] = useState<CategoryName>('Wedding')

  return (
    <form
      role="search"
      className="mt-7 grid rounded-[18px] border border-line-2 bg-white p-1.5 shadow-card sm:grid-cols-[1.25fr_1fr_1fr_auto] sm:p-[7px]"
      onSubmit={(e) => {
        e.preventDefault()
        actions.setCategory(category)
        navigate({ name: 'explore' })
      }}
    >
      <div className={field}>
        <label htmlFor="search-category" className={label}>
          What are you shooting?
        </label>
        <select id="search-category" className={control} value={category} onChange={(e) => setCategory(e.target.value as CategoryName)}>
          {CATEGORIES.map((c) => (
            <option key={c.name}>{c.name}</option>
          ))}
        </select>
      </div>
      <div className={cn(field, 'border-t border-line sm:border-l sm:border-t-0')}>
        <label htmlFor="search-city" className={label}>
          Where
        </label>
        <input id="search-city" className={control} defaultValue={CITY} />
      </div>
      <div className={cn(field, 'border-t border-line sm:border-l sm:border-t-0')}>
        <label htmlFor="search-date" className={label}>
          When
        </label>
        <input id="search-date" type="date" className={control} defaultValue="2026-12-13" />
      </div>
      <button
        type="submit"
        className="mt-1.5 inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-brand px-[22px] text-[14.5px] font-semibold text-white shadow-brand transition-colors hover:bg-brand-dark sm:mt-0"
      >
        <Icon name="search" />
        Search
      </button>
    </form>
  )
}
