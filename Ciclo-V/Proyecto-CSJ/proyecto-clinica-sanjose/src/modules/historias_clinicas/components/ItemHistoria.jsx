import { Paper, Typography, Divider, IconButton, Box } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setActiveHistory } from "../store/historySlice";

export const ItemHistoria = ({
  id,
  fechacreacion,
  fechaUltMod,
  nroForms,
  history,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // PARA IR A LA HISTORIA PRESIONADA
  const onClickHistory = () => {
    dispatch(setActiveHistory(history));
    navigate(`detalle`); // Pasar datos a través del estado
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 3,
        borderRadius: "12px",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
        },
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", color: "#004d40", mb: 2 }}
      >
        Historia N. {id}
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ color: "#00695c", mb: 1 }}>
          <strong>Formularios:</strong> {nroForms}
        </Typography>
        <Typography variant="body2" sx={{ color: "#00695c", mb: 1 }}>
          <strong>Fecha de creación:</strong> {fechacreacion}
        </Typography>
        <Typography variant="body2" sx={{ color: "#00695c" }}>
          <strong>Última modificación:</strong> {fechaUltMod}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton
          onClick={onClickHistory}
          sx={{
            color: "#004d40",
            "&:hover": {
              backgroundColor: "rgba(0, 77, 64, 0.1)",
            },
          }}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};
