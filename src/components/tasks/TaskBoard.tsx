import { useState, type DragEvent } from 'react'
import { useTaskFlow } from '../../context/useTaskFlow.ts'
import { compareTasks } from '../../lib/tasks.ts'
import { STATUS_LABELS, TASK_STATUSES, type Task, type TaskStatus } from '../../types/index.ts'
import { TaskCard } from './TaskCard.tsx'

export function TaskBoard({ tasks }: { tasks: Task[] }) {
  const { updateTask } = useTaskFlow()
  const [overStatus, setOverStatus] = useState<TaskStatus | null>(null)

  function allowDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  function handleDrop(status: TaskStatus, event: DragEvent<HTMLElement>) {
    event.preventDefault()
    setOverStatus(null)
    const taskId = event.dataTransfer.getData('text/plain')
    const task = tasks.find((item) => item.id === taskId)
    if (!task || task.status === status) return

    updateTask(task.id, {
      title: task.title,
      description: task.description,
      projectId: task.projectId,
      status,
      priority: task.priority,
      deadline: task.deadline,
    })
  }

  return (
    <div className="task-board">
      {TASK_STATUSES.map((status) => {
        const columnTasks = tasks.filter((task) => task.status === status).sort(compareTasks)
        const isTarget = overStatus === status

        return (
          <section
            key={status}
            className={isTarget ? `task-column task-column-${status} is-drop-target` : `task-column task-column-${status}`}
            aria-label={STATUS_LABELS[status]}
            onDragEnter={() => setOverStatus(status)}
            onDragOver={allowDrop}
            onDragLeave={(event) => {
              if (event.currentTarget.contains(event.relatedTarget as Node | null)) return
              setOverStatus((current) => (current === status ? null : current))
            }}
            onDrop={(event) => handleDrop(status, event)}
          >
            <header>
              <h2>{STATUS_LABELS[status]}</h2>
              <span className="count-pill">{columnTasks.length}</span>
            </header>
            {isTarget ? <p className="drop-hint">Отпустите, чтобы перенести сюда</p> : null}
            {columnTasks.length === 0 && !isTarget ? <p className="column-empty">Пусто</p> : null}
            {columnTasks.map((task) => (
              <TaskCard key={task.id} task={task} draggable />
            ))}
          </section>
        )
      })}
    </div>
  )
}