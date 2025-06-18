import React, { useEffect } from 'react';
import { Box, Typography, TextField, MenuItem, Button, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { useForm } from "../../../../hooks/useForm";

const initForm = {
  cedula: "",
  nombre: "",
  ordenarpor: "",
  sexo: "",
  edad: "",
  tipo_sangre: "",
};

export const FilterPacientes = ({ onFilter }) => {
  const {
    onInputChange,
    onResetForm,
    cedula,
    nombre,
    sexo,
    edad,
    tipo_sangre,
    formState,
  } = useForm(initForm);

  useEffect(() => {
    onFilter(formState);
  }, [formState]);

  return (
    <Box
      sx={{
        padding: 3,
        borderRadius: "12px",
        backgroundColor: "white",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <form onReset={onResetForm}>
        <Typography
          variant="h6"
          sx={{ mb: 3, fontWeight: "bold", color: "#004d40" }}
        >
          Filtrar Pacientes
        </Typography>

        <TextField
          label="Buscar por cédula"
          variant="outlined"
          name="cedula"
          value={cedula}
          onChange={onInputChange}
          fullWidth
          sx={{ mb: 2 }}
        />

        <TextField
          label="Buscar por nombre"
          variant="outlined"
          name="nombre"
          value={nombre}
          onChange={onInputChange}
          fullWidth
          sx={{ mb: 2 }}
        />

        <Typography variant="subtitle2" sx={{ mb: 1, color: "#004d40" }}>Género</Typography>
        <RadioGroup
          row
          name="sexo"
          value={sexo}
          onChange={onInputChange}
          sx={{ mb: 2 }}
        >
          <FormControlLabel value="Masculino" control={<Radio />} label="Masculino" />
          <FormControlLabel value="Femenino" control={<Radio />} label="Femenino" />
        </RadioGroup>

        <TextField
          label="Edad"
          type="number"
          name="edad"
          value={edad}
          onChange={onInputChange}
          fullWidth
          sx={{ mb: 2 }}
        />

        <TextField
          label="Tipo de sangre"
          variant="outlined"
          name="tipo_sangre"
          value={tipo_sangre}
          onChange={onInputChange}
          fullWidth
          sx={{ mb: 2 }}
        />

        <Button
          type="reset"
          variant="contained"
          sx={{
            mt: "22px",
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
          Restablecer
        </Button>
      </form>
    </Box>
  );
};

