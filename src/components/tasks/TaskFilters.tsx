import type { DeadlineFilter, PriorityFilter, StatusFilter } from '../../lib/tasks.ts'
import { PRIORITY_LABELS, STATUS_LABELS } from '../../types/index.ts'

type Option<T extends string> = {
  value: T
  label: string
}

const statusOptions: Option<StatusFilter>[] = [
  { value: 'all', label: 'Все' },
  { value: 'todo', label: STATUS_LABELS.todo },
  { value: 'in_progress', label: STATUS_LABELS.in_progress },
  { value: 'done', label: STATUS_LABELS.done },
]

const priorityOptions: Option<PriorityFilter>[] = [
  { value: 'all', label: 'Все' },
  { value: 'high', label: PRIORITY_LABELS.high },
  { value: 'medium', label: PRIORITY_LABELS.medium },
  { value: 'low', label: PRIORITY_LABELS.low },
]

const deadlineOptions: Option<DeadlineFilter>[] = [
  { value: 'all', label: 'Все' },
  { value: 'week', label: 'На неделе' },
  { value: 'overdue', label: 'Просроченные' },
]

function FilterGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: Option<T>[]
  onChange: (value: T) => void
}) {
  return (
    <div>
      <span className="filter-label">{label}</span>
      <div className="filter-options" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className="chip"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

type TaskFiltersProps = {
  status: StatusFilter
  priority: PriorityFilter
  deadline: DeadlineFilter
  onStatusChange: (status: StatusFilter) => void
  onPriorityChange: (priority: PriorityFilter) => void
  onDeadlineChange: (deadline: DeadlineFilter) => void
}

export function TaskFilters({
  status,
  priority,
  deadline,
  onStatusChange,
  onPriorityChange,
  onDeadlineChange,
}: TaskFiltersProps) {
  return (
    <div className="filters">
      <FilterGroup label="Статус" value={status} options={statusOptions} onChange={onStatusChange} />
      <FilterGroup label="Приоритет" value={priority} options={priorityOptions} onChange={onPriorityChange} />
      <FilterGroup label="Дедлайн" value={deadline} options={deadlineOptions} onChange={onDeadlineChange} />
    </div>
  )
}
