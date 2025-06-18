import { Button, Divider, Grid2, TextField, Typography, Box } from '@mui/material'
import React from 'react'
import { LoginForm } from '../components/LoginForm'

export const LoginPage = () => {
    return (
        <Grid2
            container
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'row',
            }}
            spacing={0}
        >
            {/* Formulario de Login */}
            <LoginForm />


            {/* Imagen */}
            <Grid2
                container
                size={{
                    md: 7,
                    lg: 9,
                }}
                sx={{
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backgroundColor: '#098280'
                }}
            >
                <Box
                    component="img"
                    sx={{
                        height: { md: '166px', lg: '250x' },
                        width: { md: '126px', lg: '130px'},
                        alignSelf: 'center',
                        position: 'fixed',
                        top: '0',
                        marginTop: '20px'
                    }}
                    alt="Logo de la clínica San José"
                    src="/imgs/logo2.png"
                />

                <Box
                    component="img"
                    sx={{
                        height: { md: '340px', lg: '499px'},
                        width: { md: '672px', lg: '972px'},
                        alignSelf: 'center',
                        position: 'fixed',
                        bottom: '0'
                    }}
                    alt="Image de presentación"
                    src="/imgs/portada.png"
                />
            </Grid2>
        </Grid2 >
    )
}