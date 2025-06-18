import React from "react";
import {
  Paper,
  Typography,
  Divider,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import { Download } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { startSetActiveForm } from "../store/thunks";

const FormularioCard = ({ nombre, autor, fecha_ult_mod, fecha_creacion, archivo }) => {


  const { resp, activeHistory } = useSelector((state) => state.history);
  const { resp: authResp } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isSpecial = [
    "admisión - altaegreso.xlsx",
    "tratamiento médico.xlsx",
    "epicrisis.xlsx",
    "anamnesis.xlsx",
    "emergencia.xlsx",
  ].includes(nombre.toLowerCase());

  const getSpecialColor = () => {
    switch (nombre.toLowerCase()) {
      case "admisión - altaegreso.xlsx":
        return "#4caf50";
      case "tratamiento médico.xlsx":
        return "#2196f3";
      case "epicrisis.xlsx":
        return "#ff9800";
      case "anamnesis.xlsx":
        return "#4232a8";
      case "emergencia.xlsx":
        return "#b51919";
      default:
        return "#ffffff";
    }
  };

  const handleDownload = () => {

    // Decodificar Base64
    const binaryString = atob(archivo);

    // Convertir a un Blob
    const byteArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Descargar el archivo
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resp.patient.cedula}_${resp.patient.nombres.replace(/\s+/g, '')}_${nombre}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const handleView = () => {

    dispatch(startSetActiveForm({ nombre, autor, fecha_ult_mod, fecha_creacion, archivo }));

    if (activeHistory.estado === "cerrada-editable" || activeHistory.estado === "abierta" && authResp.user.rol === "doctor") {
      navigate("formulario", {
        state: { accion: "editar", tipo: nombre.replace(".xlsx", "") },
      });
      return;

    }

    navigate("formulario", {
      state: { accion: "ver", tipo: nombre },
    });
  }

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 3,
        borderRadius: "0 0 8px 8px",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: isSpecial
            ? `0 8px 16px ${getSpecialColor()}44`
            : "0 8px 16px rgba(0,0,0,0.1)",
        },
        "&::before": isSpecial
          ? {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            backgroundColor: getSpecialColor(),
          }
          : {},
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          width: "30px",
          height: "50px",
          backgroundColor: "#f5f5f5",
          transform: "rotate(45deg) translate(21px, -21px)",
          boxShadow: "-1px 1px 1px rgba(0,0,0,0.1)",
        },
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", color: "#004d40", mb: 2 }}
      >
        {nombre}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ color: "#00695c", mb: 1 }}>
          <strong>Fecha de creación:</strong> {fecha_creacion}
        </Typography>
        <Typography variant="body2" sx={{ color: "#00695c", mb: 1 }}>
          <strong>Última modificación:</strong> {fecha_ult_mod}
        </Typography>
        <Typography variant="body2" sx={{ color: "#00695c" }}>
          <strong>Autor:</strong> {autor}
        </Typography>
      </Box>

      <Box
        sx={{
          height: "40px",
        }}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <IconButton
          onClick={handleDownload}
          size="small"
          sx={{
            mr: "7px",
            color: "inherit",
          }}
        >
          <Download />
        </IconButton>

        <Button
          size="small"
          variant="contained"
          onClick={handleView}
          sx={{
            borderRadius: "7px",
            textTransform: "capitalize",
            backgroundColor: "#004d40",
            "&:hover": {
              backgroundColor: "#00695c",
            },
          }}
        >
          Visualizar
        </Button>
      </Box>
    </Paper>
  );
};

export default FormularioCard;
