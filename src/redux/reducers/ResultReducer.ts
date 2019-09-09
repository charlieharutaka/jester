import _ from 'lodash'

import { SET_RESULT, UPDATE_RESULT, CLEAR_RESULT, ResultState, ResultAction } from '../types/ResultTypes'
import { SnapshotSummary } from '@jest/test-result'

const initialSnapshot: SnapshotSummary = {
  added: 0,
  didUpdate: false,
  failure: false,
  filesAdded: 0,
  filesRemoved: 0,
  filesRemovedList: [],
  filesUnmatched: 0,
  filesUpdated: 0,
  matched: 0,
  total: 0,
  unchecked: 0,
  uncheckedKeysByFile: [],
  unmatched: 0,
  updated: 0,
}

const initialState: ResultState = {
  coverageMap: null,
  numFailedTests: 0,
  numFailedTestSuites: 0,
  numPassedTests: 0,
  numPassedTestSuites: 0,
  numPendingTests: 0,
  numTodoTests: 0,
  numPendingTestSuites: 0,
  numRuntimeErrorTestSuites: 0,
  numTotalTests: 0,
  numTotalTestSuites: 0,
  openHandles: [],
  snapshot: initialSnapshot,
  startTime: 0,
  success: false,
  testResults: [],
  wasInterrupted: false,
}

export function resultReducer(state = initialState, action: ResultAction): ResultState {
  switch (action.type) {
    case 'SET_RESULT':
      return action.payload
    default:
      return state
  }
}
