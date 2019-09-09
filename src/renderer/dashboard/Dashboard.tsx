import React from 'react'
import { connect, MapDispatchToProps } from 'react-redux'
import { setResult, updateResult, clearResult } from '../../redux/actions/ResultActions'
import { AggregatedResult, TestResult } from '@jest/test-result'
import { Dispatch } from 'redux'
import { Test } from '@jest/reporters/build/types'
import { ReduxState } from '../../redux/reducers/RootReducer'

const Dashboard: React.FunctionComponent = (props) => {
  React.useEffect(() => console.log(props), [props])
  return <div>DASHBOARD</div>
}

const mapStateToProps = (state: ReduxState) => {
  const { result } = state
  return {
    ...result,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setResult: (aggregatedResult: AggregatedResult) => {
      dispatch(setResult(aggregatedResult))
    },
    updateResult: (test: Test, result: TestResult) => {
      dispatch(updateResult(test, result))
    },
    clearResult: () => {
      dispatch(clearResult())
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dashboard)
