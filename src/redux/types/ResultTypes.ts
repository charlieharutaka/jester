import { AggregatedResult, SnapshotSummary, TestResult } from '@jest/test-result'
import { Test } from '@jest/reporters/build/types'
import { CoverageMap } from 'istanbul-lib-coverage'

export const SET_RESULT = 'SET_RESULT'
export const UPDATE_RESULT = 'UPDATE_RESULT'
export const CLEAR_RESULT = 'CLEAR_RESULT'

export interface ResultState extends AggregatedResult {}

interface SetResultAction {
  type: typeof SET_RESULT
  payload: AggregatedResult
}

interface UpdateResultAction {
  type: typeof UPDATE_RESULT
  payload: {
    test: Test
    result: TestResult
  }
}

interface ClearResultAction {
  type: typeof CLEAR_RESULT
}

export type ResultAction = SetResultAction | UpdateResultAction | ClearResultAction
