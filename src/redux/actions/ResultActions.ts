import { SET_RESULT, UPDATE_RESULT, CLEAR_RESULT, ResultAction } from '../types/ResultTypes'
import { AggregatedResult, TestResult } from '@jest/test-result'
import { Test } from '@jest/reporters/build/types'

export function setResult(aggregatedResult: AggregatedResult): ResultAction {
  return {
    type: SET_RESULT,
    payload: aggregatedResult,
  }
}

export function updateResult(test: Test, result: TestResult): ResultAction {
  return {
    type: UPDATE_RESULT,
    payload: {
      test,
      result,
    },
  }
}

export function clearResult(): ResultAction {
  return {
    type: CLEAR_RESULT,
  }
}
