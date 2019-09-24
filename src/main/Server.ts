import ipc from 'node-ipc'

import { SOCKET_ID, SOCKET_PORT } from '../common/Macros'
import { SET_RESULT } from '../renderer/redux/types/ResultTypes'

function createServer(win: Electron.BrowserWindow): typeof ipc.server {
  ipc.config.id = SOCKET_ID
  ipc.config.networkPort = SOCKET_PORT
  ipc.config.silent = true
  ipc.serveNet(() => {
    ipc.server.on('connect', () => {
      console.log('Connection established')
    })
    ipc.server.on('message', (data, socket) => {
      console.log('dispatch setResult')
      win.webContents.send('redux', data)
    })
  })
  return ipc.server
}

export { createServer }
