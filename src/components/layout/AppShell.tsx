import type { ReactNode } from 'react'
import { Link, NavLink, useMatch } from 'react-router-dom'
import { useTaskFlow } from '../../context/useTaskFlow.ts'
import { ProjectForm } from '../projects/ProjectForm.tsx'
import { TaskForm } from '../tasks/TaskForm.tsx'

function navClassName({ isActive }: { isActive: boolean }) {
  return isActive ? 'nav-link active' : 'nav-link'
}

function Logo() {
  return (
    <span className="logo-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="18" height="18">
        <rect x="3" y="4" width="4" height="16" rx="1.5" />
        <rect x="10" y="4" width="4" height="11" rx="1.5" />
        <rect x="17" y="4" width="4" height="7" rx="1.5" />
      </svg>
    </span>
  )
}

function NavGlyph({ children }: { children: ReactNode }) {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      {children}
    </svg>
  )
}

function MainNav({ className }: { className: string }) {
  return (
    <nav className={className} aria-label="Основное меню">
      <NavLink to="/" end className={navClassName}>
        <NavGlyph>
          <rect x="3" y="3" width="8" height="8" rx="2" />
          <rect x="13" y="3" width="8" height="5" rx="2" />
          <rect x="13" y="10" width="8" height="11" rx="2" />
          <rect x="3" y="13" width="8" height="8" rx="2" />
        </NavGlyph>
        Обзор
      </NavLink>
      <NavLink to="/projects" className={navClassName}>
        <NavGlyph>
          <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H10l2 2h5.5A2.5 2.5 0 0 1 20 9.5v7A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z" />
        </NavGlyph>
        Проекты
      </NavLink>
    </nav>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const {
    projects,
    query,
    setQuery,
    formOpen,
    formTaskId,
    formSession,
    openTaskForm,
    closeTaskForm,
    projectFormOpen,
    projectFormId,
    projectFormSession,
    closeProjectForm,
  } = useTaskFlow()
  const projectMatch = useMatch('/projects/:projectId')
  const routeProjectId = projectMatch?.params.projectId
  const defaultProjectId = projects.some((project) => project.id === routeProjectId)
    ? routeProjectId
    : undefined

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/" className="brand">
          <Logo />
          TaskFlow
        </Link>
        <p className="nav-label">Меню</p>
        <MainNav className="side-nav" />
        <p className="sidebar-note">Данные хранятся в этом браузере и не пропадают после перезагрузки.</p>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <Link to="/" className="brand brand-mobile">
            <Logo />
            TaskFlow
          </Link>
          <button type="button" className="create-task" onClick={() => openTaskForm(null)}>
            + Новая задача
          </button>
          <div className={query ? 'search has-query' : 'search'}>
            <label htmlFor="task-search" className="visually-hidden">
              Поиск задач
            </label>
            <input
              id="task-search"
              type="search"
              placeholder="Поиск задач"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query ? (
              <button type="button" className="search-clear" onClick={() => setQuery('')}>
                Очистить
              </button>
            ) : null}
          </div>
        </header>
        <main className="content">{children}</main>
      </div>

      <MainNav className="bottom-nav" />
      <TaskForm
        key={formSession}
        open={formOpen}
        taskId={formTaskId}
        defaultProjectId={defaultProjectId}
        onClose={closeTaskForm}
      />
      <ProjectForm
        key={projectFormSession}
        open={projectFormOpen}
        projectId={projectFormId}
        onClose={closeProjectForm}
      />
    </div>
  )
}
