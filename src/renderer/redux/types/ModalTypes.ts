import { ReduxAction } from './RootTypes'

export const OPEN_MODAL = 'OPEN_MODAL'
export const CLOSE_MODAL = 'CLOSE_MODAL'

export interface ModalState {
  newProjectModal: boolean
}

export type Modals = keyof ModalState

type OpenModalAction = ReduxAction<
  typeof OPEN_MODAL,
  {
    modal: Modals
  }
>

type CloseModalAction = ReduxAction<
  typeof CLOSE_MODAL,
  {
    modal: Modals
  }
>

export type ModalAction = OpenModalAction | CloseModalAction
