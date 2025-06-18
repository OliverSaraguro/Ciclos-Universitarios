import React, { useEffect, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
    Container,
    Typography,
    Box,
    Button,
    Slide,
    Fade,
    Tooltip,
    IconButton,
    Alert,
} from '@mui/material';
import { display, styled } from '@mui/system';
import AdmisionNormal from './AdmisionNormal';
import AdmisionEmergencia from './AdmisionEmergencia';
import { startLogout } from '../../auth/store/auth/thunks';
import { Logout, RestartAlt } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from '../../../hooks/useForm';
import Swal from 'sweetalert2';
import { startAddForm, startAddHistory, startAddPatient, startSearchPatient, startSetEmergenciaFormData, startSetNormalFormData, startSetPatient } from '../store/thunks';
import * as XLSX from 'xlsx';
import LoadingModal from '../../loading/LoadingModal';

const backgroundStyles = `
    .background-shapes {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        z-index: 0;
        overflow: hidden;
    }

    .shape-1 {
        position: absolute;
        width: 500px;
        height: 500px;
        top: -250px;
        right: -250px;
        border-radius: 50%;
        background: rgba(76, 175, 80, 0.1);
    }

    .shape-2 {
        position: absolute;
        width: 300px;
        height: 300px;
        bottom: -150px;
        left: -150px;
        border-radius: 50%;
        background: rgba(46, 125, 50, 0.1);
    }

    .shape-3 {
        position: absolute;
        width: 200px;
        height: 200px;
        top: 50%;
        left: 25%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background: rgba(165, 214, 167, 0.1);
    }
`;

// Add the styles to the document
const styleSheet = document.createElement("style");
styleSheet.innerText = backgroundStyles;
document.head.appendChild(styleSheet);

const theme = createTheme({
    palette: {
        primary: {
            main: '#2e7d32',
        },
        secondary: {
            main: '#4caf50',
        },
        background: {
            default: '#fff',
        },
    }
});

const StyledContainer = styled(Container)(({ theme }) => ({
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(4),
    minHeight: '100vh',
    width: '100%',
    backgroundColor: 'transparent',
}));

const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: 8,
    padding: theme.spacing(1.5, 4),
    fontSize: '1rem',
    textTransform: 'none',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
        transform: 'translateY(-2px)',
    },
}));

const PageTransition = ({ children }) => (
    <Fade in={true} timeout={1000}>
        {children}
    </Fade>
);

const initCed = {
    cedula: ''
}

function validarCedulaEcuador(cedula) {
    if (cedula.length !== 10 || isNaN(cedula)) {
        return false;
    }

    const provincia = parseInt(cedula.substring(0, 2));
    if (provincia < 1 || provincia > 24) {
        return false;
    }

    const digitoVerificador = parseInt(cedula.charAt(9));
    let suma = 0;

    for (let i = 0; i < 9; i++) {
        let digito = parseInt(cedula.charAt(i));
        if (i % 2 === 0) {
            digito *= 2;
            if (digito > 9) {
                digito -= 9;
            }
        }
        suma += digito;
    }

    const residuo = suma % 10;
    const digitoCalculado = residuo === 0 ? 0 : 10 - residuo;

    return digitoCalculado === digitoVerificador;
}

