import { compareTasks } from '../../lib/tasks.ts'
import type { Task } from '../../types/index.ts'
import { TaskCard } from './TaskCard.tsx'

export function TaskList({ tasks }: { tasks: Task[] }) {
  const sorted = [...tasks].sort(compareTasks)

  if (sorted.length === 0) {
    return null
  }

  return (
    <div className="task-list">
      {sorted.map((task) => (
        <TaskCard key={task.id} task={task} showStatus />
      ))}
    </div>
  )
}
