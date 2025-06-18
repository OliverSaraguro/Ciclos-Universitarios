import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Grid2,
  Fab,
  Chip,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import BuildIcon from "@mui/icons-material/Build";
import GetAppIcon from "@mui/icons-material/GetApp";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import FormularioCard from "../components/FormularioCard";
import FilterForms from "../components/FilterForms";
import { FileOpen } from "@mui/icons-material";
import { useSelector } from "react-redux";
import FormTypeModal from "../components/FormTypeModal";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { startUpdateHistory } from "../store/thunks";
import { useDispatch } from "react-redux";
import JSZip from "jszip";

export const HistoriaPage = () => {
  const { activeHistory, resp } = useSelector((state) => state.history);
  const { resp: authResp } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const history = activeHistory;
  const [openSpeedDial, setOpenSpeedDial] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "abierta":
        return "success";
      case "enEspera":
        return "default";
      case "cerrada":
        return "primary";
      case "cerrada-editable":
        return "error";
      default:
        return "default";
    }
  };




  // MANEJO DE FILTRADO
  const [filteredList, setFilteredList] = useState(history.formularios);

  useEffect(() => {
    setFilteredList(history.formularios);

  }, [history.formularios]); // El efecto se ejecuta cuando history.formularios cambie



  const handleFilter = (tipo, ordenarpor, fechain, fechafin, autor) => {
    const filtered = history.formularios.filter((item) => {
      // Convierte parámetros a tipos adecuados
      const itemDate = new Date(item.fecha_creacion);
      const startDate = fechain ? new Date(fechain) : null;
      const endDate = fechafin ? new Date(fechafin) : null;

      // Banderas para cada condición de filtro
      const matchesTipo = tipo ? item.nombre === tipo : true;
      const matchesAutor = autor
        ? item.autor.trim().toLowerCase().includes(autor.trim().toLowerCase())
        : true;
      const matchesFechaIn = startDate ? itemDate >= startDate : true;
      const matchesFechaFin = endDate ? itemDate <= endDate : true;

      // Verifica que al menos un filtro coincida
      return (
        (tipo ? matchesTipo : true) &&
        (autor ? matchesAutor : true) &&
        (fechain ? matchesFechaIn : true) &&
        (fechafin ? matchesFechaFin : true)
      );
    });

    // Ordenamiento opcional
    const sortedFiltered = ordenarpor
      ? [...filtered].sort((a, b) => {
        const dateA = new Date(a.fecha_creacion);
        const dateB = new Date(b.fecha_creacion);
        return ordenarpor === "asc" ? dateA - dateB : dateB - dateA;
      })
      : filtered;

    setFilteredList(sortedFiltered);
  };

  const renderFormularios = (tipo) => {
    return filteredList
      .filter((form) =>
        tipo === "esenciales"
          ? [
            "Admisión - AltaEgreso.xlsx",
            "Tratamiento médico.xlsx",
            "Epicrisis.xlsx",
            "Anamnesis.xlsx",
            "Emergencia.xlsx",
          ].includes(form.nombre)
          : ![
            "Admisión - AltaEgreso.xlsx",
            "Tratamiento médico.xlsx",
            "Epicrisis.xlsx",
            "Anamnesis.xlsx",
            "Emergencia.xlsx",
          ].includes(form.nombre)
      )
      .map((form, index) => (
        <Grid2
          item
          size={{ xs: 12, sm: 6, md: 4 }}
          key={index}
          className="animate__animated animate__fadeIn"
        >
          <FormularioCard {...form} />
        </Grid2>
      ));
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setOpenSpeedDial(false);
  };

  // CREAR Formularios
  const handleCreateForm = (formType) => {
    navigate("formulario", {
      state: { accion: "crear", tipo: formType },
    }); // Redirige a la ruta con parámetros opcionales en state
  };

  // ABRIR formalmnete la Historia
  const handleOpenHistory = () => {
    const hasOpenHistory = resp.histories.some(
      (history) => history.estado === "abierta"
    );

    if (hasOpenHistory) {
      Swal.fire({
        title: "Error",
        text: "No puede existir más de una historia abierta a la vez por cada usuario",
        icon: "warning",
      });
      return;
    }

    // Generar fecha en formato yyyy-mm-dd 
    const getFormattedDate = () => {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      return date.toISOString().split("T")[0];
    };

    // Historia actualizada
    const history = {
      ...activeHistory,
      estado: "abierta",
      fecha_ult_mod: getFormattedDate(),
    };

    Swal.fire({
      title: "Abrir Historia",
      text: "Estas a punto de abrir la historia clínica, esto te redigirá automáticamente a llenar el formulario AMNANESIS",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Abrir",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "¡Abierta!",
          text: "La historia clínica se ha abierto formalmente",
          icon: "success",
        });

        // Llamar al thunk para actualizar el store
        dispatch(startUpdateHistory(history));

        navigate("formulario", {
          state: { accion: "crear", tipo: "Anamnesis" },
        });
      }
    });
  };

  // CERRAR formalmente la Historia
  const handleCloseHistory = () => {
    // Verificar si la historia activa tiene el formulario 'Epicrisis.xlxs'
    const hasEpicrisisForm = activeHistory?.formularios?.some(
      (formulario) => formulario.nombre === "Epicrisis.xlsx"
    );

    // Validar si existe activeHistory y contiene el formulario 'Epicrisis.xlxs'
    if (!hasEpicrisisForm) {
      Swal.fire({
        title: "No se puede cerrar la historia",
        text: "La historia no contiene el formulario 'Epicrisis.xlsx'. Por favor, verifica antes de cerrar.",
        icon: "error",
        confirmButtonText: "Entendido",
      });
      return;
    }

    // Generar fecha en formato yyyy-mm-dd 
    const getFormattedDate = () => {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      return date.toISOString().split("T")[0];
    };

    // Historia actualizada
    const history = {
      ...activeHistory,
      estado: "cerrada",
      fecha_ult_mod: getFormattedDate(),
    };

    Swal.fire({
      title: "Cerrar Historia",
      text: "Estás a punto de cerrar la historia clínica. Una vez hecho esto no se podrá volver a abrir, a partir de este momento contarás únicamente con 24hrs para realizar cualquier edición sobre los formularios.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Cerrar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Confirmación de cierre
        Swal.fire({
          title: "¡Cerrada!",
          text: "La historia clínica se ha cerrado formalmente.",
          icon: "success",
        });

        // Llamar al thunk para actualizar el estado en el store
        dispatch(startUpdateHistory(history));
      }
    });
  };

  // DESCARGAR Todos los formularios en una historia
  const handleDownloadAll = () => {
    // Crear una nueva instancia de JSZip
    const zip = new JSZip();

    // Agregar los archivos al ZIP
    activeHistory.formularios.forEach((formulario) => {
      const archivoBinario = atob(formulario.archivo); // Decodificar Base64
      const buffer = new Uint8Array(archivoBinario.length);
      for (let i = 0; i < archivoBinario.length; i++) {
        buffer[i] = archivoBinario.charCodeAt(i);
      }

      // Agregar el archivo al ZIP
      zip.file(`${resp.patient.cedula}_${resp.patient.nombres.replace(/\s+/g, '')}_${formulario.nombre}`, buffer);
    });

    // Generar el archivo ZIP
    zip.generateAsync({ type: "blob" }).then((zipContent) => {
      // Crear un enlace para descargar el archivo ZIP
      const link = document.createElement("a");
      link.href = URL.createObjectURL(zipContent);
      link.download = `HistoriaClinica_${resp.patient.cedula}_${resp.patient.nombres.replace(/\s+/g, '')}.zip`;
      link.click();
    });

    setSnackbarOpen(true); // Abre el Snackbar
  };

  // HABILITAR Edicion
  const handleEdition = () => {
    if (history.estado === "cerrada") {
      // Actualizar el estado a "cerrada-editable"
      const updatedHistory = {
        ...activeHistory,
        estado: "cerrada-editable",
      };

      // Llamar al thunk para actualizar el estado en el store
      dispatch(startUpdateHistory(updatedHistory));

      // Programar cambio de estado a "cerrada" después de 24 horas
      setTimeout(() => {
        // Actualizar nuevamente el estado a "cerrada"
        const revertedHistory = {
          ...activeHistory,
          estado: "cerrada",
        };

        // Llamar al thunk para actualizar el estado a "cerrada"
        dispatch(startUpdateHistory(revertedHistory));
      }, 24 * 60 * 60 * 1000); // 24 horas en milisegundos
    }
  };

  const onSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  const actions = [
    {
      icon: <GetAppIcon />,
      name: "DESCARGAR HISTORIA",
      onClick: handleDownloadAll,
    },
    {
      icon: <FileOpen />,
      name: "ABRIR HISTORIA",
      disabled: ["cerrada", "abierta", "cerrada-editable"].includes(
        history.estado
      ) || authResp.user.rol === "patient" || authResp.user.rol === "nurse",
      onClick: handleOpenHistory, // Llama directamente a una función
    },
    {
      icon: <EditIcon />,
      name: "MODIFICAR HISTORIA",
      disabled:
        ["abierta", "enEspera", "cerrada-editable"].includes(history.estado) ||
        (history.estado === "cerrada" &&
          (() => {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Restablece la hora a 00:00:00.000

            const fechaUltMod = new Date(history.fecha_ult_mod);
            fechaUltMod.setHours(0, 0, 0, 0); // Restablece la hora a 00:00:00.000

            return today > new Date(fechaUltMod.setDate(fechaUltMod.getDate() + 1));
          })()
        ) || authResp.user.rol === "patient" || authResp.user.rol === "nurse",
      onClick: handleEdition,
    },
    {
      icon: <CloseIcon />,
      name: "CERRAR HISTORIA",
      disabled: ["enEspera", "cerrada", "cerrada-editable"].includes(
        history.estado
      ) || authResp.user.rol === "patient" || authResp.user.rol === "nurse",
      onClick: handleCloseHistory,
    },
  ];

  return (
    <>
      <Box sx={{ maxWidth: "1200px", margin: "0 auto" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: "bold", color: "#004d40", mr: 2 }}
          >
            Historia N. {history.id}
          </Typography>
          <Chip
            sx={{ borderRadius: "5px" }}
            label={
              history.estado.charAt(0).toUpperCase() + history.estado.slice(1)
            }
            color={getStatusColor(history.estado)}
          />
        </Box>
        <Typography
          variant="subtitle1"
          align="center"
          fontSize="15px"
          sx={{ color: "#00695c" }}
        >
          <b>Fecha de creación:</b> {history.fechacreacion}
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          fontSize="15px"
          sx={{ mb: 4, color: "#00695c" }}
        >
          <b>Última modificación:</b> {history.fecha_ult_mod}
        </Typography>

        <Grid2 container spacing={3}>
          <Grid2 item size={{ xs: 12, md: 9 }}>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                sx={{ mb: 2, color: "#004d40", fontWeight: "bold" }}
              >
                Esenciales
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid2 container spacing={2}>
                {renderFormularios("esenciales")}
              </Grid2>
            </Box>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                sx={{ mb: 2, color: "#004d40", fontWeight: "bold" }}
              >
                Formularios
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid2 container spacing={2}>
                {renderFormularios("otros")}
              </Grid2>
            </Box>
          </Grid2>

          <Grid2 item size={{ xs: 10, md: 3 }}>
            <Box sx={{ position: "sticky", top: "20px" }}>
              <FilterForms onFilter={handleFilter} />
            </Box>
          </Grid2>
        </Grid2>
      </Box>

      <Tooltip title="NUEVO FORMULARIO" placement="left">
        <Fab
          color="primary"
          aria-label="add"
          disabled={
            history.estado !== "abierta" &&
            history.estado !== "cerrada-editable"
            || authResp.user.rol === "patient" || authResp.user.rol === "nurse"
          }
          onClick={handleOpenModal}
          sx={{
            position: "fixed",
            bottom: 16,
            right: { xs: 11, sm: 30, md: 20, xl: 50 },
            backgroundColor: "#004d40",
            "&:hover": {
              backgroundColor: "#00695c",
            },
          }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

      <SpeedDial
        ariaLabel="Opciones de Historia"
        sx={{
          position: "fixed",
          bottom: 90,
          right: { xs: 11, sm: 30, md: 20, xl: 50 },
        }}
        icon={<SpeedDialIcon icon={<BuildIcon />} />}
        onClose={() => setOpenSpeedDial(false)}
        onOpen={() => setOpenSpeedDial(true)}
        open={openSpeedDial}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => {
              action.onClick?.(); // Llama a la función onClick si está definida
              setOpenSpeedDial(false); // Cierra el SpeedDial después de ejecutar
            }}
            disabled={action.disabled}
          />
        ))}
      </SpeedDial>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={onSnackClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
          onClose={onSnackClose}
        >
          Descargado con éxito.
        </Alert>
      </Snackbar>

      <FormTypeModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateForm}
      />
    </>
  );
};
