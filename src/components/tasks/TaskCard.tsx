import { useRef, useState, type DragEvent, type KeyboardEvent } from 'react'
import { formatDate, isOverdue } from '../../lib/dates.ts'
import { useTaskFlow } from '../../context/useTaskFlow.ts'
import { PRIORITY_LABELS, STATUS_LABELS, type Task } from '../../types/index.ts'

export function TaskCard({ task, showStatus = false, draggable = false }: { task: Task; showStatus?: boolean; draggable?: boolean }) {
  const { openTaskForm } = useTaskFlow()
  const overdue = isOverdue(task.deadline, task.status)
  const [dragging, setDragging] = useState(false)
  const ignoreClick = useRef(false)

  function openTask() {
    if (ignoreClick.current) {
      ignoreClick.current = false
      return
    }
    openTaskForm(task.id)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openTaskForm(task.id)
    }
  }

  function handleDragStart(event: DragEvent<HTMLElement>) {
    ignoreClick.current = true
    setDragging(true)
    event.dataTransfer.setData('text/plain', task.id)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <article
      className={dragging ? 'task-card is-dragging' : 'task-card'}
      data-priority={task.priority}
      draggable={draggable}
      onDragStart={draggable ? handleDragStart : undefined}
      onDragEnd={draggable ? () => setDragging(false) : undefined}
    >
      <div
        className="task-card-main"
        role="button"
        tabIndex={0}
        onClick={openTask}
        onKeyDown={handleKeyDown}
      >
        <span className="task-card-title">{task.title}</span>
        {task.description ? <span className="task-card-description">{task.description}</span> : null}
        <span className="task-card-meta">
          {showStatus ? <span className={`badge badge-${task.status}`}>{STATUS_LABELS[task.status]}</span> : null}
          <span className={`badge badge-${task.priority}`}>{PRIORITY_LABELS[task.priority]}</span>
          <span className={overdue ? 'deadline is-overdue' : 'deadline'}>
            {task.deadline ? formatDate(task.deadline) : 'Без дедлайна'}
            {overdue ? ' · просрочено' : ''}
          </span>
        </span>
      </div>
      <button type="button" className="task-edit" draggable={false} onClick={() => openTaskForm(task.id)}>
        Изменить
      </button>
    </article>
  )
}
