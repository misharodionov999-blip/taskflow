import { useEffect } from 'react'
import { ProjectCard } from '../components/projects/ProjectCard.tsx'
import { useTaskFlow } from '../context/useTaskFlow.ts'
import { projectMatchesQuery } from '../lib/tasks.ts'

export default function ProjectsPage() {
  const { projects, tasks, query, openProjectForm } = useTaskFlow()

  useEffect(() => {
    document.title = 'Проекты · TaskFlow'
  }, [])

  const visibleProjects = projects.filter((project) => projectMatchesQuery(project, tasks, query))

  return (
    <section className="page">
      <header className="page-header page-header-row">
        <div>
          <h1>Проекты</h1>
          <p>Направления работы и прогресс по задачам.</p>
        </div>
        <button type="button" className="create-task" onClick={() => openProjectForm(null)}>
          + Новый проект
        </button>
      </header>

      <p className="search-hint">
        {query ? `Показано проектов: ${visibleProjects.length} из ${projects.length}` : `Проектов: ${projects.length}`}
      </p>

      {visibleProjects.length === 0 ? (
        <p className="empty-state">{projects.length === 0 ? 'Пока нет проектов.' : 'Проекты не найдены.'}</p>
      ) : (
        <div className="project-grid">
          {visibleProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              tasks={tasks.filter((task) => task.projectId === project.id)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
