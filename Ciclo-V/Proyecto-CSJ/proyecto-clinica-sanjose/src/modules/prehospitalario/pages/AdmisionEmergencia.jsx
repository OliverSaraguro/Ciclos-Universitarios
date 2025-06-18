import React from 'react';
import { Grid2, TextField, MenuItem, Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useForm } from '../../../hooks/useForm';
import { useDispatch, useSelector } from 'react-redux';
import { startSetEmergenciaFormData } from '../store/thunks';

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

export default function AdmisionEmergencia() {

  const { paciente } = useSelector(state => state.prehospitalario);
  const dispatch = useDispatch();
  const {
    nombres,
    sexo,
    tipo_sangre,
    fecha_ingreso,
    presion_arterial,
    frecuencia_cardiaca,
    frecuencia_respiratoria,
    temperatura,
    peso,
    talla,
    diagnostico_presunt,
    diagnostico_definitivo,
    medicamentos,
    procedimientos,
    onInputChange,
    formState
  } = useForm(paciente);

  const handleBlur = () => {
    dispatch(startSetEmergenciaFormData(formState));

  };


  return (
    <Grid2 container spacing={2}>
      <Box>
        <Typography textAlign='left' fontSize='15px' color='#bc3232' >* Campos obligatorios</Typography>
      </Box>
      <Grid2 item size={{ xs: 12 }}>
        <StyledTextField label="Nombre completo" name='nombres'
          value={nombres || ''}
          type='text'
          onChange={onInputChange}
          disabled={paciente.nombres !== '' && paciente.nombres !== null}
          required
          onBlur={handleBlur}
          fullWidth
        />
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
          <MenuItem value="otro">Otro</MenuItem>
        </StyledTextField>
      </Grid2>
      <Grid2 item size={{ xs: 12, sm: 6 }}>
        <StyledTextField
          label="Fecha y hora de ingreso"
          type="datetime-local"
          required
          fullWidth
          name='fecha_ingreso'
          onBlur={handleBlur}
          value={fecha_ingreso || ''}
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
          onBlur={handleBlur}
          value={tipo_sangre || ''}
          disabled={paciente.tipo_sangre !== '' && paciente.tipo_sangre !== null}
          onChange={onInputChange}
          InputLabelProps={{ shrink: true }}
        />
      </Grid2>
      <Grid2 item size={{ xs: 12, sm: 6 }}>
        <StyledTextField label="Presión arterial"
          fullWidth
          name='presion_arterial'
          onBlur={handleBlur}
          value={presion_arterial || ''}
          onChange={onInputChange}
        />
      </Grid2>
      <Grid2 item size={{ xs: 12, sm: 6 }}>
        <StyledTextField label="Frecuencia cardíaca" fullWidth
          name='frecuencia_cardiaca'
          onBlur={handleBlur}
          value={frecuencia_cardiaca || ''}
          onChange={onInputChange}
        />
      </Grid2>
      <Grid2 item size={{ xs: 12, sm: 6 }}>
        <StyledTextField label="Frecuencia respiratoria" fullWidth
          name='frecuencia_respiratoria'
          onBlur={handleBlur}
          value={frecuencia_respiratoria || ''}
          onChange={onInputChange}
        />
      </Grid2>
      <Grid2 item size={{ xs: 12, sm: 6 }}>
        <StyledTextField label="Temperatura" fullWidth
          name='temperatura'
          onBlur={handleBlur}
          value={temperatura || ''}
          onChange={onInputChange}
        />
      </Grid2>
      <Grid2 item size={{ xs: 12, sm: 6 }}>
        <StyledTextField label="Peso" fullWidth
          name='peso'
          onBlur={handleBlur}
          value={peso || ''}
          onChange={onInputChange}
        />
      </Grid2>
      <Grid2 item size={{ xs: 12, sm: 6 }}>
        <StyledTextField label="Talla" fullWidth
          name='talla'
          onBlur={handleBlur}
          value={talla || ''}
          onChange={onInputChange}
        />
      </Grid2>
      <Grid2 item size={{ xs: 12 }}>
        <StyledTextField label="Diagnóstico presuntivo" fullWidth multiline rows={2}
          name='diagnostico_presunt'
          value={diagnostico_presunt || ''}
          onBlur={handleBlur}
          onChange={onInputChange}
        />
      </Grid2>
      <Grid2 item size={{ xs: 12 }}>
        <StyledTextField label="Diagnóstico definitivo" fullWidth multiline rows={2}
          name='diagnostico_definitivo'
          value={diagnostico_definitivo || ''}
          onBlur={handleBlur}
          onChange={onInputChange}
        />
      </Grid2>
      <Grid2 item size={{ xs: 12 }}>
        <StyledTextField label="Medicamentos" fullWidth multiline rows={2}
          name='medicamentos'
          value={medicamentos || ''}
          onBlur={handleBlur}
          onChange={onInputChange}
        />
      </Grid2>
      <Grid2 item size={{ xs: 12 }}>
        <StyledTextField label="Procedimientos" fullWidth multiline rows={2}
          name='procedimientos'
          onBlur={handleBlur}
          value={procedimientos || ''}
          onChange={onInputChange}
        />
      </Grid2>
    </Grid2>
  );
}

