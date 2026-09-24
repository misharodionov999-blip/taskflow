import { formatDate, isOverdue } from '../../lib/dates.ts'
import { useTaskFlow } from '../../context/useTaskFlow.ts'
import { getUpcomingTasks } from '../../lib/stats.ts'
import type { Project, Task } from '../../types/index.ts'

export function UpcomingDeadlines({ tasks, projects }: { tasks: Task[]; projects: Project[] }) {
  const { openTaskForm } = useTaskFlow()
  const upcoming = getUpcomingTasks(tasks)
  const visible = upcoming.slice(0, 5)

  return (
    <section className="panel">
      <h2>Ближайшие дедлайны</h2>
      {visible.length === 0 ? (
        <p className="muted">Нет открытых задач с дедлайном.</p>
      ) : (
        <div className="deadline-list">
          {visible.map((task) => {
            const project = projects.find((item) => item.id === task.projectId)
            const overdue = isOverdue(task.deadline, task.status)

            return (
              <button key={task.id} type="button" className="deadline-row" onClick={() => openTaskForm(task.id)}>
                <span className="deadline-copy">
                  <strong>{task.title}</strong>
                  <span className="deadline-project">{project?.name ?? 'Без проекта'}</span>
                </span>
                <time dateTime={task.deadline ?? undefined} className={overdue ? 'is-overdue' : undefined}>
                  {task.deadline ? formatDate(task.deadline) : ''}
                  {overdue ? ' · просрочено' : ''}
                </time>
              </button>
            )
          })}
        </div>
      )}
      {upcoming.length > visible.length ? <p className="muted">Показаны ближайшие 5.</p> : null}
    </section>
  )
}
