import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react'
import { useMatch, useNavigate } from 'react-router-dom'
import { useTaskFlow } from '../../context/useTaskFlow.ts'

type ProjectFormProps = {
  open: boolean
  projectId?: string | null
  onClose: () => void
}

export function ProjectForm({ open, projectId, onClose }: ProjectFormProps) {
  const { projects, tasks, addProject, updateProject, deleteProject } = useTaskFlow()
  const navigate = useNavigate()
  const routeProjectId = useMatch('/projects/:projectId')?.params.projectId
  const project = projects.find((item) => item.id === projectId)
  const taskCount = tasks.filter((task) => task.projectId === project?.id).length
  const dialogRef = useRef<HTMLDialogElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const closingByCode = useRef(false)

  const [name, setName] = useState(project?.name ?? '')
  const [description, setDescription] = useState(project?.description ?? '')
  const [nameError, setNameError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const isEditing = Boolean(project)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      nameRef.current?.focus()
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
    const nextName = name.trim()
    if (!nextName) {
      setNameError('Введите название проекта')
      return
    }
    const input = { name: nextName, description: description.trim() }
    if (project) updateProject(project.id, input)
    else addProject(input)
    onClose()
  }

  function handleDelete() {
    if (!project) return
    const removedId = project.id
    deleteProject(removedId)
    onClose()
    if (routeProjectId === removedId) navigate('/projects')
  }

  const deleteWarning =
    taskCount === 0
      ? 'В проекте нет задач.'
      : `Вместе с проектом будут удалены задачи: ${taskCount}.`

  return (
    <dialog
      ref={dialogRef}
      className="task-dialog"
      aria-labelledby="project-form-title"
      onClose={handleDialogClose}
      onClick={handleBackdropClick}
    >
      <form className="task-form" onSubmit={handleSubmit} noValidate>
        <div className="task-dialog-header">
          <h2 id="project-form-title">{isEditing ? 'Редактирование проекта' : 'Новый проект'}</h2>
          <button type="button" className="dialog-close" onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </div>

        <label className="field">
          <span>
            Название <abbr title="обязательное поле">*</abbr>
          </span>
          <input
            ref={nameRef}
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={nameError ? true : undefined}
            aria-describedby={nameError ? 'project-name-error' : undefined}
            autoComplete="off"
          />
          {nameError ? (
            <p id="project-name-error" className="field-error" role="alert">
              {nameError}
            </p>
          ) : null}
        </label>

        <label className="field">
          <span>Описание</span>
          <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} />
        </label>

        {isEditing && confirmDelete ? (
          <div className="delete-confirm">
            <p>
              Удалить проект «{project?.name}»? {deleteWarning} Вернуть это будет нельзя.
            </p>
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
              {isEditing ? 'Сохранить' : 'Создать проект'}
            </button>
          </div>
        )}
      </form>
    </dialog>
  )
}
