import { combineReducers } from 'redux'

import { resultReducer } from './ResultReducer'

const rootReducer = combineReducers({
  result: resultReducer,
})

export type ReduxState = ReturnType<typeof rootReducer>

export default rootReducer
