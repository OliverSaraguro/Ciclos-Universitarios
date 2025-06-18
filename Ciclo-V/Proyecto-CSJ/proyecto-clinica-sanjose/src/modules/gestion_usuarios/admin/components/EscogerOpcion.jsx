import React from 'react'
import { Grid2, Typography, Box } from '@mui/material'
import { EmojiPeople } from '@mui/icons-material'

export const EscogerOpcion = () => {
    return (
        <Grid2
            container
            className='animate__animated animate__zoomIn animate__fast'
            sx={{
                display: 'flex',
                padding: '16px',
                ml: { xs: '0', sm: '240px' },
                flexDirection: 'column',
                top: '0',
                minHeight: '86.5vh',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box
                sx={{
                    textAlign: 'center',
                    maxWidth: '400px',
                }}
            >
                <EmojiPeople sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h4" gutterBottom>
                    Escoge una opción para empezar
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Escoge el tipo de usuario que deseas administrar desde el panel lateral.
                </Typography>
            </Box>
        </Grid2>
    )
}

