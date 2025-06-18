import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid2,
  Divider,
  Skeleton,
  Tooltip,
  IconButton,
  Pagination,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { PacienteCard } from "../../enfermeria/components/PacienteCard";
import { FilterPacientes } from "../../medico/components/FilterPacientes";
import { useDispatch, useSelector } from "react-redux";
import { Logout } from "@mui/icons-material";
import { startLogout } from "../../../auth/store/auth/thunks";
import { startLoadingPats, startLogoutApp } from "../../store/enfermeria/thunks";

export const PacientesPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md")); 

  useEffect( () => {
    dispatch(startLoadingPats());
  }, []);

  const { resp, isLoading, activeRegister } = useSelector((state) => state.enfermeria);
  const [filteredList, setFilteredList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = isMdUp ? 20 : 5; // Cambiar dinámicamente según el tamaño de la pantalla

  useEffect(() => {
    if (resp.results) {
      setFilteredList(resp.results);
      setCurrentPage(1); // Reiniciar a la primera página cuando cambia la lista
    }
  }, [resp.results]);

  const originalData = resp.results || [];

  const handleFilter = (filters) => {
    const { cedula, nombre, fechain, fechafin, sexo, edad, tipo_sangre } = filters;

    const filtered = originalData.filter((item) => {
      const itemDate = new Date(item.ult_adm);
      const startDate = fechain ? new Date(fechain) : null;
      const endDate = fechafin ? new Date(fechafin) : null;

      const matchesCedula = cedula ? item.cedula.includes(cedula) : true;
      const matchesNombre = nombre ? item.nombres.toLowerCase().includes(nombre.toLowerCase()) : true;
      const matchesSexo = sexo ? item.sexo === sexo : true;
      const matchesEdad = edad ? parseInt(item.edad, 10) === parseInt(edad, 10) : true;
      const matchesTipoSangre = tipo_sangre ? item.tipo_sangre.toLowerCase().includes(tipo_sangre.toLowerCase()) : true;
      const matchesStartDate = startDate ? itemDate >= startDate : true;
      const matchesEndDate = endDate ? itemDate <= endDate : true;

      return matchesCedula && matchesNombre && matchesSexo && matchesEdad && matchesTipoSangre && matchesStartDate && matchesEndDate;
    });

    setFilteredList(filtered);
    setCurrentPage(1); // Reiniciar a la primera página al filtrar
  };

  const handleLogout = () => {
    dispatch(startLogoutApp());
    dispatch(startLogout());
  };

  // Calcular los elementos actuales para la página
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  const renderCards = () =>
    currentItems.map((paciente) => (
      <Grid2 item xs={12} sm={6} md={4} key={paciente.id} className="animate__animated animate__fadeIn">
        <PacienteCard paciente={paciente} />
      </Grid2>
    ));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-50px',
          left: '-50px',
          width: '200px',
          height: '200px',
          backgroundColor: 'rgba(0, 77, 64, 0.1)',
          borderRadius: '50%',
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-50px',
          right: '-50px',
          width: '300px',
          height: '300px',
          backgroundColor: 'rgba(0, 105, 92, 0.1)',
          borderRadius: '50%',
          zIndex: 0,
        }
      }}
    >
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Box py={4}>
          <Typography variant="h2" sx={{ mb: 1, fontWeight: "bold", color: "#004d40" }}>
            Pacientes Registrados en la Clínica
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4, color: "#00695c" }}>
            Escoge el paciente o búscalo por su número de cédula
          </Typography>

          <Divider sx={{ mb: 4 }} />

          <Grid2 container spacing={3}>
            <Grid2 item size={{ xs: 12, md: 9 }}>
              {isLoading ? (
                <Box sx={{ my: 4 }} spacing={3}>
                  {[...Array(4)].map((_, index) => (
                    <Grid2 item xs={12} sm={6} md={4} key={index} m="10px">
                      <Skeleton variant="rectangular" width="100%" height={200} />
                    </Grid2>
                  ))}
                </Box>
              ) : !resp.ok ? (
                <Box sx={{ my: 4 }}>
                  Error al cargar los pacientes. Intente nuevamente. {resp.results}
                </Box>
              ) : (
                <>
                  <Grid2 container spacing={3}>
                    {renderCards()}
                  </Grid2>
                  <Box mt={4} display="flex" justifyContent="center">
                    <Pagination
                      count={Math.ceil(filteredList.length / itemsPerPage)}
                      page={currentPage}
                      onChange={(_, value) => setCurrentPage(value)}
                    />
                  </Box>
                </>
              )}
            </Grid2>

            <Grid2
              item
              size={{ xs: 12, md: 3 }}
              className="animate__animated animate__slideInRight"
            >
              <Box sx={{ position: "sticky", top: "20px" }}>
                <FilterPacientes onFilter={handleFilter} />
              </Box>
            </Grid2>

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
          </Grid2>
        </Box>
      </Container>
    </Box>
  );
};
