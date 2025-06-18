import React from 'react';
import { Paper, Typography, Box, IconButton } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PersonIcon from '@mui/icons-material/Person';
import OpacityIcon from '@mui/icons-material/Opacity';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ArrowForwardIos } from '@mui/icons-material';
import { MdMedicalInformation } from 'react-icons/md';
import { startSetActiveRegister } from '../../store/medico/thunks';

export const PacienteCard = ({ paciente, disButton = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onClickPaciente = () => {
    dispatch(startSetActiveRegister(paciente));
    navigate(`historia`); // Navigate to patient detail page
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: '320px',
        // height: '250px',
        padding: 3,
        borderRadius: "12px",
        transition: "all 0.3s ease",
        position: 'relative',
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          width: '75px',
          height: '75px',
          borderRadius: '50%',
          backgroundColor: 'black',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '-4px 4px 12px 10px rgba(0,0,0,0.1)',
        }}
      >
        <MdMedicalInformation color='white' size='33px' />
      </Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", color: "#004d40", mb: 2, maxInlineSize: '200px' }}
      >
        {paciente.nombres}
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ color: "#00695c", mb: 1 }}>
          <strong>Cédula:</strong> {paciente.cedula}
        </Typography>
        <Typography variant="body2" sx={{ color: "#00695c", mb: 1 }}>
          <strong>Edad:</strong> {paciente.edad || 'Sin información'}
        </Typography>
        <Typography variant="body2" sx={{ color: "#00695c" }}>
          <strong>Sexo:</strong> {paciente.sexo || 'Sin información'}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", color: "#d32f2f" }}>
          <OpacityIcon fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body2">{paciente.tipo_sangre || 'Sin información'}</Typography>
        </Box>
        <IconButton
          onClick={onClickPaciente}
          disabled={disButton}
          sx={{
            color: "#004d40",
            "&:hover": {
              backgroundColor: "rgba(0, 77, 64, 0.1)",
            },
          }}
        >
          <ArrowForwardIos />
        </IconButton>
      </Box>
    </Paper>
  );
};

