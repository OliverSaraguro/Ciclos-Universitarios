import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  useTheme,
  Grid2,
  Divider,
  Skeleton,
  Fab,
  Tooltip,
  Modal,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { PacienteCard } from "../components/PacienteCard";
import { FilterPacientes } from "../components/FilterPacientes";
import { useDispatch, useSelector } from "react-redux";
import { startAddDoctorPat, startLoadingDoctorPats, startLogoutApp, startSearchPat, startSetActiveRegister } from "../../store/medico/thunks";
import { Add, Logout } from "@mui/icons-material";
import { useForm } from "../../../../hooks/useForm";
import Swal from "sweetalert2";
import { startLogout } from "../../../auth/store/auth/thunks";
import LoadingModal from "../../../loading/LoadingModal";

const initForm = {
  cedula: "",
}

export const PacientesPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startLoadingDoctorPats());
  }, []);

  const { resp, isLoading, activeRegister } = useSelector((state) => state.medico);

  const { onInputChange, onResetForm, cedula } = useForm(initForm);
  const [filteredList, setFilteredList] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpenModal = () => {
    dispatch(startSetActiveRegister({}));
    setOpenModal(true)
  };
  const handleCloseModal = () => setOpenModal(false);

  useEffect(() => {
    if (resp.results) {
      setFilteredList(resp.results);
    }
  }, [resp.results]);

  const originalData = resp.results || [];


  const handleFilter = (filters) => {
    const { cedula, nombre, sexo, edad, tipo_sangre } = filters;

    const filtered = originalData.filter((item) => {

      const matchesCedula = cedula ? item.cedula.toString().includes(cedula) : true;
      const matchesNombre = nombre ? item.nombres.toLowerCase().includes(nombre.toLowerCase()) : true;
      const matchesSexo = sexo ? item.sexo === sexo : true;
      const matchesEdad = edad ? parseInt(item.edad, 10) === parseInt(edad, 10) : true;
      const matchesTipoSangre = tipo_sangre ? item.tipo_sangre.toLowerCase().includes(tipo_sangre.toLowerCase()) : true;

      return matchesCedula && matchesNombre && matchesSexo && matchesEdad && matchesTipoSangre;
    });

    setFilteredList(filtered);
  };

  const handleSearchPat = async (event) => {
    event.preventDefault();
    setLoading(true);
    await dispatch(startSearchPat(cedula || 0));
    setLoading(false);
    onResetForm();
  }

  const handleAddPat = () => {

    setOpenModal(false);

    Swal.fire({
      title: "Asignar Paciente",
      text: `Estas a punto de asignarte el paciente con número de cedula ${activeRegister.cedula}, esta acción NO se puede revertir`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Asignar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        // Llamar al thunk para actualizar el store
        await dispatch(startAddDoctorPat());
        setLoading(false);

        // Limpiamos el activeRegister
        dispatch(startSetActiveRegister({}));

      } else {
        // Limpiamos el activeRegister
        dispatch(startSetActiveRegister({}));
      }
    });
  };

  const handleLogout = () => {
    dispatch(startLogoutApp());
    dispatch(startLogout());
  }

  const renderCards = () =>
    filteredList
      .map((paciente) => (
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
            Pacientes Registrados
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 4, color: "#00695c" }}>
            Escoge tu paciente o búscalo por su número de cédula
          </Typography>

          <Divider sx={{ mb: 4 }} />

          <Grid2 container spacing={3}>
            <Grid2 item size={{ xs: 12, md: 9 }}>
              <Typography variant="h5" sx={{ mb: 2, color: "#004d40", fontWeight: "bold" }}>
                Mis Pacientes
              </Typography>
              {
                isLoading ? (
                  <Box sx={{ my: 4 }} spacing={3} >
                    {[...Array(4)].map((_, index) => (
                      <Grid2 item xs={12} sm={6} md={4} key={index} m='10px' >
                        <Skeleton variant="rectangular" width="100%" height={200} />
                      </Grid2>
                    ))}
                  </Box>
                ) : !resp.ok ? (
                  <Box sx={{ my: 4 }}>
                    Error al cargar los pacientes. Intente nuevamente. {resp.results}
                  </Box>
                ) : (
                  <Grid2 container spacing={3}>
                    {renderCards()}
                  </Grid2>
                )
              }
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

            <Tooltip title="AÑADIR PACIENTE" placement="right">
              <Fab
                color="primary"
                aria-label="add"
                disabled={isLoading}
                onClick={handleOpenModal}
                sx={{
                  position: "fixed",
                  bottom: 25,
                  left: 25,
                  backgroundColor: "#004d40",
                  "&:hover": {
                    backgroundColor: "#00695c",
                  },
                }}
              >
                <Add />
              </Fab>
            </Tooltip>

            <Tooltip title="Cerrar Sesión" placement="left">
              <IconButton
                onClick={handleLogout}
                sx={{
                  backgroundColor: 'white',
                  boxShadow: '0 2px 2px 2px rgb(219, 219, 219)',
                  position: "fixed",
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

      <LoadingModal
        open={loading}
        onClose={() => setLoading(false)}
      />

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        disableEnforceFocus
        sx={{
          backdropFilter: "blur(10px)",
          zIndex: (theme) => theme.zIndex.modal
        }}
      >
        <Box
          component='form'
          onSubmit={handleSearchPat}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: 400, md: 600 },
            height: { xs: 600, md: 500 },
            bgcolor: 'background.paper',
            borderRadius: '10px',
            boxShadow: 24,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" component="h4" fontWeight='bold' align="center" sx={{ color: '#004d40' }}>
            Añadir Paciente
          </Typography>
          <Typography variant="subtitle1" align="center" sx={{ mt: 1, mb: 1 }}>
            Ingresa el número de cédula del paciente que deseas asignarte.
          </Typography>

          <Box
            display="flex"
            justifyContent='center'
            alignItems='end'
            gap={3}
          >
            <TextField
              label="Buscar por cédula"
              variant="standard"
              color="#004d40"
              type="number"
              name="cedula"
              value={cedula}
              onChange={onInputChange}
              fullWidth
              sx={{
                mt: 2,
                width: { xs: '240px', md: '300px' },
                display: 'flex',
              }}
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                color: "white",
                display: "flex",
                justifySelf: "end",
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
              Buscar
            </Button>
          </Box>

          {
            (activeRegister === 'Error, no se ha encontrado ese paciente')
              ?
              <Box mt={10} sx={{ backgroundColor: '#e0e0e0', width: '450px', height: '60px', display: 'flex', alignItems: 'center', px: 2, textAlign: 'left', color: 'error.main' }} >
                {activeRegister}
              </Box>
              : (Object.keys(activeRegister).length === 0) ?
                <Box mt={10} sx={{ backgroundColor: '#e0e0e0', width: { xs: '350px', md: '450px' }, height: '60px', display: 'flex', alignItems: 'center', px: 2, textAlign: 'left', color: '#595959' }} >
                  Busca un paciente para empezar
                </Box> :
                <Box mt={5} >
                  <PacienteCard paciente={activeRegister} disButton={true} />
                </Box>
          }


          <Button
            variant="contained"
            onClick={handleAddPat}
            disabled={activeRegister === 'Error, no se ha encontrado ese paciente' || Object.keys(activeRegister).length === 0}
            sx={{
              color: "white",
              display: "flex",
              position: 'fixed',
              bottom: 25,
              right: 25,
              textTransform: "capitalize",
              borderRadius: "5px",
              borderColor: "black",
              backgroundColor: "#24284C",
              "&:hover": {
                backgroundColor: "red",
                borderColor: "black",
              },
            }}
          >
            Agregar
          </Button>
        </Box>
      </Modal>

    </Box>
  );
};