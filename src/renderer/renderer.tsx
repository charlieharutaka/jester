/**
 * React renderer.
 */
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './redux/Store'

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import { createMuiTheme } from '@material-ui/core/styles'
import { CSSProperties } from '@material-ui/styles'

import Dashboard from './dashboard/Dashboard'
import { ipcRenderer } from 'electron'

import AbrilFatface from './fonts/AbrilFatface-Italic.woff2'

ipcRenderer.on('redux', (event, data) => {
  store.dispatch(data)
})

const abrilFatfaceItalic: CSSProperties = {
  fontFamily: 'Abril Fatface',
  fontStyle: 'italic',
  fontDisplay: 'swap',
  fontWeight: 700,
  src: `
    local('AbrilFatface-Italic'),
    url(${AbrilFatface}) format('woff2')
  `,
}

const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [abrilFatfaceItalic]
      }
    }
  }
})

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <Dashboard />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('app'),
)
