import { isOverdue, isThisWeek } from './dates.ts'
import type { Project, Task, TaskPriority, TaskStatus } from '../types/index.ts'

export type StatusFilter = 'all' | TaskStatus
export type PriorityFilter = 'all' | TaskPriority
export type DeadlineFilter = 'all' | 'week' | 'overdue'

type TaskFilterOptions = {
  query: string
  status: StatusFilter
  priority: PriorityFilter
  deadline: DeadlineFilter
  projects: Project[]
}

export function taskMatchesQuery(task: Task, query: string, projects: Project[]): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true

  const project = projects.find((item) => item.id === task.projectId)
  const projectText = project ? `${project.name} ${project.description}` : ''
  return `${task.title} ${task.description} ${projectText}`.toLowerCase().includes(normalized)
}

export function projectMatchesQuery(project: Project, tasks: Task[], query: string): boolean {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return true
  if (`${project.name} ${project.description}`.toLowerCase().includes(normalized)) return true

  return tasks.some((task) => {
    if (task.projectId !== project.id) return false
    return `${task.title} ${task.description}`.toLowerCase().includes(normalized)
  })
}

export function filterTasks(tasks: Task[], options: TaskFilterOptions): Task[] {
  return tasks.filter((task) => {
    if (!taskMatchesQuery(task, options.query, options.projects)) return false
    if (options.status !== 'all' && task.status !== options.status) return false
    if (options.priority !== 'all' && task.priority !== options.priority) return false
    if (options.deadline === 'week' && !isThisWeek(task.deadline)) return false
    if (options.deadline === 'overdue' && !isOverdue(task.deadline, task.status)) return false
    return true
  })
}

export function compareTasks(left: Task, right: Task): number {
  if (left.deadline && right.deadline && left.deadline !== right.deadline) {
    return left.deadline.localeCompare(right.deadline)
  }
  if (left.deadline && !right.deadline) return -1
  if (!left.deadline && right.deadline) return 1
  return left.title.localeCompare(right.title, 'ru')
}
