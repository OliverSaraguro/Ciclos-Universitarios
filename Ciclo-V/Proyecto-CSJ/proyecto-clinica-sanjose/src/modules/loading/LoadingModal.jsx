import React from 'react';
import {
  Modal,
  Box,
  CircularProgress
} from '@mui/material';

const LoadingModal = ({ open, onClose }) => {
  return (
    <Modal
      open={open}
      onClose={(event, reason) => {
        // Evitar cierre al hacer clic fuera (backdrop)
        if (reason !== 'backdropClick') {
          onClose(event, reason); // Llamamos a onClose solo si no es un clic en el fondo
        }
      }}
      disableEscapeKeyDown // Desactiva el cierre con la tecla Escape
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: (theme) => theme.zIndex.modal + 1,
      }}
    >
      <Box
        sx={{
          width: 150,
          height: 150,
          backgroundColor: '#e8e8e8',
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 24,
          outline: 'none',
        }}
      >
        {/* <CircularProgress /> */}
        <div className="line-wobble"></div>
      </Box>
    </Modal>
  );
};

export default LoadingModal;
