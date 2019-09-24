import { SET_RESULT, UPDATE_RESULT, CLEAR_RESULT, ResultAction } from '../types/ResultTypes'
import { AggregatedResult, TestResult } from '@jest/test-result'
import { Test } from '@jest/reporters/build/types'

export function setResult(project: string, aggregatedResult: AggregatedResult): ResultAction {
  return {
    type: SET_RESULT,
    payload: {
      project,
      aggregatedResult,
    },
  }
}

export function updateResult(project: string, test: Test, result: TestResult): ResultAction {
  return {
    type: UPDATE_RESULT,
    payload: {
      project,
      test,
      result,
    },
  }
}

export function clearResult(project: string): ResultAction {
  return {
    type: CLEAR_RESULT,
    payload: {
      project,
    },
  }
}
