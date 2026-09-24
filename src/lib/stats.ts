import { isOverdue } from './dates.ts'
import type { Task, TaskPriority } from '../types/index.ts'

export type TaskStats = {
  total: number
  todo: number
  inProgress: number
  done: number
  overdue: number
  byPriority: Record<TaskPriority, number>
}

export function getTaskStats(tasks: Task[]): TaskStats {
  return {
    total: tasks.length,
    todo: tasks.filter((task) => task.status === 'todo').length,
    inProgress: tasks.filter((task) => task.status === 'in_progress').length,
    done: tasks.filter((task) => task.status === 'done').length,
    overdue: tasks.filter((task) => isOverdue(task.deadline, task.status)).length,
    byPriority: {
      low: tasks.filter((task) => task.priority === 'low').length,
      medium: tasks.filter((task) => task.priority === 'medium').length,
      high: tasks.filter((task) => task.priority === 'high').length,
    },
  }
}

export function getProjectProgress(tasks: Task[]) {
  const total = tasks.length
  const done = tasks.filter((task) => task.status === 'done').length
  const percent = total === 0 ? 0 : Math.round((done / total) * 100)
  return { total, done, percent }
}

export function getUpcomingTasks(tasks: Task[]): Task[] {
  return tasks
    .filter((task) => task.deadline && task.status !== 'done')
    .sort((left, right) => (left.deadline ?? '').localeCompare(right.deadline ?? ''))
}
