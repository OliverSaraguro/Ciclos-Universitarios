import { Box, Button, Chip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { startLoadingHistories } from "../store/thunks";

export const HistoriaLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startLoadingHistories());
  }, []);

  const { resp, onLoading, error } = useSelector((state) => state.history);

  return (
    <Box
      sx={{
        padding: { xs: 2, md: 4 },
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "radial-gradient(#00800022 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          pointerEvents: "none",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: 'left', sm: 'center' },
          flexDirection: { xs: "column", sm: "row" }, 
          mb: 4,
        }}
      >
        <Button
          onClick={() => navigate(-1)}
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{
            color: "black",
            borderColor: "black",
            mb: { xs: 2, sm: 0 },
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
              borderColor: "black",
            },
          }}
        >
          Atrás
        </Button>
        <Chip
          label={
            onLoading
              ? "Obteniendo.."
              : `${resp.patient.nombres} | ${resp.patient.cedula}`
          }
          sx={{
            backgroundColor: "#004d40",
            color: "white",
            borderRadius: "8px",
            fontWeight: "bold",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            "&:hover": {
              backgroundColor: "#00695c",
              cursor: "default",
            },
          }}
        />
      </Box>

      {children}
    </Box>
  );
};
