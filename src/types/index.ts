export type TaskStatus = 'todo' | 'in_progress' | 'done'

export type TaskPriority = 'low' | 'medium' | 'high'

export type Project = {
  id: string
  name: string
  description: string
  createdAt: string
}

export type Task = {
  id: string
  projectId: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  deadline: string | null
  createdAt: string
  updatedAt: string
}

export type TaskFlowData = {
  projects: Project[]
  tasks: Task[]
}

export type NewProjectInput = {
  name: string
  description: string
}

export type NewTaskInput = {
  title: string
  description: string
  projectId: string
  status: TaskStatus
  priority: TaskPriority
  deadline: string | null
}

export const TASK_STATUSES: TaskStatus[] = ['todo', 'in_progress', 'done']

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'К выполнению',
  in_progress: 'В работе',
  done: 'Готово',
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
}
