import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TaskBoard } from '../components/tasks/TaskBoard.tsx'
import { TaskFilters } from '../components/tasks/TaskFilters.tsx'
import { TaskList } from '../components/tasks/TaskList.tsx'
import { useTaskFlow } from '../context/useTaskFlow.ts'
import { getProjectProgress } from '../lib/stats.ts'
import { filterTasks, type DeadlineFilter, type PriorityFilter, type StatusFilter } from '../lib/tasks.ts'

export default function ProjectPage() {
  const { projectId } = useParams()
  const { projects, tasks, query, openProjectForm } = useTaskFlow()
  const [status, setStatus] = useState<StatusFilter>('all')
  const [priority, setPriority] = useState<PriorityFilter>('all')
  const [deadline, setDeadline] = useState<DeadlineFilter>('all')

  const project = projects.find((item) => item.id === projectId)
  const projectTasks = tasks.filter((task) => task.projectId === project?.id)

  useEffect(() => {
    document.title = project ? `${project.name} · TaskFlow` : 'Проект не найден · TaskFlow'
  }, [project])

  if (!project) {
    return (
      <section className="page">
        <header className="page-header">
          <h1>Проект не найден</h1>
          <p>Такого проекта нет в сохранённых данных.</p>
        </header>
        <Link to="/projects" className="text-link">
          К списку проектов
        </Link>
      </section>
    )
  }

  const progress = getProjectProgress(projectTasks)
  const visibleTasks = filterTasks(projectTasks, {
    query,
    status,
    priority,
    deadline,
    projects,
  })

  return (
    <section className="page">
      <div>
        <Link to="/projects" className="back-link">
          ← Все проекты
        </Link>
        <header className="page-header page-header-row">
          <div>
            <h1>{project.name}</h1>
            <p>{project.description}</p>
          </div>
          <button type="button" className="button-secondary" onClick={() => openProjectForm(project.id)}>
            Изменить проект
          </button>
        </header>
      </div>

      <p className="search-hint">
        {progress.total === 0
          ? 'В этом проекте пока нет задач.'
          : `${progress.done} из ${progress.total} готово · показано ${visibleTasks.length}`}
      </p>

      <TaskFilters
        status={status}
        priority={priority}
        deadline={deadline}
        onStatusChange={setStatus}
        onPriorityChange={setPriority}
        onDeadlineChange={setDeadline}
      />

      {visibleTasks.length === 0 ? (
        <p className="empty-state">
          {projectTasks.length === 0 ? 'Задачи появятся здесь.' : 'Нет задач по выбранным условиям.'}
        </p>
      ) : (
        <>
          <TaskBoard tasks={visibleTasks} />
          <TaskList tasks={visibleTasks} />
        </>
      )}
    </section>
  )
}
