import { ModalState, ModalAction, OPEN_MODAL } from '../types/ModalTypes'

const initialState: ModalState = {
  newProjectModal: false,
}

export function modalReducer(_state = initialState, action: ModalAction): ModalState {
  const nextState = { ...initialState }
  if (!action.payload) return nextState
  nextState[action.payload.modal] = action.type === OPEN_MODAL
  return nextState
}
