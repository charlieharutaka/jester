import ipc from 'node-ipc'

import { Reporter } from '@jest/reporters'
import { Context, Test, ReporterOnStartOptions } from '@jest/reporters/build/types'
import { AggregatedResult, TestResult } from '@jest/test-result'
import { Config } from '@jest/types'

import { SOCKET_ID,SOCKET_PORT } from '../common/Macros'

interface JesterReporterOptions {}

class JesterReporter implements Reporter {
  private readonly globalConfig: Config.GlobalConfig
  private readonly options: JesterReporterOptions
  constructor(globalConfig: Config.GlobalConfig, options: JesterReporterOptions) {
    this.globalConfig = globalConfig
    this.options = options
    ipc.config.id = SOCKET_ID
    ipc.config.networkPort = SOCKET_PORT
    ipc.config.maxRetries = 0
    ipc.config.silent = true
  }
  public onTestResult(test: Test, testResult: TestResult, aggregatedResult: AggregatedResult): Promise<void> | void {}
  public onRunStart(results: AggregatedResult, options: ReporterOnStartOptions): Promise<void> | void {}
  public onTestStart(test: Test): Promise<void> | void {}
  public onRunComplete(contexts: Set<Context>, results: AggregatedResult): Promise<void> | void {
    console.log('Run Complete')
    ipc.connectToNet(SOCKET_ID, () => {
      console.log('Attempting to connect to Jester Frontend...')
      ipc.of[SOCKET_ID].on('connect', () => {
        console.log('Connected')
        ipc.of[SOCKET_ID].emit('message', results)
        ipc.disconnect(SOCKET_ID)
      })
      ipc.of[SOCKET_ID].on('error', () => {
        console.error('Could not connect! Are you running the Jester Frontend?')
      })
    })
  }
  public getLastError(): Error | void {}
}

module.exports = JesterReporter
