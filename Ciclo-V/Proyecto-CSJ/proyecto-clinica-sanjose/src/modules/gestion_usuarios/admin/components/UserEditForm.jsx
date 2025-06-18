import React, { useState } from 'react';
import {
    TextField,
    Grid2,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Button
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { startAddRegister } from '../../store/admin/thunks';
import Swal from 'sweetalert2';
import { Description } from '@mui/icons-material';
import LoadingModal from '../../../loading/LoadingModal';

const UserEditForm = ({ onClose }) => {
    const [loading, setLoading] = useState(false);
    const { activeRegister } = useSelector(state => state.admin);
    const [formData, setFormData] = useState(activeRegister);
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                setFormData({ ...formData, registro: base64 });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = `data:application/octet-stream;base64,${formData.registro}`;
        link.download = `Registro_Senescyt_${activeRegister.nombres.replace(/\s+/g, '')}_${activeRegister.cedula}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        Swal.fire({
            title: "Actualizar Registro",
            text: "Estas a punto de actualizar permanentemente los datos de este usuario, esta acción no se puede revertir",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ACTUALIZAR",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                await dispatch(startAddRegister(formData));
                onClose(true);
                setLoading(false);

            }
        });

    };


    return (
        <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
            <LoadingModal
                open={loading}
                onClose={() => setLoading(false)}
            />
            <Grid2 container spacing={2}>
                <Grid2 item size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        label="Nombres"
                        name="nombres"
                        value={formData.nombres || ''}
                        onChange={handleChange}
                        variant="outlined"
                    />
                </Grid2>
                <Grid2 item size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        disabled
                        label="Cédula"
                        name="cedula"
                        value={formData.cedula || ''}
                        onChange={handleChange}
                        variant="outlined"
                    />
                </Grid2>
                <Grid2 item size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                        variant="outlined"
                    />
                </Grid2>
                <Grid2 item size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        label="Contacto"
                        name="contacto"
                        value={formData.contacto || ''}
                        onChange={handleChange}
                        variant="outlined"
                    />
                </Grid2>
                {formData.especialidad !== undefined && (
                    <Grid2 item size={{ xs: 12 }} >
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Especialidad</InputLabel>
                            <Select
                                name="especialidad"
                                value={formData.especialidad || ''}
                                onChange={handleChange}
                                label="Especialidad"
                            >
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
                            </Select>
                        </FormControl>
                    </Grid2>
                )}
                {formData.registro !== undefined && (
                    <Grid2 item size={{ xs: 12 }}>
                        <label
                            htmlFor="fileIn"
                            class="text-sm text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Registro Senescyt</label>
                        <input
                            type="file"
                            id='fileIn'
                            accept="application/pdf"
                            class="flex w-full rounded-md border border-blue-300 border-input bg-white text-sm text-gray-400 file:border-0 file:bg-blue-600 file:text-white file:text-sm file:font-medium"
                            onChange={handleFileChange}
                            style={{ marginTop: '2px', marginBottom: '5px' }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleDownload}
                            disabled={!formData.registro}
                            endIcon={<Description />}
                            sx={{
                                mr: '30px',
                                mt: '10px',
                                textTransform: 'none',
                                borderRadius: '20px',
                            }}
                        >
                            Descargar último registro
                        </Button>
                    </Grid2>
                )}
                {formData.tipo_sangre !== undefined && (
                    <Grid2 item size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Tipo de Sangre"
                            name="tipo_sangre"
                            value={formData.tipo_sangre || ''}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid2>
                )}
                {formData.sexo !== undefined && (
                    <Grid2 item size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Sexo</InputLabel>
                            <Select
                                name="sexo"
                                value={formData.sexo || ''}
                                onChange={handleChange}
                                label="Sexo"
                            >
                                <MenuItem value="Masculino">Masculino</MenuItem>
                                <MenuItem value="Femenino">Femenino</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid2>
                )}
                {formData.fechanac !== undefined && (
                    <Grid2 item size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Fecha de Nacimiento"
                            name="fechanac"
                            type="date"
                            value={formData.fechanac || ''}
                            onChange={handleChange}
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid2>
                )}


                <Grid2 item size={{ xs: 12 }} gap={1} sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: '20px' }} >
                    <Button onClick={() => onClose(true)} variant="outlined" sx={{ borderRadius: '8px', color: 'black', borderColor: '#8e8e8e' }}>
                        Cancelar
                    </Button>

                    <Button type="submit" variant="contained" sx={{ borderRadius: '8px', color: 'white', bgcolor: '#098280' }}>
                        Guardar Cambios
                    </Button>
                </Grid2>
            </Grid2>
        </Box>
    );
};

export default UserEditForm;
