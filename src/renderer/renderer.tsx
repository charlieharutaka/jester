/**
 * React renderer.
 */
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './redux/Store'

import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { CSSProperties } from '@mui/styles'
import "@fontsource/abril-fatface"

import Dashboard from './dashboard/Dashboard'
import { ipcRenderer } from 'electron'


ipcRenderer.on('redux', (event, data) => {
  store.dispatch(data)
})

const theme = createTheme({
  typography: {
    fontFamily: 'Abril Fatface',
  },
})

ReactDOM.render(
  <Provider store={store}>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Dashboard />
      </ThemeProvider>
    </StyledEngineProvider>
  </Provider>,
  document.getElementById('app'),
)

type RendererTheme = typeof theme
export type { RendererTheme }
