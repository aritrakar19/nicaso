import type { Milestone, ProjectDetail } from '@/types'
import { Icon, type IconName } from '@/components/ui/Icon'
import { Pill, type PillTone } from '@/components/ui/Pill'
import { cn } from '@/lib/cn'
import { inr } from '@/lib/format'
import { LIFECYCLE, MILESTONE_LABEL, currentStage } from '@/lib/project'

export function LifecycleBar({ project }: { project: ProjectDetail }) {
  const current = currentStage(project.phase)
  return (
    <div className="mt-[22px] overflow-x-auto pb-1.5">
      <ol className="grid min-w-[860px] grid-cols-9" aria-label="Project progress">
        {LIFECYCLE.map((stage, i) => {
          const done = i < current
          const isCurrent = i === current
          return (
            <li
              key={stage}
              aria-current={isCurrent ? 'step' : undefined}
              className={cn('relative flex flex-col gap-2 pr-2 text-[12.5px] font-semibold', done ? 'text-ink-2' : isCurrent ? 'text-brand-ink' : 'text-ink-3')}
            >
              {i < LIFECYCLE.length - 1 && <span className={cn('absolute left-[22px] right-0 top-2.5 h-0.5', done ? 'bg-brand' : 'bg-line')} aria-hidden="true" />}
              <span
                className={cn(
                  'relative z-[1] grid size-[22px] place-items-center rounded-full border-2 text-white',
                  done ? 'border-brand bg-brand' : isCurrent ? 'border-brand bg-white shadow-[0_0_0_5px_rgb(123_47_242/0.16)]' : 'border-line-2 bg-white',
                )}
              >
                {done && <Icon name="check" size={12} />}
                {isCurrent && <span className="size-2 rounded-full bg-brand" />}
              </span>
              {stage}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

const STATUS_STYLE: Record<Milestone['status'], { icon: IconName; tile: string; pill: PillTone }> = {
  released: { icon: 'check', tile: 'bg-ok-bg text-ok', pill: 'ok' },
  held: { icon: 'clock', tile: 'bg-warn-bg text-warn', pill: 'warn' },
  upcoming: { icon: 'wallet', tile: 'bg-tint-2 text-brand-ink', pill: 'brand' },
  locked: { icon: 'lock', tile: 'bg-mist text-ink-3', pill: 'muted' },
}

export function MilestoneList({ project }: { project: ProjectDetail }) {
  return (
    <ul>
      {project.milestones.map((m, i) => {
        const s = STATUS_STYLE[m.status]
        const paused = project.dispute && m.status === 'held'
        return (
          <li key={m.id} className={cn('grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3.5 py-4', i > 0 && 'border-t border-line')}>
            <span className={cn('grid size-10 place-items-center rounded-xl', s.tile)}>
              <Icon name={s.icon} />
            </span>
            <div className="min-w-0">
              <b className="block font-bold">
                {i < 4 ? `${i + 1}. ` : ''}
                {m.name}
              </b>
              <small className="text-[13px] text-ink-2">{paused ? `Paused while dispute ${project.dispute?.caseId} is reviewed` : m.note}</small>
            </div>
            <div className="flex flex-col items-end gap-1 text-right">
              <b className="font-display text-[17px] font-semibold tabular-nums">{inr(m.amount)}</b>
              <Pill tone={paused ? 'bad' : s.pill}>{paused ? 'Paused' : MILESTONE_LABEL[m.status]}</Pill>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
