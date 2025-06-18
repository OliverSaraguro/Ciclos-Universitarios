import React, { useEffect } from 'react';
import { Grid2, TextField, MenuItem, Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from '../../../hooks/useForm';
import { startSetNormalFormData } from '../store/thunks';

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    transition: 'all 0.3s ease-in-out',
    '& fieldset': {
      borderColor: 'rgba(46, 125, 50, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

export default function AdmisionNormal() {

  const dispatch = useDispatch();
  const { paciente } = useSelector(state => state.prehospitalario);
  const { nombres, estadoCivil, sexo, fechanac, lugarnac, email, contacto, tipo_sangre, onInputChange, fecha_admision, motivo_ingreso, diagnostico_presunt, formState } = useForm(paciente);

  const handleBlur = () => {
    dispatch(startSetNormalFormData(formState));
  };


  return (
    <Grid2 container spacing={2}>
      <Box>
        <Typography textAlign='left' fontSize='15px' color='#bc3232' >* Campos obligatorios</Typography>
      </Box>

      <Grid2 item size={{ xs: 12 }}>
        <StyledTextField
          label="Nombre completo"
          required
          fullWidth
          name='nombres'
          disabled={paciente.nombres !== '' && paciente.nombres !== null}
          value={nombres || ''}
          onChange={onInputChange}
          onBlur={handleBlur}
        />
      </Grid2>
      <Grid2 item size={{ xs: 12, sm: 6 }}>
        <StyledTextField
          select
          label="Estado civil"
          fullWidth
          name='estadoCivil'
          disabled={paciente.estadoCivil !== '' && paciente.estadoCivil !== null}
          value={estadoCivil || ''}
          onBlur={handleBlur} 
          onChange={onInputChange}
        >
          <MenuItem value="Soltero/a">Soltero/a</MenuItem>
          <MenuItem value="Casado/a">Casado/a</MenuItem>
          <MenuItem value="Divorciado/a">Divorciado/a</MenuItem>
          <MenuItem value="Viudo/a">Viudo/a</MenuItem>
        </StyledTextField>
      </Grid2>
      <Grid2 item size={{ xs: 12, sm: 6 }}>
        <StyledTextField
          select
          label="Sexo"
          fullWidth
          required
          name='sexo'
          disabled={paciente.sexo !== '' && paciente.sexo !== null}
          value={sexo || ''}
          onBlur={handleBlur} 
          onChange={onInputChange}
        >
          <MenuItem value="Masculino">Masculino</MenuItem>
          <MenuItem value="Femenino">Femenino</MenuItem>
        </StyledTextField>
      </Grid2>
      <Grid2 item size={{ xs: 12, sm: 6 }}>
        <StyledTextField
          label="Fecha de nacimiento"
          type="date"
          fullWidth
          name='fechanac'
          disabled={paciente.fechanac !== '' && paciente.fechanac !== null}
          value={fechanac || ''}
          onBlur={handleBlur} 
          onChange={onInputChange}
          InputLabelProps={{ shrink: true }}
        />
      </Grid2>
      <Grid2 item size={{ xs: 12, sm: 6 }}>
        <StyledTextField
          label="Tipo de sangre"
          type="text"
          fullWidth
          name='tipo_sangre'
          disabled={paciente.tipo_sangre !== ''&& paciente.tipo_sangre !== null}
          value={tipo_sangre || ''}
          onBlur={handleBlur} 
          onChange={onInputChange}
          InputLabelProps={{ shrink: true }}
        />
      </Grid2>
      <Grid2 item size={{ xs: 12, sm: 6 }}>
        <StyledTextField
          label="Email"
          type="email"
          fullWidth
          name='email'
          disabled={paciente.email !== '' && paciente.email !== null}
          value={email || ''}
          onBlur={handleBlur} 
          onChange={onInputChange}
          InputLabelProps={{ shrink: true }}
        />
      </Grid2>
      <Grid2 item size={{ xs: 12, sm: 6 }}>
        <StyledTextField
          label="Contacto"
          type="text"
          fullWidth
          name='contacto'
          disabled={paciente.contacto !== '' && paciente.contacto !== null}
          value={contacto || ''}
          onBlur={handleBlur} 
          onChange={onInputChange}
          InputLabelProps={{ shrink: true }}
        />
      </Grid2>
      <Grid2 item size={{ xs: 12 }}>
          <StyledTextField label="Lugar de nacimiento" name='lugarnac' value={lugarnac} disabled={paciente.lugarnac !== '' && paciente.lugarnac !== null} onChange={onInputChange} onBlur={handleBlur}  fullWidth />
      </Grid2>
      <Grid2 item size={{ xs: 12 }}>
        <StyledTextField
          label="Fecha de admisión"
          type="date"
          fullWidth
          required
          name='fecha_admision'
          value={fecha_admision || ''}
          onBlur={handleBlur} 
          onChange={onInputChange}
          InputLabelProps={{ shrink: true }}
        />
      </Grid2>
      <Grid2 item size={{ xs: 12 }}>
        <StyledTextField
          label="Motivo de ingreso"
          required
          fullWidth
          multiline
          name='motivo_ingreso'
          value={motivo_ingreso || ''}
          onBlur={handleBlur} 
          onChange={onInputChange}
          rows={3}
        />
      </Grid2>
      <Grid2 item size={{ xs: 12 }}>
        <StyledTextField
          label="Diagnóstico presuntivo"
          fullWidth
          multiline
          rows={3}
          name='diagnostico_presunt'
          value={diagnostico_presunt || ''}
          onBlur={handleBlur} 
          onChange={onInputChange}
        />
      </Grid2>
    </Grid2>
  );
}

