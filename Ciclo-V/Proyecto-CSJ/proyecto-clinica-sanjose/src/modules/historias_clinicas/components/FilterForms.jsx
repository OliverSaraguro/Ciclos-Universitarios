import React, { useEffect } from "react";
import { Box, Typography, TextField, MenuItem, Button } from "@mui/material";
import { useForm } from "../../../hooks/useForm";

const initForm = {
  tipo: "",
  autor: "",
  ordenarpor: "",
  fechain: "",
  fechafin: "",
};

const FilterForms = ({ onFilter }) => {
  const {
    onInputChange,
    onResetForm,
    tipo,
    ordenarpor,
    fechain,
    fechafin,
    autor,
    formState,
  } = useForm(initForm);

  useEffect(() => {
    onFilter(tipo, ordenarpor, fechain, fechafin, autor);
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
          Filtrar
        </Typography>

        <TextField
          label="Tipo de formulario"
          name="tipo"
          value={tipo}
          onChange={onInputChange}
          variant="outlined"
          fullWidth
          select
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#004d40",
              },
              "&:hover fieldset": {
                borderColor: "#00695c",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#004d40",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#004d40",
            },
          }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="Administración de medicamentos.xlsx">Administración de medicamentos</MenuItem>
          <MenuItem value="Admisión - AltaEgreso.xlsx">Admisión - AltaEgreso</MenuItem>
          <MenuItem value="Anamnesis.xlsx">Anamnesis</MenuItem>
          <MenuItem value="Atención inmediata al recién nacido.xlsx">Atención inmediata al recién nacido</MenuItem>
          <MenuItem value="Consentimiento informado.xlsx">Consentimiento informado</MenuItem>
          <MenuItem value="Constantes vitales y balance hídrico.xlsx">Constantes vitales y balance hídrico</MenuItem>
          <MenuItem value="Cuidados post-anestésicos.xlsx">Cuidados post-anestésicos</MenuItem>
          <MenuItem value="Emergencia.xlsx">Emergencia</MenuItem>
          <MenuItem value="Epicrisis.xlsx">Epicrisis</MenuItem>
          <MenuItem value="Evaluación psicológica inicial.xlsx">Evaluación psicológica inicial</MenuItem>
          <MenuItem value="Evolución y prescripciones.xlsx">Evolución y prescripciones</MenuItem>
          <MenuItem value="Informe de anatomía patológica.xlsx">Informe de anatomía patológica</MenuItem>
          <MenuItem value="Informe de imagenología.xlsx">Informe de imagenología</MenuItem>
          <MenuItem value="Informe de laboratorio clínico.xlsx">Informe de laboratorio clínico</MenuItem>
          <MenuItem value="Pre-anestésico.xlsx">Pre-anestésico</MenuItem>
          <MenuItem value="Protocolo quirúrgico.xlsx">Protocolo quirúrgico</MenuItem>
          <MenuItem value="Solicitud de anatomía patológica.xlsx">Solicitud de anatomía patológica</MenuItem>
          <MenuItem value="Solicitud de imagenología.xlsx">Solicitud de imagenología</MenuItem>
          <MenuItem value="Solicitud de laboratorio clínico.xlsx">Solicitud de laboratorio clínico</MenuItem>
          <MenuItem value="Trans-anestésico.xlsx">Trans-anestésico</MenuItem>
          <MenuItem value="Tratamiento médico.xlsx">Tratamiento médico</MenuItem>
        </TextField>

        <TextField
          label="Buscar por autor"
          variant="outlined"
          name="autor"
          value={autor}
          onChange={onInputChange}
          fullWidth
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#004d40",
              },
              "&:hover fieldset": {
                borderColor: "#00695c",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#004d40",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#004d40",
            },
          }}
        />

        <TextField
          label="Ordenar por"
          variant="outlined"
          name="ordenarpor"
          value={ordenarpor}
          onChange={onInputChange}
          fullWidth
          select
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#004d40",
              },
              "&:hover fieldset": {
                borderColor: "#00695c",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#004d40",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#004d40",
            },
          }}
        >
          <MenuItem value="desc">Más recientes primero</MenuItem>
          <MenuItem value="asc">Más antiguos primero</MenuItem>
        </TextField>

        <TextField
          label="Fecha desde"
          type="date"
          name="fechain"
          value={fechain}
          onChange={onInputChange}
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#004d40",
              },
              "&:hover fieldset": {
                borderColor: "#00695c",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#004d40",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#004d40",
            },
          }}
        />

        <TextField
          label="Fecha hasta"
          type="date"
          name="fechafin"
          value={fechafin}
          onChange={onInputChange}
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#004d40",
              },
              "&:hover fieldset": {
                borderColor: "#00695c",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#004d40",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#004d40",
            },
          }}
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

export default FilterForms;
