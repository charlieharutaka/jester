import ipc from 'node-ipc'
import { SOCKET_ID, SOCKET_PORT } from '../common/Macros'
import { ResultAction } from '../renderer/redux/types/ResultTypes'

ipc.config.id = SOCKET_ID
ipc.config.networkPort = SOCKET_PORT
ipc.config.maxRetries = 0
ipc.config.silent = true

export default (action: ResultAction): void => {
  ipc.connectToNet(SOCKET_ID, () => {
    console.log('Attempting to connect to Jester Frontend...')
    ipc.of[SOCKET_ID].on('connect', () => {
      console.log('connected')
      ipc.of[SOCKET_ID].emit('message', action)
      ipc.disconnect(SOCKET_ID)
    })
    ipc.of[SOCKET_ID].on('error', () => {
      console.error('Could not connect! Are you running the Jester Frontend?')
    })
  })
}
