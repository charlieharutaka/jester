import { ModalAction, Modals, OPEN_MODAL, CLOSE_MODAL } from '../types/ModalTypes'

export function openModal(modal: Modals): ModalAction {
  return {
    type: OPEN_MODAL,
    payload: {
      modal,
    },
  }
}

export function closeModal(modal: Modals): ModalAction {
  return {
    type: CLOSE_MODAL,
    payload: {
      modal,
    },
  }
}
