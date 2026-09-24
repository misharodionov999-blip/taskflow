import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell.tsx'
import { TaskFlowProvider } from './context/TaskFlowContext.tsx'
import DashboardPage from './pages/DashboardPage.tsx'
import ProjectPage from './pages/ProjectPage.tsx'
import ProjectsPage from './pages/ProjectsPage.tsx'

function NotFoundPage() {
  return (
    <section className="page">
      <header className="page-header">
        <h1>Страница не найдена</h1>
        <p>Такого адреса в TaskFlow нет.</p>
      </header>
      <Link to="/" className="text-link">
        На обзор
      </Link>
    </section>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <TaskFlowProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:projectId" element={<ProjectPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AppShell>
      </TaskFlowProvider>
    </BrowserRouter>
  )
}
