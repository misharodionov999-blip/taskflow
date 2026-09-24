import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { StatCard } from '../components/dashboard/StatCard.tsx'
import { UpcomingDeadlines } from '../components/dashboard/UpcomingDeadlines.tsx'
import { useTaskFlow } from '../context/useTaskFlow.ts'
import { getProjectProgress, getTaskStats } from '../lib/stats.ts'
import { projectMatchesQuery, taskMatchesQuery } from '../lib/tasks.ts'
import { PRIORITY_LABELS, STATUS_LABELS, type TaskPriority } from '../types/index.ts'

const PRIORITY_ORDER: TaskPriority[] = ['high', 'medium', 'low']

export default function DashboardPage() {
  const { projects, tasks, query } = useTaskFlow()

  useEffect(() => {
    document.title = 'Обзор · TaskFlow'
  }, [])

  const visibleTasks = tasks.filter((task) => taskMatchesQuery(task, query, projects))
  const stats = getTaskStats(visibleTasks)
  const maxPriority = Math.max(...PRIORITY_ORDER.map((priority) => stats.byPriority[priority]), 1)
  const visibleProjects = projects.filter((project) => projectMatchesQuery(project, tasks, query))

  return (
    <section className="page">
      <header className="page-header">
        <h1>Обзор</h1>
        <p>Сводка по задачам, дедлайнам и проектам.</p>
      </header>

      {query ? <p className="search-hint">Найдено задач: {visibleTasks.length}</p> : null}

      <div className="stats-grid">
        <StatCard label="Всего" value={stats.total} tone="total" />
        <StatCard label={STATUS_LABELS.todo} value={stats.todo} tone="todo" />
        <StatCard label={STATUS_LABELS.in_progress} value={stats.inProgress} tone="progress" />
        <StatCard label={STATUS_LABELS.done} value={stats.done} tone="done" />
      </div>

      <p className={stats.overdue > 0 ? 'overdue-strip is-alert' : 'overdue-strip'}>
        {stats.overdue > 0
          ? `Просрочено: ${stats.overdue}. Дедлайн уже прошёл, а статус ещё не «Готово».`
          : 'Просроченных задач нет.'}
      </p>

      <div className="dashboard-grid">
        <UpcomingDeadlines tasks={visibleTasks} projects={projects} />
        <section className="panel">
          <h2>Приоритет</h2>
          <div className="priority-list">
            {PRIORITY_ORDER.map((priority) => {
              const count = stats.byPriority[priority]
              const width = Math.round((count / maxPriority) * 100)
              return (
                <div key={priority} className="priority-row">
                  <span className={`badge badge-${priority}`}>{PRIORITY_LABELS[priority]}</span>
                  <div className="bar" aria-hidden="true">
                    <span className={`fill-${priority}`} style={{ width: `${width}%` }} />
                  </div>
                  <span className="priority-count">{count}</span>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      <section className="panel">
        <h2>Проекты</h2>
        {visibleProjects.length === 0 ? (
          <p className="muted">Проекты не найдены.</p>
        ) : (
          <div className="summary-list">
            {visibleProjects.map((project) => {
              const progress = getProjectProgress(tasks.filter((task) => task.projectId === project.id))
              return (
                <Link key={project.id} to={`/projects/${project.id}`} className="summary-link">
                  <div className="summary-top">
                    <strong>{project.name}</strong>
                    <span>{progress.percent}%</span>
                  </div>
                  <div
                    className="progress"
                    role="meter"
                    aria-label={`Прогресс проекта ${project.name}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progress.percent}
                  >
                    <span style={{ width: `${progress.percent}%` }} />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </section>
  )
}
