/**
 * React renderer.
 */
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import store from '../redux/Store'

import Dashboard from './dashboard/Dashboard'
import { ipcRenderer } from 'electron'

ipcRenderer.on('redux', (event, message) => {
  console.log(message)
})

ReactDOM.render(
  <Provider store={store}>
    <div className="app">
      <h4>Welcome to React, Electron and Typescript</h4>
      <p>Hello</p>
      <Dashboard />
    </div>
  </Provider>,
  document.getElementById('app'),
)
