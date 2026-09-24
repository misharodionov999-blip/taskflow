import { Link } from 'react-router-dom'
import { useTaskFlow } from '../../context/useTaskFlow.ts'
import { getProjectProgress } from '../../lib/stats.ts'
import type { Project, Task } from '../../types/index.ts'

export function ProjectCard({ project, tasks }: { project: Project; tasks: Task[] }) {
  const { openProjectForm } = useTaskFlow()
  const progress = getProjectProgress(tasks)

  return (
    <article className="project-card">
      <Link to={`/projects/${project.id}`} className="project-card-body">
        <h2>{project.name}</h2>
        <p>{project.description}</p>
        <div className="project-card-footer">
          <div className="summary-top">
            <span>{progress.total === 0 ? 'Нет задач' : `${progress.done} из ${progress.total} готово`}</span>
            <span>{progress.percent}%</span>
          </div>
          <div
            className="progress"
            role="meter"
            aria-label="Прогресс проекта"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress.percent}
          >
            <span style={{ width: `${progress.percent}%` }} />
          </div>
        </div>
      </Link>
      <button type="button" className="task-edit" onClick={() => openProjectForm(project.id)}>
        Изменить
      </button>
    </article>
  )
}
