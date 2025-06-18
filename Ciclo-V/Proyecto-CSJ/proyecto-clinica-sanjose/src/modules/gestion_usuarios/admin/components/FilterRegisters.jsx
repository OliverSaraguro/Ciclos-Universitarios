import React, { useEffect } from "react";
import { Box, Typography, TextField, MenuItem, Button, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { useForm } from "../../../../hooks/useForm";
import { useSelector } from "react-redux";

const initForm = {
    especialidad: "",
    cedula: "",
    nombres: "",
    email: "",
    tipo_sangre: "",
    contacto: "",
    edad: "",
    ordenarpor: "",
    fechain: "",
    fechafin: "",
    sexo: "",
};

export const FilterRegisters = ({ onFilter }) => {
    const {
        onInputChange,
        onResetForm,
        especialidad,
        cedula,
        nombres,
        email,
        tipo_sangre,
        contacto,
        ordenarpor,
        edad,
        fechain,
        fechafin,
        sexo,
        formState,
    } = useForm(initForm);

    useEffect(() => {
        onFilter({ especialidad, cedula, nombres, email, tipo_sangre, contacto, ordenarpor, edad, fechafin, fechain, sexo });
    }, [formState]);

    const { resp } = useSelector(state => state.admin);

    return (
        <Box
            className='animate__animated animate__slideInRight'
            sx={{
                padding: 3,
                borderRadius: "12px",
                backgroundColor: "white",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                width: { xs: "300px", md: "580px", xl: "300px" },
                maxHeight: '600px',
                mt: { xs: 5, xl: 0 },
                overflow: 'auto', // Permitir scroll
                '&::-webkit-scrollbar': {
                    width: '2.5px', // Ancho del scrollbar
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#004d40', // Color del scrollbar
                    borderRadius: '8px', // Bordes redondeados
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: '#00695c', // Color al pasar el mouse
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: '#f1f1f1', // Color del track
                },
            }}
        >


            <form onReset={onResetForm} >
                <Typography
                    variant="h6"
                    sx={{ mb: 3, fontWeight: "bold", color: "#004d40" }}
                >
                    Filtrar
                </Typography>

                {
                    (resp.type == "doctors") && (
                        <TextField
                            label="Especialidad Médica"
                            name="especialidad"
                            value={especialidad}
                            onChange={onInputChange}
                            variant="outlined"
                            fullWidth
                            select
                            sx={{
                                mb: 2,
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "#004d40",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#00695c",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#004d40",
                                    },
                                },
                                "& .MuiInputLabel-root": {
                                    color: "#004d40",
                                },
                            }}
                        >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="Cirugía general y laparoscópica">Cirugía general y laparoscópica</MenuItem>
                            <MenuItem value="Cirugía pediátrica">Cirugía pediátrica</MenuItem>
                            <MenuItem value="Cirugía ginecológica y obstetricia">Cirugía ginecológica y obstetricia</MenuItem>
                            <MenuItem value="Cirugía plástica y reconstructiva">Cirugía plástica y reconstructiva</MenuItem>
                            <MenuItem value="Cirugía traumatológica y ortopedia">Cirugía traumatológica y ortopedia</MenuItem>
                            <MenuItem value="Cirugía urológica">Cirugía urológica                            </MenuItem>
                            <MenuItem value="Pediatría y neonatología">Pediatría y neonatología</MenuItem>
                            <MenuItem value="Nefrología">Nefrología</MenuItem>
                            <MenuItem value="Otorrinolaringología">Otorrinolaringología</MenuItem>
                            <MenuItem value="Medicina interna">Medicina interna</MenuItem>
                            <MenuItem value="Cardiología">Cardiología</MenuItem>
                            <MenuItem value="Neurocirugía">Neurocirugía</MenuItem>
                            <MenuItem value="Endocrinología">Endocrinología</MenuItem>
                            <MenuItem value="Dermatología">Dermatología</MenuItem>
                            <MenuItem value="Psicología clínica">Psicología clínica</MenuItem>
                            <MenuItem value="Gastroenterología">Gastroenterología</MenuItem>
                            <MenuItem value="Cirugía vascular">Cirugía vascular</MenuItem>
                            <MenuItem value="Odontología">Odontología</MenuItem>
                            <MenuItem value="Psiquiatría">Psiquiatría</MenuItem>
                            <MenuItem value="Urología">Urología</MenuItem>

                        </TextField>
                    )}
                {

                    (resp.type == "patients") && (
                        <TextField
                            label="Buscar por tipo de sangre"
                            variant="outlined"
                            name="tipo_sangre"
                            value={tipo_sangre}
                            onChange={onInputChange}
                            fullWidth
                            sx={{
                                mb: 2,
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "#004d40",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#00695c",
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#004d40",
                                    },
                                },
                                "& .MuiInputLabel-root": {
                                    color: "#004d40",
                                },
                            }}
                        />
                    )}
                {(resp.type == "patients") && (

                    <TextField
                        label="Buscar por edad"
                        variant="outlined"
                        name="edad"
                        value={edad}
                        onChange={onInputChange}
                        fullWidth
                        sx={{
                            mb: 2,
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#004d40",
                                },
                                "&:hover fieldset": {
                                    borderColor: "#00695c",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#004d40",
                                },
                            },
                            "& .MuiInputLabel-root": {
                                color: "#004d40",
                            },
                        }}
                    />
                )}
                {(resp.type == "patients") && (
                    <TextField
                        label="Fecha desde"
                        type="date"
                        name="fechain"
                        value={fechain}
                        onChange={onInputChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 2 }}
                    />
                )}
                {(resp.type == "patients") && (

                    <TextField
                        label="Fecha hasta"
                        type="date"
                        name="fechafin"
                        value={fechafin}
                        onChange={onInputChange}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 2 }}
                    />

                )}

                {(resp.type == "patients") && (

                    <RadioGroup
                        row
                        name="sexo"
                        value={sexo}
                        onChange={onInputChange}
                        sx={{ mb: 2 }}
                    >
                        <FormControlLabel value="Masculino" control={<Radio />} label="Masculino" />
                        <FormControlLabel value="Femenino" control={<Radio />} label="Femenino" />
                    </RadioGroup>

                )}

                <TextField
                    label="Buscar por cédula"
                    variant="outlined"
                    name="cedula"
                    value={cedula}
                    onChange={onInputChange}
                    fullWidth
                    sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                borderColor: "#004d40",
                            },
                            "&:hover fieldset": {
                                borderColor: "#00695c",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#004d40",
                            },
                        },
                        "& .MuiInputLabel-root": {
                            color: "#004d40",
                        },
                    }}
                />

                <TextField
                    label="Buscar por nombres"
                    variant="outlined"
                    name="nombres"
                    value={nombres}
                    onChange={onInputChange}
                    fullWidth
                    sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                borderColor: "#004d40",
                            },
                            "&:hover fieldset": {
                                borderColor: "#00695c",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#004d40",
                            },
                        },
                        "& .MuiInputLabel-root": {
                            color: "#004d40",
                        },
                    }}
                />


                <TextField
                    label="Buscar por email"
                    variant="outlined"
                    name="email"
                    value={email}
                    onChange={onInputChange}
                    fullWidth
                    sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                borderColor: "#004d40",
                            },
                            "&:hover fieldset": {
                                borderColor: "#00695c",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#004d40",
                            },
                        },
                        "& .MuiInputLabel-root": {
                            color: "#004d40",
                        },
                    }}
                />

                <TextField
                    label="Buscar por contacto"
                    variant="outlined"
                    name="contacto"
                    value={contacto}
                    onChange={onInputChange}
                    fullWidth
                    sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                borderColor: "#004d40",
                            },
                            "&:hover fieldset": {
                                borderColor: "#00695c",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#004d40",
                            },
                        },
                        "& .MuiInputLabel-root": {
                            color: "#004d40",
                        },
                    }}
                />

                <TextField
                    label="Ordenar por"
                    variant="outlined"
                    name="ordenarpor"
                    value={ordenarpor}
                    onChange={onInputChange}
                    fullWidth
                    select
                    sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                borderColor: "#004d40",
                            },
                            "&:hover fieldset": {
                                borderColor: "#00695c",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#004d40",
                            },
                        },
                        "& .MuiInputLabel-root": {
                            color: "#004d40",
                        },
                    }}
                >
                    <MenuItem value="az">De la A-Z</MenuItem>
                    <MenuItem value="za">De la Z-A</MenuItem>
                </TextField>



                <Button
                    type="reset"
                    variant="contained"
                    sx={{
                        mt: "22px",
                        color: "white",
                        display: "flex",
                        justifySelf: "start",
                        textTransform: "capitalize",
                        borderRadius: "20px",
                        borderColor: "black",
                        backgroundColor: "#098280",
                        "&:hover": {
                            backgroundColor: "#24284C",
                            borderColor: "black",
                        },
                    }}
                >
                    Restablecer
                </Button>
            </form>
        </Box>
    );
};
