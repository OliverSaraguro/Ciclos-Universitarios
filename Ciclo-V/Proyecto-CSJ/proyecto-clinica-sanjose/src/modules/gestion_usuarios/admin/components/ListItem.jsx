import React, { useEffect, useState } from 'react';
import { TableRow, TableCell, IconButton, Button, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { startDeleteRegister, startSetActiveRegister } from '../../store/admin/thunks';
import Swal from 'sweetalert2';
import { Edit } from '@mui/icons-material';
import UserEditModal from './UserEditModal';
import UserEditForm from './UserEditForm';
import LoadingModal from '../../../loading/LoadingModal';

export const ListItem = ({ nombres, especialidad = '', cedula, contacto = '', user, email = '', registro = '', tipo_sangre = '', edad = '', fechanac = '', sexo = '' }) => {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resp } = useSelector(state => state.admin);

  const handleSelectItem = () => {
    dispatch(startSetActiveRegister(user));
    setOpenModal(true);
  }

  const handleCloseModal = (close) => {
    if (close) {
      setOpenModal(false);
    }
  }

  const handleDeleteItem = () => {
    Swal.fire({
      title: "Eliminar Registro",
      text: "Estas a punto de eliminar permanentemente el registro de la base de datos, esta acción no se puede revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ELIMINAR",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        await dispatch(startDeleteRegister(cedula));
        setLoading(false);
      }
    });
  }

  const handleDownloadRegister = () => {
    // Decodificar Base64
    const binaryString = atob(registro);

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
    link.download = `Registro_Senescyt_${nombres.replace(/\s+/g, '')}_${cedula}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <>
      <LoadingModal
        open={loading}
        onClose={() => setLoading(false)}
      />
      <TableRow className='animate__animated animate__fadeIn animate__slow'>
        <TableCell>{nombres}</TableCell>
        {(especialidad !== '') && (<TableCell>{especialidad}</TableCell>)}
        {(tipo_sangre !== '' || resp.type === 'patients') && (<TableCell>{tipo_sangre || 'Sin info'}</TableCell>)}
        {(edad !== '' || resp.type === 'patients') && (<TableCell>{edad || 'Sin info'}</TableCell>)}
        {(fechanac !== '' || resp.type === 'patients') && (<TableCell>{fechanac || 'Sin info'}</TableCell>)}
        <TableCell>{cedula}</TableCell>
        {(email !== '' || resp.type === 'patients') && <TableCell>{email || 'Sin info'}</TableCell>}
        {(contacto !== '' || resp.type === 'patients') && (<TableCell>{contacto || 'Sin info'}</TableCell>)}
        {(sexo !== '' || resp.type === 'patients') && (<TableCell>{sexo || 'Sin info'}</TableCell>)}
        {
          (registro !== '') &&
          <TableCell>
            <Button
              variant='outlined'
              sx={{
                color: '#25803e',
                borderColor: '#25803e'
              }}
              onClick={handleDownloadRegister}
            >
              Descargar
            </Button>
          </TableCell>
        }

        <TableCell>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Tooltip title="Editar datos" placement='top'>
              <IconButton
                size="small"
                color="primary"
                onClick={handleSelectItem}
              >
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar usuario" placement='top'>
              <IconButton
                size="small"
                color="error"
                onClick={handleDeleteItem}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        </TableCell>

      </TableRow>
      <UserEditModal
        open={openModal}
        onClose={handleCloseModal}
        title={`Editar Usuario: ${nombres}`}
      >
        <UserEditForm onClose={handleCloseModal} />
      </UserEditModal>
    </>
  );
};

