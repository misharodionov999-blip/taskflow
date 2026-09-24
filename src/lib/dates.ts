import type { TaskStatus } from '../types/index.ts'

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function addDays(date: Date, days: number): string {
  const next = startOfDay(date)
  next.setDate(next.getDate() + days)
  const month = String(next.getMonth() + 1).padStart(2, '0')
  const day = String(next.getDate()).padStart(2, '0')
  return `${next.getFullYear()}-${month}-${day}`
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
  }).format(parseIsoDate(iso))
}

export function isOverdue(
  deadline: string | null,
  status: TaskStatus,
  today = new Date(),
): boolean {
  if (!deadline || status === 'done') return false
  return startOfDay(parseIsoDate(deadline)) < startOfDay(today)
}

export function isThisWeek(deadline: string | null, today = new Date()): boolean {
  if (!deadline) return false
  const date = startOfDay(parseIsoDate(deadline))
  const start = startOfDay(today)
  const end = startOfDay(today)
  end.setDate(end.getDate() + 7)
  return date >= start && date < end
}
