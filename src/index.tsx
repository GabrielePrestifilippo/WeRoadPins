import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { ThemeProvider } from '@emotion/react'
import { createTheme } from '@mui/material'

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff4758',
      dark: '#000',

      // light: will be calculated from palette.primary.main,
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: '#fff',
      light: '#F5EBFF',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#ff4758',
    },
  },
})
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
