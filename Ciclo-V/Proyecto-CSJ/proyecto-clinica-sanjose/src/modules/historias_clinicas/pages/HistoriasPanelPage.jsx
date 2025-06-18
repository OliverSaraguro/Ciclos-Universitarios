import {
    Box,
    Typography,
    Grid2,
    useMediaQuery,
    useTheme,
    Skeleton,
  } from "@mui/material";
  import { ItemHistoria } from "../components/ItemHistoria";
  import { FilterHistorias } from "../components/FilterHistorias";
  import { useEffect, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { startLoadingHistories } from "../store/thunks";
  
  const SkeletonHistoria = () => (
    <Box
      sx={{
        width: "100%",
        marginBottom: 2,
        padding: 2,
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Skeleton variant="text" width="60%" height={24} sx={{ marginBottom: 1 }} />
      <Skeleton variant="text" width="40%" height={20} sx={{ marginBottom: 1 }} />
      <Skeleton variant="text" width="70%" height={20} sx={{ marginBottom: 1 }} />
      <Skeleton
        variant="rectangular"
        width="100%"
        height={36}
        sx={{ marginTop: 2, borderRadius: 1 }}
      />
    </Box>
  );
  
  export const HistoriasPanelPage = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
    useEffect(() => {
      dispatch(startLoadingHistories());
    }, []);
  
    const { resp, onLoading, error } = useSelector((state) => state.history);
    const { resp: authResp } = useSelector((state) => state.auth);
    const [filteredList, setFilteredList] = useState([]);

    const estados = (authResp.user.rol === 'nurse') ? ["abierta", "enEspera"] : ["enEspera", "abierta", "cerrada", "cerrada-editable"]
  
    useEffect(() => {
      if (resp.histories) {
        setFilteredList(resp.histories);
      }
    }, [resp.histories]);
  
    const originalData = resp.histories || [];
  
    const handleFilter = (id, ordenarpor, fechain, fechafin, clasificacion) => {
      const filtered = originalData.filter((item) => {
        const itemDate = new Date(item.fechacreacion);
        const startDate = fechain ? new Date(fechain) : null;
        const endDate = fechafin ? new Date(fechafin) : null;
  
        const matchesId = id ? item.id === parseInt(id, 10) : true;
        const matchesClasificacion = clasificacion
          ? item.estado === clasificacion
          : true;
        const matchesFechaIn = startDate ? itemDate >= startDate : true;
        const matchesFechaFin = endDate ? itemDate <= endDate : true;
  
        return (
          (id ? matchesId : true) &&
          (clasificacion ? matchesClasificacion : true) &&
          (fechain ? matchesFechaIn : true) &&
          (fechafin ? matchesFechaFin : true)
        );
      });
  
      const sortedFiltered = ordenarpor
        ? [...filtered].sort((a, b) => {
            const dateA = new Date(a.fechacreacion);
            const dateB = new Date(b.fechacreacion);
            return ordenarpor === "asc" ? dateA - dateB : dateB - dateA;
          })
        : filtered;
  
      setFilteredList(sortedFiltered);
    };
  
    const renderCards = (status) =>
      filteredList
        .filter((item) => item.estado === status)
        .map((item) => (
          <Grid2
            item
            size={{ xs: 12, sm: 6, md: 4 }}
            key={item.id}
            className="animate__animated animate__fadeIn animate__faster"
          >
            <ItemHistoria
              id={item.id}
              fechacreacion={item.fechacreacion}
              fechaUltMod={item.fecha_ult_mod}
              nroForms={item.nroforms}
              history={item}
            />
          </Grid2>
        ));
  
    const renderSkeletons = (count) => (
      <>
        {[...Array(count)].map((_, index) => (
          <Grid2 item size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <SkeletonHistoria />
          </Grid2>
        ))}
      </>
    );
  
    if (onLoading) {
      return (
        <>
          <Skeleton
            variant="text"
            width="50%"
            height={60}
            sx={{ marginBottom: 1 }}
          />
          <Skeleton
            variant="text"
            width="70%"
            height={24}
            sx={{ marginBottom: 4 }}
          />
  
          <Grid2 container spacing={3}>
            <Grid2 item size={{ xs: 12, md: 9 }}>
              {estados.map((status) => (
                <Box key={status} sx={{ mb: 4 }}>
                  <Skeleton
                    variant="text"
                    width="30%"
                    height={32}
                    sx={{ marginBottom: 2 }}
                  />
                  <Grid2 container spacing={2}>
                    {renderSkeletons(3)}
                  </Grid2>
                </Box>
              ))}
            </Grid2>
  
            <Grid2 item size={{ xs: 12, md: 3 }}>
              <Box sx={{ position: isMobile ? "static" : "sticky", top: "20px" }}>
                <Skeleton
                  variant="rectangular"
                  width="90%"
                  height={400}
                  sx={{ borderRadius: 2 }}
                />
              </Box>
            </Grid2>
          </Grid2>
        </>
      );
    }
  
    return (
      <Box sx={{ overflowX: 'hidden' }} >
        <Typography
          variant="h2"
          sx={{ mb: 1, fontWeight: "bold", color: "#004d40" }}
        >
          Historias Clínicas
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4, color: "#00695c" }}>
          Explorar las historias clínicas del paciente
        </Typography>
  
        <Grid2 container spacing={3}>
          <Grid2 item size={{ xs: 12, md: 9 }}>
            {estados.map((status) => (
              <Box key={status} sx={{ mb: 4 }}>
                <Typography
                  variant="h5"
                  sx={{ mb: 2, color: "#004d40", fontWeight: "bold" }}
                >
                  {status === "enEspera"
                    ? "En espera"
                    : status === "abierta"
                    ? "Abierta"
                    : status === "cerrada-editable"
                    ? "Cerradas (editables)"
                    : "Cerradas"}
                </Typography>
                <Grid2 container spacing={2}>
                  {renderCards(status)}
                </Grid2>
              </Box>
            ))}
          </Grid2>
  
          <Grid2
            item
            size={{ xs: 12, md: 3 }}
            className="animate__animated animate__slideInRight"
          >
            <Box sx={{ position: isMobile ? "static" : "sticky", top: "20px" }}>
              <FilterHistorias onFilter={handleFilter} />
            </Box>
          </Grid2>
        </Grid2>
      </Box>
    );
  };
  