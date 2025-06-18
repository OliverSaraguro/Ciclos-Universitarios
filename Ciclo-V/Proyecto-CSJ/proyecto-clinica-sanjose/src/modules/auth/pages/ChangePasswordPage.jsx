import React, { useState } from 'react';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    Check as CheckIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { green, red } from '@mui/material/colors';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { startChangePassword } from '../store/auth/thunks';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import LoadingModal from '../../loading/LoadingModal';

const ChangePasswordPage = () => {
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordRequirements, setPasswordRequirements] = useState({
        length: false,
        noSpaces: false,
        hasNumber: false,
        hasUppercase: false,
        hasSpecialChar: false
    });

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const cedula = location.state || {};

    const validatePassword = (password) => {
        setPasswordRequirements({
            length: password.length >= 6,
            noSpaces: !password.includes(' '),
            hasNumber: /\d/.test(password),
            hasUppercase: /[A-Z]/.test(password),
            hasSpecialChar: /[*$#%]/.test(password)
        });
    };

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setNewPassword(password);
        validatePassword(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const allRequirementsMet = Object.values(passwordRequirements).every(Boolean);

        if (!allRequirementsMet) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, cumple todos los requisitos de la contraseña'
            });
            return;
        }

        setLoading(true);
        await dispatch(startChangePassword(newPassword, cedula));
        setLoading(false);
    };

    const passwordRequirementsList = [
        {
            text: 'Al menos 6 caracteres',
            condition: passwordRequirements.length
        },
        {
            text: 'Sin espacios',
            condition: passwordRequirements.noSpaces
        },
        {
            text: 'Al menos un número',
            condition: passwordRequirements.hasNumber
        },
        {
            text: 'Al menos una mayúscula',
            condition: passwordRequirements.hasUppercase
        },
        {
            text: 'Al menos un símbolo especial (*$#%)',
            condition: passwordRequirements.hasSpecialChar
        }
    ];

    return (
        <Container
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh'
            }}
        >
            <LoadingModal
                open={loading}
                onClose={() => setLoading(false)}
            />
            <Typography
                variant="h3"
                sx={{
                    color: green[500],
                    marginBottom: 3,
                    textAlign: 'center'
                }}
            >
                Cambio de Contraseña
            </Typography>

            <Typography
                variant="subtitle1"
                sx={{
                    marginBottom: 3,
                    textAlign: 'center'
                }}
            >
                Para acceder la primera vez necesitas establecer tu contraseña
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    width: '100%',
                    maxWidth: 400,
                    backgroundColor: 'background.paper',
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 3
                }}
            >
                <TextField
                    fullWidth
                    type="password"
                    label="Nueva contraseña"
                    variant="outlined"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    sx={{ mb: 2 }}
                />

                <List>
                    {passwordRequirementsList.map((req, index) => (
                        <ListItem key={index}>
                            <ListItemIcon>
                                {req.condition ? (
                                    <CheckIcon sx={{ color: green[500] }} />
                                ) : (
                                    <CloseIcon sx={{ color: red[500] }} />
                                )}
                            </ListItemIcon>
                            <ListItemText primary={req.text} />
                        </ListItem>
                    ))}
                </List>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Guardar
                </Button>
            </Box>

            <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                sx={{ mt: 2 }}
            >
                Volver
            </Button>

            <Box
                sx={{
                    position: 'fixed',
                    bottom: 20,
                    left: 10,
                }}
            >
                <Box
                    component="img"
                    src="/imgs/logo1.png"
                    sx={{
                        width: { xs: '60px', sm: '200px' }
                    }}
                />
            </Box>
        </Container>
    );
};

export default ChangePasswordPage;