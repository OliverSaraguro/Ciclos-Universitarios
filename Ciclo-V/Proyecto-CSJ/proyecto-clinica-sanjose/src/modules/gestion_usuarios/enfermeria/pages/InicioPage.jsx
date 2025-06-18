import React from 'react';
import { Box, Typography, Button, Container, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundForward } from 'react-icons/io';
import { startLogout } from '../../../auth/store/auth/thunks';
import { Logout } from '@mui/icons-material';

const BackgroundCircle = styled('div')(({ size, color, top, left, bottom, right }) => ({
    position: 'absolute',
    width: size,
    height: size,
    borderRadius: '50%',
    backgroundColor: color,
    top: top,
    left: left,
    bottom: bottom,
    right: right,
    opacity: 0.1,
    zIndex: 0,
}));

const StyledButton = styled(Button)({
    borderRadius: '50px',
    padding: '12px 30px',
    fontSize: '18px',
    fontWeight: 'bold',
    textTransform: 'none',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
        transition: 'all 0.4s ease',
    },
    '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0 4px 12px rgba(0, 77, 64, 0.3)',
        backgroundColor: '#00695c',
        '&::before': {
            left: '100%',
        },
    },
});

export const InicioPage = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { resp } = useSelector(state => state.auth);

    const toPatients = () => {
        navigate('pacientes');
    }

    const handleLogout = () => {
        dispatch(startLogout());
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: 'white',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <BackgroundCircle size="300px" color="#004d40" top="0" left="0" />
            <BackgroundCircle size="200px" color="#00695c" top="50px" left="50px" />
            <BackgroundCircle size="150px" color="#00897b" bottom="0" right="0" />
            <BackgroundCircle size="100px" color="#4db6ac" bottom="50px" right="50px" />

            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>

                <Tooltip title="Cerrar Sesión" placement="left">
                    <IconButton
                        onClick={handleLogout}
                        sx={{
                            position: "fixed",
                            backgroundColor: 'white',
                            boxShadow: '0 2px 2px 2px rgb(219, 219, 219)',
                            top: 25,
                            right: 25,
                        }}
                    >
                        <Logout />
                    </IconButton>
                </Tooltip>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '100vh',
                        textAlign: 'center',
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Typography variant="h3" component="h1" sx={{ mb: 2, fontWeight: 'bold', color: '#004d40' }}>
                            Bienvenido/a {resp.user.nombres}
                        </Typography>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <Typography variant="h6" sx={{ mb: 6, color: '#00695c' }}>
                            Este es su panel hospitalario para la gestión de pacientes
                        </Typography>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <StyledButton
                            variant="contained"
                            color="primary"
                            onClick={toPatients}
                            endIcon={
                                <IoMdArrowRoundForward />
                            }
                            sx={{
                                backgroundColor: '#004d40',
                            }}
                        >
                            Pacientes de la Clínica
                        </StyledButton>
                    </motion.div>
                    <Box position='fixed' bottom={5} >
                        <Typography fontFamily='Roboto' textAlign='center' color='gray' >Clínica Hospital San José - Sistema de Gestión Hospitalario</Typography>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};


