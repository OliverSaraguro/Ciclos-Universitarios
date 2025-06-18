import { Alert, Box, Button, Divider, Grid2, TextField, Typography } from "@mui/material"
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "../../../hooks/useForm";
import { useEffect, useMemo, useState } from "react";
import { startLogin } from "../../auth/store/auth/thunks";
import { useNavigate } from "react-router-dom";
import LoadingModal from "../../loading/LoadingModal";

const formData = {
    password: '',
    cedula: '',
}


export const LoginForm = () => {

    const { status, errorMessage, resp } = useSelector(state => state.auth)
    const [rol, setRol] = useState('personal');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { password, cedula, onInputChange, formState } = useForm(formData);

    const isAuth = useMemo(() => status === 'checking', [status]);

    useEffect(() => {
        if (status === 'checking') {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [status])


    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        await dispatch(startLogin({ password, cedula, navigate }));
        setLoading(false);
    }

    const handleRol = () => {
        setRol(rol === 'personal' ? 'paciente' : 'personal');
    }

    return (
        <>
            <Grid2
                size={{
                    xs: 12,
                    md: 5,
                    lg: 3,
                }}
                sx={{

                    backgroundColor: '#FFFFFF',
                    padding: '95px 47px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '60px',
                    alignItems: 'flex-start',
                    boxShadow: '7px 0px 46px 5px rgba(0, 0, 0, 0.25)',
                    fontFamily: 'Merriweather Sans',
                }}
            >
                <LoadingModal
                    open={loading}
                    onClose={() => setLoading(false)}
                />
                <Box width='100%'>
                    <Typography
                        sx={{
                            color: '#098280',
                            fontFamily: "Merriweather Sans",
                            fontSize: '30px',
                            fontStyle: 'normal',
                            fontWeight: '400',
                            lineHeight: 'normal',
                            mb: '10px'
                        }}
                    >
                        Iniciar Sesión
                    </Typography>
                    <Typography
                        sx={{
                            color: '#303030',
                            fontSize: '19px',
                            fontStyle: 'normal',
                            fontWeight: '300',
                            lineHeight: 'normal'
                        }}
                    >
                        Acceder al sistema de gestión hospitalaria
                    </Typography>
                    <Divider sx={{ width: '100%', margin: '30px 0' }} />
                    {/* Formulario */}
                    <form style={{ width: '97%' }} onSubmit={onSubmit} autoComplete="off" >

                        {
                            (rol === 'personal') ?

                                <Box>
                                    <Grid2 container direction='column' sx={{ mb: '15px', width: '100%' }}>
                                        <Typography
                                            variant='caption'
                                            component='label'
                                            htmlFor='userid'
                                            sx={{
                                                color: 'rgba(0, 0, 0, 0.48)',
                                                fontFeatureSettings: "'liga' off, 'clig' off",
                                                fontFamily: 'Roboto',
                                                fontSize: '13px',
                                                fontStyle: 'normal',
                                                fontWeight: '300',
                                                lineHeight: '20px',
                                                marginLeft: '10px',
                                            }}
                                        >
                                            Usuario
                                        </Typography>
                                        <TextField
                                            type='number'
                                            required
                                            placeholder='Número de cédula'
                                            id='userid'
                                            name="cedula"
                                            value={cedula}
                                            onChange={onInputChange}
                                            fullWidth
                                            slotProps={{
                                                input: {
                                                    sx: {
                                                        width: '100%',
                                                        height: '48px',
                                                        padding: '8px 8px 8px 16px',
                                                        backgroundColor: '#f2f2f2',
                                                        borderRadius: '4px',
                                                        '& input': {
                                                            color: '#080808',
                                                        },
                                                        '& input::-webkit-input-placeholder': {
                                                            color: '#080808',
                                                        },
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            border: 'none'
                                                        },
                                                        '&:-webkit-autofill': {
                                                            WebkitBoxShadow: '0 0 0 1000px #f2f2f2 inset',
                                                            WebkitTextFillColor: '#080808',
                                                            caretColor: '#080808',
                                                        },
                                                    },
                                                }
                                            }}
                                        />
                                    </Grid2>
                                    <Grid2 container direction='column' sx={{ mb: '15px', width: '100%' }} className='animate__animated animate__headShake animate__faster' >
                                        <Typography
                                            variant='caption'
                                            component='label'
                                            htmlFor='passid'
                                            sx={{
                                                color: 'rgba(0, 0, 0, 0.48)',
                                                fontFeatureSettings: "'liga' off, 'clig' off",
                                                fontFamily: 'Roboto',
                                                fontSize: '13px',
                                                fontStyle: 'normal',
                                                fontWeight: '300',
                                                lineHeight: '20px',
                                                marginLeft: '10px',
                                            }}
                                        >
                                            Contraseña
                                        </Typography>
                                        <TextField
                                            type='password'
                                            placeholder='Ingresar contraseña'
                                            id='passid'
                                            name="password"
                                            value={password}
                                            required
                                            onChange={onInputChange}
                                            fullWidth
                                            slotProps={{
                                                input: {
                                                    sx: {
                                                        width: '100%',
                                                        height: '48px',
                                                        padding: '8px 8px 8px 16px',
                                                        backgroundColor: '#f2f2f2',
                                                        borderRadius: '4px',
                                                        '& input': {
                                                            color: '#080808',
                                                        },
                                                        '& input::-webkit-input-placeholder': {
                                                            color: '#080808',
                                                        },
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            border: 'none'
                                                        },
                                                    },
                                                }
                                            }}
                                        />
                                    </Grid2>
                                </Box>

                                :

                                <Box className='animate__animated animate__headShake animate__faster' >
                                    <Grid2 container direction='column' sx={{ mb: '15px', width: '100%' }}  >
                                        <Typography
                                            variant='caption'
                                            component='label'
                                            htmlFor='cedula'
                                            sx={{
                                                color: 'rgba(0, 0, 0, 0.48)',
                                                fontFeatureSettings: "'liga' off, 'clig' off",
                                                fontFamily: 'Roboto',
                                                fontSize: '13px',
                                                fontStyle: 'normal',
                                                fontWeight: '300',
                                                lineHeight: '20px',
                                                marginLeft: '10px',
                                            }}
                                        >
                                            Cedula
                                        </Typography>
                                        <TextField
                                            type='text'
                                            placeholder='Ingresa tu cédula'
                                            id='cedula'
                                            name="cedula"
                                            value={cedula}
                                            onChange={onInputChange}
                                            fullWidth
                                            required
                                            slotProps={{
                                                input: {
                                                    sx: {
                                                        width: '100%',
                                                        height: '48px',
                                                        padding: '8px 8px 8px 16px',
                                                        backgroundColor: '#f2f2f2',
                                                        borderRadius: '4px',
                                                        '& input': {
                                                            color: '#080808',
                                                        },
                                                        '& input::-webkit-input-placeholder': {
                                                            color: '#080808',
                                                        },
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            border: 'none'
                                                        },
                                                    },
                                                }
                                            }}
                                        />
                                    </Grid2>
                                </Box>
                        }


                        {/* <Typography
                            sx={{
                                fontFamily: 'Roboto',
                                fontWeight: '400',
                                fontSize: '12px',
                                lineHeight: '20px',
                                textAlign: 'right',
                                justifySelf: 'end',
                                color: '#007AFF',
                                ':hover': {
                                    cursor: 'pointer',
                                    color: '#025bbd',
                                    transition: '0.2s ease-in-out'
                                }
                            }}
                        >
                            ¿Olvidaste tu contraseña?
                        </Typography> */}

                        {
                            (rol === 'personal') ?
                                <Typography
                                    onClick={handleRol}
                                    sx={{
                                        fontFamily: 'Roboto',
                                        fontWeight: '400',
                                        fontSize: '12px',
                                        lineHeight: '20px',
                                        textAlign: 'left',
                                        justifySelf: 'start',
                                        color: '#007AFF',
                                        ':hover': {
                                            cursor: 'pointer',
                                            color: '#025bbd',
                                            transition: '0.2s ease-in-out'
                                        }
                                    }}
                                >
                                    ¿Eres Paciente?
                                </Typography> :

                                <Typography
                                    onClick={handleRol}
                                    sx={{
                                        fontFamily: 'Roboto',
                                        fontWeight: '400',
                                        fontSize: '12px',
                                        lineHeight: '20px',
                                        textAlign: 'left',
                                        justifySelf: 'start',
                                        color: '#007AFF',
                                        ':hover': {
                                            cursor: 'pointer',
                                            color: '#025bbd',
                                            transition: '0.2s ease-in-out'
                                        }
                                    }}
                                >
                                    ¿Eres Personal Médico?
                                </Typography>
                        }

                        {/* En caso de error */}
                        <Grid2 size={{ xs: 12 }} display={(errorMessage === null || errorMessage === undefined) ? 'none' : ''} >
                            <Alert severity='warning'>
                                {errorMessage}
                            </Alert>
                        </Grid2>

                        <Button
                            type='submit'
                            disabled={isAuth}
                            sx={{
                                width: '113px',
                                height: '40px',
                                backgroundImage: 'linear-gradient(90deg, #43A65E 0%, #6CB150 100%)',
                                borderRadius: '6px',
                                mt: '30px',
                                ':hover': {
                                    cursor: 'pointer',
                                    backgroundImage: 'linear-gradient(90deg, #3b9252 0%, #5f9d46 100%)',
                                    transition: '2s ease-in-out'
                                },
                                fontSize: '15px',
                                fontWeight: 700,
                                lineHeight: '20px',
                                textTransform: 'none',
                                color: '#FFFFFF',
                                fontFamily: 'Roboto'
                            }}
                        >
                            Acceder
                        </Button>
                    </form>
                </Box>

                {/* Logo */}
                <Box height='20%' width='100%' display='flex' flexDirection='column' justifySelf='flex-end' justifyContent='flex-end' >
                    <Box
                        component="img"
                        sx={{
                            height: '110px',
                            width: '270px',
                            alignSelf: 'center',
                            justifySelf: 'center',
                            bottom: '0',
                            mb: '15px'
                        }}
                        alt="Logo de la clínica San José"
                        src="/imgs/logo1.png"
                    />
                </Box>

            </Grid2>
        </>
    )
}
