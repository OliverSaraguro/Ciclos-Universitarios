import { Box, Typography, TextField, MenuItem, Button } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "../../../hooks/useForm";

const initForm = {
  id: "",
  ordenarpor: "",
  fechain: "",
  fechafin: "",
  clasificacion: "",
};

export const FilterHistorias = ({ onFilter }) => {
  const {
    onInputChange,
    onResetForm,
    id,
    ordenarpor,
    fechain,
    fechafin,
    clasificacion,
    formState,
  } = useForm(initForm);

  useEffect(() => {
    onFilter(id, ordenarpor, fechain, fechafin, clasificacion);
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
          label="Buscar por ID"
          variant="outlined"
          name="id"
          value={id}
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
          label="Fecha inicio"
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
          label="Fecha fin"
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

        <TextField
          label="Clasificación"
          variant="outlined"
          placeholder="Escoge una opción"
          name="clasificacion"
          value={clasificacion}
          onChange={onInputChange}
          fullWidth
          select
          sx={{
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
          <MenuItem value="">Todas</MenuItem>
          <MenuItem value="enEspera">En espera</MenuItem>
          <MenuItem value="abierta">Abierta</MenuItem>
          <MenuItem value="cerrada">Cerrada</MenuItem>
        </TextField>

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
