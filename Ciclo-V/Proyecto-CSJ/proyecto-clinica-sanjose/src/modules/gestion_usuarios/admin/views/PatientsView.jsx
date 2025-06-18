import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Grid2,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import { startLoadingRegisters } from '../../store/admin/thunks';
import { useNavigate } from 'react-router-dom';
import { ListItem } from '../components/ListItem';
import { FilterRegisters } from '../components/FilterRegisters';

const tableHeaders = [
    { name: 'Nombres' },
    { name: 'Tipo de Sangre' },
    { name: 'Edad' },
    { name: 'Fecha de nacimiento' },
    { name: 'Cedula' },
    { name: 'Email' },
    { name: 'Contacto' },
    { name: 'Sexo' },
];

export const PatientsView = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [users, setusers] = useState([]);
    const [originalusers, setOriginalusers] = useState([]); // Nuevo estado para mantener los datos originales

    const { resp, isLoading, activeRegister } = useSelector(state => state.admin);

    useEffect(() => {
        dispatch(startLoadingRegisters('patients'));
    }, [dispatch]);

    // Actualiza los useres solo cuando resp.results cambia
    useEffect(() => {
        if (resp?.results) {
            setusers(resp.results);
            setOriginalusers(resp.results); // Guarda una copia de los datos originales
        }
    }, [resp.results]);

    /* const handleAdd = () => {
        navigate('crear');
    }; */

    // MANEJO DE FILTRADO
    const handleFilter = ({ cedula, nombres, email, tipo_sangre, fechain, fechafin, edad, contacto, ordenarpor, sexo }) => {
        // Siempre filtra desde los datos originales
        const filtered = originalusers.filter((item) => {

            const itemDate = new Date(item.fechanac);
            const startDate = fechain ? new Date(fechain) : null;
            const endDate = fechafin ? new Date(fechafin) : null;

            // Banderas para cada condición de filtro
            const matchesCedula = cedula
                ? item.cedula.toString().trim().toLowerCase().includes(cedula.trim().toLowerCase())
                : true;
            const matchesSexo = sexo
                ? item.sexo.trim().toLowerCase().includes(sexo.trim().toLowerCase())
                : true;
            const matchesEdad = edad
                ? item.edad.toString().trim().toLowerCase().includes(edad.trim().toLowerCase())
                : true;
            const matchesSangre = tipo_sangre
                ? item.tipo_sangre.trim().toLowerCase().includes(tipo_sangre.trim().toLowerCase())
                : true;
            const matchesContacto = contacto
                ? item.contacto.trim().toLowerCase().includes(contacto.trim().toLowerCase())
                : true;
            const matchesNombres = nombres
                ? item.nombres.trim().toLowerCase().includes(nombres.trim().toLowerCase())
                : true;
            const matchesEmail = email
                ? item.email.trim().toLowerCase().includes(email.trim().toLowerCase())
                : true;
            const matchesStartDate = startDate ? itemDate >= startDate : true;
            const matchesEndDate = endDate ? itemDate <= endDate : true;

            // Verifica que todos los filtros coincidan
            return matchesNombres && matchesEmail && matchesCedula && matchesContacto && matchesSangre && matchesEdad && matchesStartDate && matchesEndDate && matchesSexo;
        });

        // Ordenamiento opcional
        const sortedFiltered = ordenarpor
            ? [...filtered].sort((a, b) => {
                if (ordenarpor === "az") {
                    return a.nombres.localeCompare(b.nombres); // Orden alfabético A-Z
                } else {
                    return b.nombres.localeCompare(a.nombres); // Orden alfabético Z-A
                }
            })
            : filtered;

        setusers(sortedFiltered);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                padding: '16px',
                ml: { xs: '0', sm: '240px' },
                mt: '35px',
                flexDirection: { xs: 'column', xl: 'row' },
                overflowX: 'hidden',
                position: 'relative',
            }}
        >

            {/* Listado */}
            <Paper
                className='animate__animated animate__slideInLeft'
                sx={{
                    width: { xs: '100%', xl: '1250px' },
                    height: '720px',
                    borderRadius: '6px',
                    padding: { xs: '30px 16px', md: '35px 30px' },
                    backgroundColor: '#F8F8F8',
                    boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '0 auto 0 0'
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        height: '100%',
                        overflow: 'auto',
                        scrollbarWidth: 'thin', // Para navegadores como Firefox
                        scrollbarColor: '##9e9e9e #F8F8F8', // Color del scrollbar y del track
                    }}
                >

                    <TableContainer>
                        {isLoading ? (
                            <div class="loader">
                                <section class="dots-container">
                                    <div class="dot"></div>
                                    <div class="dot"></div>
                                    <div class="dot"></div>
                                    <div class="dot"></div>
                                    <div class="dot"></div>
                                </section>
                            </div>
                        ) : (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {tableHeaders.map((header, index) => (
                                            <TableCell
                                                key={index}
                                                align={'left'}
                                            >
                                                <Typography variant="subtitle2" fontWeight="bold">
                                                    {header.name}
                                                </Typography>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {users?.map((user) => (
                                        <ListItem
                                            key={user.cedula}
                                            nombres={user.nombres}
                                            cedula={user.cedula}
                                            contacto={user.contacto}
                                            email={user.email}
                                            tipo_sangre={user.tipo_sangre}
                                            edad={user.edad}
                                            fechanac={user.fechanac}
                                            sexo={user.sexo}
                                            user={user}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </TableContainer>
                </Box>
            </Paper>

            {/* Filtro */}
            <FilterRegisters onFilter={handleFilter} />


            {/* Añadir un nuevo registro */}
            {/* <Box
                sx={{
                    position: 'fixed',
                    bottom: '0',
                    right: '0',
                    mr: '35px',
                    mb: '35px',
                }}
            >
                <IconButton
                    size="large"
                    onClick={handleAdd}
                    sx={{
                        width: '73px',
                        height: '73px',
                        backgroundColor: 'white',
                        boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
                        '&:hover': {
                            backgroundColor: '#f5f5f5',
                        },
                        position: 'fixed',
                        bottom: '25px',
                        right: '25px',
                    }}
                    aria-label="add"
                >
                    <AddIcon fontSize="large" sx={{ color: '#43483A' }} />
                </IconButton>
            </Box> */}
        </Box>
    );
}

