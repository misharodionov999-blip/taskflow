import { useContext } from 'react'
import { TaskFlowContext } from './taskflow-context.ts'

export function useTaskFlow() {
  const value = useContext(TaskFlowContext)
  if (!value) {
    throw new Error('useTaskFlow нужно вызывать внутри TaskFlowProvider')
  }
  return value
}
