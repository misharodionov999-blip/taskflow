import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { loadData, saveData } from '../storage/localStorage.ts'
import type { NewProjectInput, NewTaskInput, Project, Task } from '../types/index.ts'
import { TaskFlowContext } from './taskflow-context.ts'

export function TaskFlowProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState(() => loadData())
  const [query, setQuery] = useState('')
  const [formState, setFormState] = useState({ open: false, taskId: null as string | null, session: 0 })
  const [projectForm, setProjectForm] = useState({ open: false, projectId: null as string | null, session: 0 })

  useEffect(() => {
    saveData(data)
  }, [data])

  const addTask = useCallback((input: NewTaskInput) => {
    const now = new Date().toISOString()
    const task: Task = {
      id: crypto.randomUUID(),
      title: input.title.trim(),
      description: input.description.trim(),
      projectId: input.projectId,
      status: input.status,
      priority: input.priority,
      deadline: input.deadline,
      createdAt: now,
      updatedAt: now,
    }

    setData((current) => ({
      ...current,
      tasks: [...current.tasks, task],
    }))
  }, [])

  const updateTask = useCallback((taskId: string, input: NewTaskInput) => {
    const now = new Date().toISOString()
    setData((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              title: input.title.trim(),
              description: input.description.trim(),
              projectId: input.projectId,
              status: input.status,
              priority: input.priority,
              deadline: input.deadline,
              updatedAt: now,
            }
          : task,
      ),
    }))
  }, [])

  const deleteTask = useCallback((taskId: string) => {
    setData((current) => ({
      ...current,
      tasks: current.tasks.filter((task) => task.id !== taskId),
    }))
  }, [])

  const openTaskForm = useCallback((taskId: string | null = null) => {
    setFormState((current) => ({
      open: true,
      taskId,
      session: current.session + 1,
    }))
  }, [])

  const closeTaskForm = useCallback(() => {
    setFormState((current) => ({ ...current, open: false }))
  }, [])

  const addProject = useCallback((input: NewProjectInput) => {
    const project: Project = {
      id: crypto.randomUUID(),
      name: input.name.trim(),
      description: input.description.trim(),
      createdAt: new Date().toISOString(),
    }
    setData((current) => ({
      ...current,
      projects: [...current.projects, project],
    }))
  }, [])

  const updateProject = useCallback((projectId: string, input: NewProjectInput) => {
    setData((current) => ({
      ...current,
      projects: current.projects.map((project) =>
        project.id === projectId
          ? { ...project, name: input.name.trim(), description: input.description.trim() }
          : project,
      ),
    }))
  }, [])

  const deleteProject = useCallback((projectId: string) => {
    setData((current) => ({
      projects: current.projects.filter((project) => project.id !== projectId),
      tasks: current.tasks.filter((task) => task.projectId !== projectId),
    }))
  }, [])

  const openProjectForm = useCallback((projectId: string | null = null) => {
    setProjectForm((current) => ({
      open: true,
      projectId,
      session: current.session + 1,
    }))
  }, [])

  const closeProjectForm = useCallback(() => {
    setProjectForm((current) => ({ ...current, open: false }))
  }, [])

  const value = useMemo(
    () => ({
      projects: data.projects,
      tasks: data.tasks,
      query,
      setQuery,
      addTask,
      updateTask,
      deleteTask,
      formOpen: formState.open,
      formTaskId: formState.taskId,
      formSession: formState.session,
      openTaskForm,
      closeTaskForm,
      addProject,
      updateProject,
      deleteProject,
      projectFormOpen: projectForm.open,
      projectFormId: projectForm.projectId,
      projectFormSession: projectForm.session,
      openProjectForm,
      closeProjectForm,
    }),
    [
      data,
      query,
      addTask,
      updateTask,
      deleteTask,
      formState,
      openTaskForm,
      closeTaskForm,
      addProject,
      updateProject,
      deleteProject,
      projectForm,
      openProjectForm,
      closeProjectForm,
    ],
  )

  return <TaskFlowContext value={value}>{children}</TaskFlowContext>
}
