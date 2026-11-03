import { Icon, type IconName } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { href, type Section } from '@/lib/router'

const TABS: { key: Section | 'post'; label: string; icon: IconName; href: string }[] = [
  { key: 'home', label: 'Home', icon: 'home', href: href({ name: 'home' }) },
  { key: 'explore', label: 'Discover', icon: 'search', href: href({ name: 'explore' }) },
  { key: 'post', label: 'Post', icon: 'plus', href: href({ name: 'brief' }) },
  { key: 'projects', label: 'Projects', icon: 'briefcase', href: href({ name: 'projects' }) },
  { key: 'help', label: 'Help', icon: 'help', href: href({ name: 'help' }) },
]

/** Bottom navigation for phones and tablets. */
export function TabBar({ section }: { section: Section }) {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-[55] grid grid-cols-5 border-t border-line bg-white px-2 pb-[calc(6px+env(safe-area-inset-bottom,0px))] pt-1.5 lg:hidden"
    >
      {TABS.map((t) => (
        <a
          key={t.key}
          href={t.href}
          aria-current={section === t.key ? 'page' : undefined}
          className={cn('flex flex-col items-center gap-[3px] py-1.5 text-[11px] font-semibold', section === t.key ? 'text-brand-ink' : 'text-ink-3')}
        >
          {t.key === 'post' ? (
            <span className="-mt-4 grid size-[42px] place-items-center rounded-[14px] bg-brand text-white shadow-brand">
              <Icon name="plus" size={22} />
            </span>
          ) : (
            <Icon name={t.icon} size={22} />
          )}
          {t.label}
        </a>
      ))}
    </nav>
  )
}
