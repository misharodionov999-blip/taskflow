import { createSeedData } from '../data/seed.ts'
import type { TaskFlowData } from '../types/index.ts'

const STORAGE_KEY = 'taskflow-data'

function isTaskFlowData(value: unknown): value is TaskFlowData {
  if (typeof value !== 'object' || value === null) return false
  const record = value as { projects?: unknown; tasks?: unknown }
  return Array.isArray(record.projects) && Array.isArray(record.tasks)
}

export function loadData(): TaskFlowData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed: unknown = JSON.parse(raw)
      if (isTaskFlowData(parsed)) return parsed
    }
  } catch {
    // Повреждённую запись заменим демонстрационными данными.
  }

  const seed = createSeedData()
  saveData(seed)
  return seed
}

export function saveData(data: TaskFlowData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Браузер может запретить запись, например в приватном режиме.
  }
}
