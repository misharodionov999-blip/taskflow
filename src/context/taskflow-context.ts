import { createContext } from 'react'
import type { NewProjectInput, NewTaskInput, Project, Task } from '../types/index.ts'

export type TaskFlowContextValue = {
  projects: Project[]
  tasks: Task[]
  query: string
  setQuery: (query: string) => void
  addTask: (input: NewTaskInput) => void
  updateTask: (taskId: string, input: NewTaskInput) => void
  deleteTask: (taskId: string) => void
  formOpen: boolean
  formTaskId: string | null
  formSession: number
  openTaskForm: (taskId?: string | null) => void
  closeTaskForm: () => void
  addProject: (input: NewProjectInput) => void
  updateProject: (projectId: string, input: NewProjectInput) => void
  deleteProject: (projectId: string) => void
  projectFormOpen: boolean
  projectFormId: string | null
  projectFormSession: number
  openProjectForm: (projectId?: string | null) => void
  closeProjectForm: () => void
}

export const TaskFlowContext = createContext<TaskFlowContextValue | null>(null)