export default function IngresoPreHospitalario() {
    const [tipoAdmision, setTipoAdmision] = useState('normal');
    const [busquedaCedula, setBusquedaCedula] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isNewPatient, setIsNewPatient] = useState(false);
    const dispatch = useDispatch();

    const { cedula, onInputChange, onResetForm } = useForm(initCed);
    const { paciente, normalFormData, emergenciaFormData } = useSelector(state => state.prehospitalario);
    const { resp } = useSelector(state => state.auth);

    useEffect(() => {
        if (paciente.nombres === '') {
            setIsNewPatient(true);
        } else {
            setIsNewPatient(false);
        }

        if (paciente === 'No se puede registrar personal hospitalario como pacientes.') {
            handleReset();
            setBusquedaCedula(false);
            setLoading(false);
        }
    }, [paciente])


    const handleTipoAdmisionChange = (newTipoAdmision) => {
        setTipoAdmision(newTipoAdmision);
    };

    const handleLogout = () => {
        dispatch(startLogout());
    }

    const handleSearchCedula = async () => {
        if (validarCedulaEcuador(cedula)) {
            setLoading(true);
            await dispatch(startSearchPatient(cedula));
            setBusquedaCedula(true);
            setLoading(false);

        } else {
            setBusquedaCedula(false);
            Swal.fire('Error de búsqueda', 'La cedula ingresada no posee un formato válido', 'error');
        }
    };

    const handleReset = () => {
        setBusquedaCedula(false);
        onResetForm();
        dispatch(startSetNormalFormData({}));
        dispatch(startSetEmergenciaFormData({}));
        dispatch(startSetPatient({}));
    }

    const handleRegistro = () => {

        let addPaciente = {};

        if (tipoAdmision === 'normal') {
            if (normalFormData.nombres === '' || normalFormData.sexo === '' || normalFormData.fecha_admision === '' || normalFormData.motivo_ingreso === '' || !normalFormData.nombres || !normalFormData.fecha_admision || !normalFormData.motivo_ingreso) {
                Swal.fire('Error al registrar', 'Se deben completar todos los campos obligatorios *', 'error');
                dispatch(startSetNormalFormData({}));
                return;
            }

            addPaciente = {
                ...paciente,
                nombres: normalFormData.nombres,
                cedula: parseInt(cedula),
                sexo: normalFormData.sexo,
                fechanac: normalFormData.fechanac || null,
                lugarnac: normalFormData.lugarnac || '',
                estadoCivil: normalFormData.estadoCivil || '',
                email: normalFormData.email || '',
                contacto: normalFormData.contacto || '',
                tipo_sangre: normalFormData.tipo_sangre || '',

            };

        }

        if (tipoAdmision !== 'normal') {
            if (emergenciaFormData.nombres === '' || emergenciaFormData.fecha_ingreso === '' || !emergenciaFormData.nombres) {
                Swal.fire('Error al registrar', 'Se deben completar todos los campos obligatorios *', 'error');
                dispatch(startSetEmergenciaFormData({}));
                return;
            }

            addPaciente = {
                ...paciente,
                nombres: emergenciaFormData.nombres,
                cedula: parseInt(cedula),
                sexo: emergenciaFormData.sexo,
                fechanac: emergenciaFormData.fechanac || null,
                lugarnac: emergenciaFormData.lugarnac || '',
                estadoCivil: emergenciaFormData.estadoCivil || '',
                email: emergenciaFormData.email || '',
                contacto: emergenciaFormData.contacto || '',
                tipo_sangre: emergenciaFormData.tipo_sangre || '',

            };
        }

        Swal.fire({
            title: "Generar Ingreso",
            text: `Estas a punto de registrar el ingreso de este paciente lo que generara una nueva historia clínica en estado de espera hasta que un médico la abra formalmente`,
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Registrar",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                await dispatch(startAddPatient(addPaciente));
                await createNewHistory();
                setLoading(false);
                dispatch(startSetNormalFormData({}));
                dispatch(startSetEmergenciaFormData({}));
                dispatch(startSetPatient({}));
                // dispatch(startSetNuevaHistoria({}));
                setBusquedaCedula(false);

                Swal.fire({
                    title: "¡Ingresado!",
                    text: `El paciente con numero de cédula ${cedula} ha sido ingresado correctamente.`,
                    icon: "success"
                });

            }
        });
    };

    const createNewHistory = async () => {
        const generateCurrentDate = () => {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const fechaActual = generateCurrentDate();

        if (tipoAdmision === 'normal') {
            // Leer el archivo .xlsx
            const fileName = `/formsExcelTemplates/Admisión - AltaEgreso.xlsx`;
            const response = await fetch(fileName);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });

            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            worksheet['C4'] = { v: normalFormData.nombres, t: 's' };
            worksheet['C5'] = { v: cedula, t: 's' };
            worksheet['C6'] = { v: normalFormData.estadoCivil || '', t: 's' };
            worksheet['C7'] = { v: normalFormData.sexo, t: 's' };
            worksheet['C8'] = { v: normalFormData.fechanac || '', t: 's' };
            worksheet['C9'] = { v: normalFormData.lugarnac || '', t: 's' };
            worksheet['C10'] = { v: normalFormData.tipo_sangre || '', t: 's' };
            worksheet['C11'] = { v: normalFormData.email || '', t: 's' };
            worksheet['C12'] = { v: normalFormData.contacto || '', t: 's' };
            worksheet['C13'] = { v: normalFormData.fecha_admision || '', t: 's' };
            worksheet['C14'] = { v: normalFormData.motivo_ingreso || '', t: 's' };
            worksheet['C15'] = { v: normalFormData.diagnostico_presunt || '', t: 's' };

            // Establecer el ancho de las columnas
            worksheet['!cols'] = [
                { wch: 275 / 7.5 },
                { wch: 275 / 7.5 },
                { wch: 275 / 7.5 },
            ];

            const base64String = XLSX.write(workbook, { bookType: 'xlsx', type: 'base64' });

            const newHistory = {
                archivo: '',
                fechacreacion: fechaActual,
                fecha_ult_mod: fechaActual,
                nroforms: 1,
                estado: 'enEspera',
                paciente: parseInt(cedula),
            };

            const historiaId = await dispatch(startAddHistory(newHistory));
            console.log(historiaId);
            const ingresoForm = {
                nombre: 'Admisión - AltaEgreso.xlsx',
                autor: resp.user.nombres,
                fechacreacion: fechaActual,
                fecha_ult_mod: fechaActual,
                archivo: base64String,
                historia_id: historiaId,
            };

            // console.log(ingresoForm);
            await dispatch(startAddForm(ingresoForm));


        } else {
            const newHistory = {
                archivo: '',
                fechacreacion: fechaActual,
                fecha_ult_mod: fechaActual,
                nroforms: 1,
                estado: 'enEspera',
                paciente: parseInt(cedula),
            };

            const historiaId = await dispatch(startAddHistory(newHistory));
            console.log(historiaId);

            const fileName = `/formsExcelTemplates/Emergencia.xlsx`;
            const response = await fetch(fileName);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const arrayBuffer = await response.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });

            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            worksheet['C5'] = { v: emergenciaFormData.nombres, t: 's' };
            worksheet['C6'] = { v: historiaId.toString(), t: 's' };
            worksheet['C7'] = { v: emergenciaFormData.fecha_ingreso || '', t: 's' };
            worksheet['C8'] = { v: cedula, t: 's' };
            worksheet['C9'] = { v: emergenciaFormData.tipo_sangre || '', t: 's' };
            worksheet['C10'] = { v: emergenciaFormData.presion_arterial || '', t: 's' };
            worksheet['C11'] = { v: emergenciaFormData.frecuencia_cardiaca || '', t: 's' };
            worksheet['C12'] = { v: emergenciaFormData.frecuencia_respiratoria || '', t: 's' };
            worksheet['C13'] = { v: emergenciaFormData.temperatura || '', t: 's' };
            worksheet['C14'] = { v: emergenciaFormData.peso || '', t: 's' };
            worksheet['C15'] = { v: emergenciaFormData.talla || '', t: 's' };
            worksheet['C16'] = { v: emergenciaFormData.diagnostico_presunt || '', t: 's' };
            worksheet['C17'] = { v: emergenciaFormData.diagnostico_definitivo || '', t: 's' };
            worksheet['C18'] = { v: emergenciaFormData.medicamentos || '', t: 's' };
            worksheet['C19'] = { v: emergenciaFormData.procedimientos || '', t: 's' };

            // Establecer el ancho de las columnas
            worksheet['!cols'] = [
                { wch: 275 / 7.5 },
                { wch: 275 / 7.5 },
                { wch: 275 / 7.5 },
            ];

            const base64String = XLSX.write(workbook, { bookType: 'xlsx', type: 'base64' });

            const ingresoForm = {
                nombre: 'Emergencia.xlsx',
                autor: resp.user.nombres,
                fechacreacion: fechaActual,
                fecha_ult_mod: fechaActual,
                archivo: base64String,
                historia_id: historiaId,
            };

            await dispatch(startAddForm(ingresoForm));
        }
    };

    return (
        <Box>
            <ThemeProvider theme={theme}>
                {/* Background Shapes */}
                <div className="background-shapes">
                    <div className="shape-1"></div>
                    <div className="shape-2"></div>
                    <div className="shape-3"></div>
                </div>
                <StyledContainer>
                    <Tooltip title="Cerrar Sesión" placement="left">
                        <IconButton
                            onClick={handleLogout}
                            sx={{
                                zIndex: '10',
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

                    <LoadingModal
                        open={loading}
                        onClose={() => setLoading(false)}
                    />

                    <PageTransition>
                        <Box textAlign="center" mb={4}>
                            <Typography variant="h4" component="h1" gutterBottom color="primary" sx={{ fontWeight: 'bold' }}>
                                Ingreso Prehospitalario
                            </Typography>
                            <Typography variant="subtitle1" gutterBottom color="textSecondary">
                                Realiza el ingreso prehospitalario del paciente al sistema clínico
                            </Typography>
                        </Box>
                    </PageTransition>
                    <PageTransition>
                        <div className="radio-input">
                            <label>
                                <input
                                    value="normal"
                                    name="value-radio"
                                    id="value-1"
                                    type="radio"
                                    checked={tipoAdmision === 'normal'}
                                    onChange={() => handleTipoAdmisionChange('normal')}
                                    style={{ fontWeight: 'normal' }}
                                />
                                <span>Admisión Normal</span>
                            </label>
                            <label>
                                <input
                                    value="emergencia"
                                    name="value-radio"
                                    id="value-2"
                                    type="radio"
                                    checked={tipoAdmision === 'emergencia'}
                                    onChange={() => handleTipoAdmisionChange('emergencia')}
                                    style={{ fontWeight: 'normal' }}
                                />
                                <span>Admisión Emergencia</span>
                            </label>
                            <span className="selection"></span>
                        </div>
                    </PageTransition>
                    <Box mt={3} textAlign='center' component='form' >
        
                            <input required placeholder="Nro de cédula del paciente" disabled={busquedaCedula === true} type="text" className="input" name="cedula" value={cedula} onChange={onInputChange} />
                            <Button
                                variant='text'
                                onClick={handleSearchCedula}
                                sx={{
                                    ml: { xs: '0', sm: '10px' },
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    fontSize: '16px',
                                    borderRadius: '5px',
                                }}
                            >
                                Buscar
                            </Button>
                        <IconButton onClick={handleReset} >
                            <RestartAlt />
                        </IconButton>
                    </Box>
                    <Box mt={3}
                        display={(isNewPatient === false || !busquedaCedula) && 'none'}
                        className='animate__animated animate__fadeIn animate__slow'
                    >
                        <Alert severity="info">No se ha encontrado ese usuario, si continúa se creara un nuevo registro en el sistema.</Alert>
                    </Box>
                    <Slide direction="up" in={tipoAdmision !== null} mountOnEnter unmountOnExit>
                        <Box mt={4} className='animate__animated animate__fadeIn' sx={{
                            padding: '26px',
                            bgcolor: 'white',
                            boxShadow: '0 0 20px 10px #ededed',
                            borderRadius: 8,
                            display: (!busquedaCedula) && 'none'
                        }} >
                            {tipoAdmision === 'normal' ? <AdmisionNormal /> : <AdmisionEmergencia />}
                        </Box>
                    </Slide>
                    <PageTransition>
                        <Box mt={4}>
                            <StyledButton
                                variant="contained"
                                color="primary"
                                size="large"
                                sx={{
                                    display: (!busquedaCedula) && 'none',
                                }}
                                onClick={handleRegistro}
                            >
                                REGISTRAR INGRESO
                            </StyledButton>
                        </Box>
                    </PageTransition>
                </StyledContainer>
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

            </ThemeProvider>
        </Box>
    );
}