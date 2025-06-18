import React from 'react'
import { Provider } from 'react-redux'
import { store } from './store_general/store'
import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './router/AppRouter'
import { createTheme, ThemeProvider } from '@mui/material'

// Fuente Poppins
const theme = createTheme({
    typography: {
        fontFamily: 'Poppins, sans-serif',  // Aquí aplicamos la fuente Poppins
    }
});

export const SanJoseSysApp = () => {
    return (
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <BrowserRouter>
                    <AppRouter />
                </BrowserRouter>
            </Provider>
        </ThemeProvider>
    )
}
