import { combineReducers } from 'redux'

import { resultReducer } from './ResultReducer'
import { projectReducer } from './ProjectReducer'
import { modalReducer } from './ModalReducer'

const rootReducer = combineReducers({
  result: resultReducer,
  project: projectReducer,
  modal: modalReducer,
})

export type ReduxState = ReturnType<typeof rootReducer>

export default rootReducer
