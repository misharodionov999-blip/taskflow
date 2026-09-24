import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react'
import { useTaskFlow } from '../../context/useTaskFlow.ts'
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  TASK_STATUSES,
  type TaskPriority,
  type TaskStatus,
} from '../../types/index.ts'

const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high']

type TaskFormProps = {
  open: boolean
  taskId?: string | null
  defaultProjectId?: string
  onClose: () => void
}

export function TaskForm({ open, taskId, defaultProjectId, onClose }: TaskFormProps) {
  const { projects, tasks, addTask, updateTask, deleteTask, setQuery } = useTaskFlow()
  const task = tasks.find((item) => item.id === taskId)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)
  const closingByCode = useRef(false)

  const resolvedProjectId = projects.some((project) => project.id === defaultProjectId)
    ? (defaultProjectId ?? '')
    : ''

  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [projectId, setProjectId] = useState(task?.projectId ?? resolvedProjectId)
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'todo')
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? 'medium')
  const [deadline, setDeadline] = useState(task?.deadline ?? '')
  const [titleError, setTitleError] = useState('')
  const [projectError, setProjectError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const isEditing = Boolean(task)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
      titleRef.current?.focus()
    }

    if (!open && dialog.open) {
      closingByCode.current = true
      dialog.close()
      closingByCode.current = false
    }
  }, [open])

  function handleDialogClose() {
    if (closingByCode.current) return
    onClose()
  }

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) onClose()
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextTitle = title.trim()
    const nextTitleError = nextTitle ? '' : 'Введите название задачи'
    const nextProjectError = projectId ? '' : 'Выберите проект'
    setTitleError(nextTitleError)
    setProjectError(nextProjectError)
    if (nextTitleError || nextProjectError) return

    const input = {
      title: nextTitle,
      description: description.trim(),
      projectId,
      status,
      priority,
      deadline: deadline || null,
    }

    if (task) updateTask(task.id, input)
    else addTask(input)
    setQuery('')
    onClose()
  }

  function handleDelete() {
    if (!task) return
    deleteTask(task.id)
    onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      className="task-dialog"
      aria-labelledby="task-form-title"
      onClose={handleDialogClose}
      onClick={handleBackdropClick}
    >
      <form className="task-form" onSubmit={handleSubmit} noValidate>
        <div className="task-dialog-header">
          <h2 id="task-form-title">{isEditing ? 'Редактирование задачи' : 'Новая задача'}</h2>
          <button type="button" className="dialog-close" onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </div>

        <label className="field">
          <span>
            Название <abbr title="обязательное поле">*</abbr>
          </span>
          <input
            ref={titleRef}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            aria-invalid={titleError ? true : undefined}
            aria-describedby={titleError ? 'task-title-error' : undefined}
            autoComplete="off"
          />
          {titleError ? (
            <p id="task-title-error" className="field-error" role="alert">
              {titleError}
            </p>
          ) : null}
        </label>

        <label className="field">
          <span>Описание</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
          />
        </label>

        <label className="field">
          <span>
            Проект <abbr title="обязательное поле">*</abbr>
          </span>
          <select
            value={projectId}
            onChange={(event) => setProjectId(event.target.value)}
            aria-invalid={projectError ? true : undefined}
            aria-describedby={projectError ? 'task-project-error' : undefined}
          >
            <option value="">Выберите проект</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          {projectError ? (
            <p id="task-project-error" className="field-error" role="alert">
              {projectError}
            </p>
          ) : null}
        </label>

        <div className="field-row">
          <label className="field">
            <span>Статус</span>
            <select value={status} onChange={(event) => setStatus(event.target.value as TaskStatus)}>
              {TASK_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {STATUS_LABELS[item]}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Приоритет</span>
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value as TaskPriority)}
            >
              {PRIORITIES.map((item) => (
                <option key={item} value={item}>
                  {PRIORITY_LABELS[item]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="field">
          <span>Дедлайн</span>
          <input type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} />
        </label>

        {isEditing && confirmDelete ? (
          <div className="delete-confirm">
            <p>Удалить задачу «{task?.title}»? Вернуть её будет нельзя.</p>
            <div className="form-actions">
              <button type="button" className="button-secondary" onClick={() => setConfirmDelete(false)}>
                Отмена
              </button>
              <button type="button" className="button-danger" onClick={handleDelete}>
                Удалить
              </button>
            </div>
          </div>
        ) : (
          <div className="form-actions">
            {isEditing ? (
              <button type="button" className="button-danger button-quiet" onClick={() => setConfirmDelete(true)}>
                Удалить
              </button>
            ) : null}
            <button type="button" className="button-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="button-primary">
              {isEditing ? 'Сохранить' : 'Создать задачу'}
            </button>
          </div>
        )}
      </form>
    </dialog>
  )
}
