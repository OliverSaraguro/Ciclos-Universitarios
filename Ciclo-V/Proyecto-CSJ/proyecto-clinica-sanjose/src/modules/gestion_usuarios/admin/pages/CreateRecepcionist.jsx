import { useDispatch } from "react-redux"
import { Box, Button, Grid2, IconButton, MenuItem, TextField, Typography } from "@mui/material";
import { useForm } from "../../../../hooks/useForm";
import { startAddRegister } from "../../store/admin/thunks";
import { ArrowBackIos, Description } from "@mui/icons-material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import LoadingModal from "../../../loading/LoadingModal";
import { useState } from "react";

// VERIFICA QUE SE ADAPTE A LOS CAMPOS DE FORUMALRIO DE CREACION EN FIGMA

const initialForm = {
    nombres: '',
    email: '',
    cedula: '',
    contacto: '',
}

export const CreateRecepcionist = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const {
        onInputChange,
        onResetForm,
        nombres,
        cedula,
        contacto,
        email,
    } = useForm(initialForm);



    const onSubmitData = (event) => {
        event.preventDefault();
        const data = {
            nombres,
            email,
            cedula,
            contacto,
        }

        Swal.fire({
            title: "Crear Registro",
            text: "Estas a punto de crear usuario en la base de datos del sistema hospitalario",
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "CREAR",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                await dispatch(startAddRegister(data));
                setLoading(false);
                navigate(-1);
            }
        });

        onResetForm();
    }

    const handleBack = () => {
        navigate(-1);
    }


    return (
        <>
            <LoadingModal
                open={loading}
                onClose={() => setLoading(false)}
            />
            <Box ml={{ xs: '15px', sm: '255px' }} mt='5px' sx={{
                position: 'fixed',
                zIndex: 100,
            }}>
                <IconButton
                    edge='end'
                    className='animate__animated animate__slideInLeft animate__fast'
                    sx={{
                        mr: { xs: '0', sm: '5px' },
                        ml: { xs: '48px', sm: '0' },
                        bgcolor: 'white'
                    }}
                    onClick={handleBack}
                >
                    <ArrowBackIos sx={{ color: 'initial' }} />
                </IconButton>
            </Box>
            <Grid2 container
                className='animate__animated animate__zoomIn animate__fast'
                sx={{
                    display: 'flex',
                    padding: '16px',
                    ml: { xs: '0', sm: '240px' },
                    flexDirection: 'column',
                    top: '0',
                    mt: '47px',
                    minHeight: '86.5vh',
                }}
            >

                {/* Titulo */}
                <Grid2
                    display='flex'
                    flexDirection='column'
                    color='black'
                    fontFamily='Poppins'
                >
                    <Typography
                        variant="h1"
                        fontSize='40px'
                        fontStyle='normal'
                        fontWeight='600'
                        lineHeight='146.475%'
                        textAlign='center'
                    >
                        Registrar Recepcionista</Typography>
                    <Typography
                        variant="subtitle1"
                        textAlign='center'
                        fontSize='16px'
                        fontStyle='400'
                        lineHeight='146.475%'
                    >
                        Llene los campos a continuación para el registro de un nuevo recepcionista en la base de datos hospitalaria</Typography>
                </Grid2>

                <form onSubmit={onSubmitData} autoComplete="off">
                    {/* Bloque 1 */}
                    <Grid2 container
                        display='flex'
                        flexDirection='column'
                        mt='55px'
                        ml='30px'
                        mr={{ xs: '30px', md: '0' }}
                    >
                        <Typography
                            textAlign='center'
                            fontSize='20px'
                            fontWeight='600'
                            lineHeight='146.475%'
                        >
                            Llena los datos del nuevo recepcionista
                        </Typography>
                        {/* Fila de campos */}
                        <Grid2
                            display='flex'
                            flexDirection='row'
                            mt='30px'
                            gap='30px'
                            flexWrap='wrap'
                            width='100%'
                            justifyContent='center'
                        >
                            {/* Pila 1 */}
                            <Grid2
                                display='flex'
                                flexDirection='column'
                                width={{ xs: '100%', md: '40%' }}
                                gap='18px'
                            >
                                <Box>
                                    <Typography
                                        fontSize='13px'
                                        fontWeight='300'
                                        lineHeight='146.475%'
                                        ml='12px'
                                        mb='5px'
                                    >
                                        Nombres y Apellidos
                                    </Typography>
                                    <TextField
                                        type="text"
                                        placeholder="Ingrese los nombres y apellidos del médico"
                                        fullWidth
                                        name="nombres"
                                        required
                                        value={nombres}
                                        onChange={onInputChange}
                                        slotProps={{
                                            input: {
                                                sx: {
                                                    width: '100%',
                                                    height: '48px',
                                                    padding: '8px 8px 8px 16px',
                                                    backgroundColor: '#E9E9E9',
                                                    borderRadius: '4px',
                                                    '& input': {
                                                        color: '#080808',
                                                    },
                                                    '& input::-webkit-input-placeholder': {
                                                        color: '#080808',
                                                        fontSize: '12px'
                                                    },
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        border: 'none'
                                                    },
                                                },
                                            }
                                        }}
                                    />
                                </Box>
                                <Box>
                                    <Typography
                                        fontSize='13px'
                                        fontWeight='300'
                                        lineHeight='146.475%'
                                        ml='12px'
                                        mb='5px'
                                    >
                                        Nro. Cédula
                                    </Typography>
                                    <TextField
                                        type="number"
                                        placeholder="Ingresa la cédula"
                                        required
                                        fullWidth
                                        name="cedula"
                                        value={cedula}
                                        onChange={onInputChange}
                                        slotProps={{
                                            input: {
                                                sx: {
                                                    width: '100%',
                                                    height: '48px',
                                                    padding: '8px 8px 8px 16px',
                                                    backgroundColor: '#E9E9E9',
                                                    borderRadius: '4px',
                                                    '& input': {
                                                        color: '#080808',
                                                    },
                                                    '& input::-webkit-input-placeholder': {
                                                        color: '#080808',
                                                        fontSize: '12px'
                                                    },
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        border: 'none'
                                                    },
                                                },
                                            }
                                        }}
                                    />
                                </Box>



                            </Grid2>
                            {/* Pila 2 */}
                            <Grid2
                                display='flex'
                                flexDirection='column'
                                width={{ xs: '100%', md: '40%' }}
                                gap='18px'
                            >

                                <Box>
                                    <Typography
                                        fontSize='13px'
                                        fontWeight='300'
                                        lineHeight='146.475%'
                                        ml='12px'
                                        mb='5px'
                                    >
                                        Contacto
                                    </Typography>
                                    <TextField
                                        type="number"
                                        placeholder="Ingresa el contacto"
                                        fullWidth
                                        name="contacto"
                                        value={contacto}
                                        onChange={onInputChange}
                                        slotProps={{
                                            input: {
                                                sx: {
                                                    width: '100%',
                                                    height: '48px',
                                                    padding: '8px 8px 8px 16px',
                                                    backgroundColor: '#E9E9E9',
                                                    borderRadius: '4px',
                                                    '& input': {
                                                        color: '#080808',
                                                    },
                                                    '& input::-webkit-input-placeholder': {
                                                        color: '#080808',
                                                        fontSize: '12px'
                                                    },
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        border: 'none'
                                                    },
                                                },
                                            }
                                        }}
                                    />
                                </Box>

                                <Box>
                                    <Typography
                                        fontSize='13px'
                                        fontWeight='300'
                                        lineHeight='146.475%'
                                        ml='12px'
                                        mb='5px'
                                    >
                                        Email
                                    </Typography>
                                    <TextField
                                        type="email"
                                        placeholder="Ingresa la dirección de correo"
                                        required
                                        fullWidth
                                        name="email"
                                        value={email}
                                        onChange={onInputChange}
                                        slotProps={{
                                            input: {
                                                sx: {
                                                    width: '100%',
                                                    height: '48px',
                                                    padding: '8px 8px 8px 16px',
                                                    backgroundColor: '#E9E9E9',
                                                    borderRadius: '4px',
                                                    '& input': {
                                                        color: '#080808',
                                                    },
                                                    '& input::-webkit-input-placeholder': {
                                                        color: '#080808',
                                                        fontSize: '12px'
                                                    },
                                                    '& .MuiOutlinedInput-notchedOutline': {
                                                        border: 'none'
                                                    },
                                                },
                                            }
                                        }}
                                    />
                                </Box>
                            </Grid2>

                        </Grid2>
                    </Grid2>


                    {/* Bloque 2 */}
                    <Grid2
                        width='100%'
                        display='flex'
                        justifyContent='center'
                        mt={15}
                    >
                        <Button
                            type="submit"
                            sx={{
                                justifySelf: 'end',
                                width: '163px',
                                height: '50px',
                                padding: '10px 12px 11px 12px',
                                borderRadius: '43px',
                                backgroundColor: '#43A65E',
                                color: '#fff',
                                textAlign: 'center',
                                fontSize: '15px',
                                fontWeight: '400',
                                lineHeight: '146.475%',
                                alignSelf: 'end',
                                ':hover': {
                                    cursor: 'pointer',
                                    transition: '0.2s ease-in-out',
                                    transform: 'scale(1.02)',
                                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                                }
                            }}
                        >
                            Crear
                        </Button>
                    </Grid2>
                </form>

            </Grid2>
        </>
    )
}
