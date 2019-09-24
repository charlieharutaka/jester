import { AggregatedResult, SnapshotSummary, TestResult } from '@jest/test-result'
import { Test } from '@jest/reporters/build/types'
import { CoverageMap } from 'istanbul-lib-coverage'

export const SET_RESULT = 'SET_RESULT'
export const UPDATE_RESULT = 'UPDATE_RESULT'
export const CLEAR_RESULT = 'CLEAR_RESULT'

export type ResultState = Record<string, AggregatedResult>

interface SetResultAction {
  type: typeof SET_RESULT
  payload: {
    project: string
    aggregatedResult: AggregatedResult
  }
}

interface UpdateResultAction {
  type: typeof UPDATE_RESULT
  payload: {
    project: string
    test: Test
    result: TestResult
  }
}

interface ClearResultAction {
  type: typeof CLEAR_RESULT
  payload: {
    project: string
  }
}

export type ResultAction = SetResultAction | UpdateResultAction | ClearResultAction
