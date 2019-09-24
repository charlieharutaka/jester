import { Reporter } from '@jest/reporters'
import { Context, Test, ReporterOnStartOptions } from '@jest/reporters/build/types'
import { AggregatedResult, TestResult } from '@jest/test-result'
import { Config } from '@jest/types'

import { setResult } from '../renderer/redux/actions/ResultActions'
import dispatch from './Dispatch'

interface JesterReporterOptions {}

class JesterReporter implements Reporter {
  private readonly globalConfig: Config.GlobalConfig
  private readonly options: JesterReporterOptions
  constructor(globalConfig: Config.GlobalConfig, options: JesterReporterOptions) {
    this.globalConfig = globalConfig
    this.options = options
  }
  public onTestResult(test: Test, testResult: TestResult, aggregatedResult: AggregatedResult): Promise<void> | void {
    console.log(`Test ${test.path} completed, ${testResult.numFailingTests === 0 ? 'passed' : 'failed'}`)
  }
  public onRunStart(results: AggregatedResult, options: ReporterOnStartOptions): Promise<void> | void {
    console.log('Run Started')
  }
  public onTestStart(test: Test): Promise<void> | void {
    console.log(`Test ${test.path} started`)
  }
  public onRunComplete(contexts: Set<Context>, results: AggregatedResult): Promise<void> | void {
    console.log('Run Complete')
    dispatch(setResult(this.globalConfig.rootDir, results))
  }
  public getLastError(): Error | void {}
}

module.exports = JesterReporter
