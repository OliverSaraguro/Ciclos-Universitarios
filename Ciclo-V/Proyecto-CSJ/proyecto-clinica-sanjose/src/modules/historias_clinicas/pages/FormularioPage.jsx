import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  CircularProgress,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-alpine.css";
import { read, utils, writeFile } from "xlsx";
import { motion } from "framer-motion";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { write } from "xlsx";
import { startSetActiveForm, startUpdateHistory } from "../store/thunks";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingModal from "../../loading/LoadingModal";

const FormularioPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { activeHistory, activeForm, resp } = useSelector((state) => state.history);
  const { resp: authResp } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { accion, tipo } = location.state || {};
  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const gridRef = useRef(null);
  const paperRef = useRef(null);

  const roleStores = {
    'doctor': 'medico',
    'nurse': 'enfermeria',
    'patient': 'paciente'
  };

  const storeName = roleStores[authResp.user.rol] || 'default';
  const { activeRegister } = useSelector(state => state[storeName]);

  useEffect(() => {
    loadExcelData().catch((err) => {
      console.error("Failed to load Excel data:", err);
      setError("Failed to load the Excel file. Please try again.");
    });
  }, [accion, tipo]);

  const loadExcelData = async () => {
    setIsLoading(true); // Activar carga

    try {
      let arrayBuffer;

      if (accion === "crear") {
        const fileName = `/formsExcelTemplates/${tipo}.xlsx`;
        const response = await fetch(fileName);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        arrayBuffer = await response.arrayBuffer();
      } else {
        // Leer desde Base64
        const base64 = activeForm.archivo;
        if (!base64) throw new Error("No se encontró el archivo en Base64");

        // Decodificar Base64 a ArrayBuffer
        const binaryString = atob(base64);
        arrayBuffer = new ArrayBuffer(binaryString.length);
        const bufferView = new Uint8Array(arrayBuffer);
        for (let i = 0; i < binaryString.length; i++) {
          bufferView[i] = binaryString.charCodeAt(i);
        }
      }

      // Leer el archivo Excel con todas las opciones de formato
      const workbook = read(arrayBuffer, {
        type: "array",
        cellStyles: true,
        cellDates: true,
        cellNF: true,
        cellFormula: true,
      });

      if (!workbook.SheetNames.length)
        throw new Error("No sheets found in the Excel file");

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawData = utils.sheet_to_json(worksheet, {
        header: 1,
        raw: false, // Mantener el formato de las celdas
      });

      // ** Nueva Lógica: Insertar Valores Predeterminados **
      const defaultValues = {
        "Nombre completo": activeRegister.nombres || '',
        "Número de historia clínica": activeHistory.id.toString() || '',
        "Edad": activeRegister.edad || '',
        "Sexo": activeRegister.sexo || '',
        "Fecha de nacimiento": activeRegister.fechanac || '',
        "Cédula": activeRegister.cedula.toString() || '',
        "Tipo de sangre": activeRegister.tipo_sangre || '',
      };

      rawData.forEach((row, rowIndex) => {
        if (rowIndex === 0) return; // Saltar la fila de encabezados
        row.forEach((cell, colIndex) => {
          if (defaultValues[cell]) {
            const nextColIndex = colIndex + 1; // Columna derecha
            if (!row[nextColIndex]) {
              row[nextColIndex] = defaultValues[cell]; // Inserta valor predeterminado
            }
          }
        });
      });

      // Obtener información de formato de columnas
      const range = utils.decode_range(worksheet["!ref"]);
      const columnWidths = [];
      for (let C = range.s.c; C <= range.e.c; C++) {
        const col = worksheet["!cols"] && worksheet["!cols"][C];
        columnWidths[C] = col ? col.width : 100; // ancho por defecto si no está definido
      }

      const headers = rawData[0] || [];
      const rowData = rawData.slice(1).map((row) => {
        const rowObj = {};
        headers.forEach((header, index) => {
          rowObj[header] = row[index] || "";
        });
        return rowObj;
      });

      const columnDefs = headers.map((header, index) => ({
        headerName: header,
        field: header,
        sortable: false, // Desactivar ordenación
        filter: false, // Desactivar filtro
        editable: accion !== "ver", // Hacer que las celdas sean editables solo si la acción no es "ver"
        resizable: true, // Hacer que las columnas sean redimensionables
        flex: 1, // Usar flex para ajustar automáticamente el ancho
        minWidth: columnWidths[index] || 275 / 7.5, // Usar el ancho de la columna original si está definido, o un valor por defecto
        cellStyle: (params) => {
          // Obtener el estilo de la celda original
          const rowIndex = params.node.rowIndex + 1; // +1 porque la primera fila son headers
          const colKey = utils.encode_cell({ r: rowIndex, c: index });
          const cell = worksheet[colKey]; // Aquí asumes que `worksheet` es un objeto que contiene la información de la celda

          // Si la celda tiene un estilo definido, aplicar el estilo en la celda de la tabla
          if (cell && cell.s) {
            return {
              backgroundColor: cell.s.fgColor?.rgb
                ? `#${cell.s.fgColor.rgb}`
                : undefined,
              color: cell.s.color?.rgb ? `#${cell.s.color.rgb}` : undefined,
              fontWeight: cell.s.bold ? "bold" : undefined,
              fontStyle: cell.s.italic ? "italic" : undefined,
              textDecoration: cell.s.underline ? "underline" : undefined,
            };
          }
          return null; // Si no hay estilo, devolver null
        },
      }));

      setRowData(rowData);
      setColumnDefs(columnDefs);
    } catch (error) {
      console.error("Error loading Excel data:", error);
      setError(error.message);
    } finally {
      setIsLoading(false); // Desactivar carga
    }
  };


  // Guardar en BD
  const handleSave = async () => {

    // Simular enter para finalizar cualquier edición pendiente
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.stopEditing();
    }

    const rowData = [];
    gridRef.current.api.forEachNode((node) => rowData.push(node.data));

    const headers = columnDefs.map((col) => col.field);
    const worksheetData = [
      headers,
      ...rowData.map((row) => headers.map((header) => row[header] || "")),
    ];

    const workbook = utils.book_new();
    const worksheet = utils.aoa_to_sheet(worksheetData);

    // Asignar los anchos de las columnas
    worksheet['!cols'] = columnDefs.map((col) => ({
      width: 275 / 7.5, // Convertir el ancho de pixeles a ancho de Excel
    }));

    workbook.SheetNames.push("Sheet1");
    workbook.Sheets["Sheet1"] = worksheet;

    // Generar el archivo como base64
    const archivoBase64 = write(workbook, { type: "base64" });

    // Generar fecha en formato yyyy-mm-dd 
    const getFormattedDate = () => {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      return date.toISOString().split("T")[0];
    };

    // Historia actualizada
    const history = {
      ...activeHistory,
      nroforms: activeHistory.nroforms + 1,
      fecha_ult_mod: getFormattedDate(),
      formularios: (activeHistory.formularios || []).map((formulario) =>
        formulario.nombre === `${tipo}.xlsx`
          ? {
            ...formulario,
            autor: `Dr. ${authResp.user.nombres}`,
            fecha_ult_mod: getFormattedDate(),
            archivo: archivoBase64,
          }
          : formulario
      ),
    };

    // Si no existe, lo agregamos
    if (!history.formularios.some((formulario) => formulario.nombre === `${tipo}.xlsx`)) {
      history.formularios.push({
        nombre: `${tipo}.xlsx`,
        autor: `Dr. ${authResp.user.nombres}`,
        fecha_creacion: getFormattedDate(),
        fecha_ult_mod: getFormattedDate(),
        archivo: archivoBase64,
      });
    }


    setLoading(true);
    // Llamar al thunk para actualizar el store
    await dispatch(startUpdateHistory(history));
    setLoading(false);


    Swal.fire({
      title: "¡Éxito!",
      text: `El formulario de tipo ${tipo} ha sido registrado exitosamente`,
      icon: "success",
      showCancelButton: false,
      confirmButtonText: "Ok",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(-1);
      }
    });
  };

  const handleSaveAndDownload = async () => {

    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.stopEditing();
    }

    const rowData = [];
    gridRef.current.api.forEachNode((node) => rowData.push(node.data));

    const headers = columnDefs.map((col) => col.field);
    const worksheetData = [
      headers,
      ...rowData.map((row) => headers.map((header) => row[header] || "")),
    ];

    const workbook = utils.book_new();
    const worksheet = utils.aoa_to_sheet(worksheetData);

    // Asignar los anchos de las columnas
    worksheet['!cols'] = columnDefs.map((col) => ({
      width: 275 / 7.5, // Convertir el ancho de pixeles a ancho de Excel
    }));

    workbook.SheetNames.push("Sheet1");
    workbook.Sheets["Sheet1"] = worksheet;

    // Generar el archivo como base64
    const archivoBase64 = write(workbook, { type: "base64" });

    // Generar fecha en formato yyyy-mm-dd 
    const getFormattedDate = () => {
      const date = new Date();
      date.setDate(date.getDate() - 1);
      return date.toISOString().split("T")[0];
    };

    // Historia actualizada
    const history = {
      ...activeHistory,
      nroforms: activeHistory.nroforms + 1,
      fecha_ult_mod: getFormattedDate(),
      formularios: (activeHistory.formularios || []).map((formulario) =>
        formulario.nombre === `${tipo}.xlsx`
          ? {
            ...formulario,
            autor: `Dr. ${authResp.user.nombres}`,
            fecha_ult_mod: getFormattedDate(),
            archivo: archivoBase64,
          }
          : formulario
      ),
    };

    // Si no existe, lo agregamos
    if (!history.formularios.some((formulario) => formulario.nombre === `${tipo}.xlsx`)) {
      history.formularios.push({
        nombre: `${tipo}.xlsx`,
        autor: `Dr. ${authResp.user.nombres}`,
        fecha_creacion: getFormattedDate(),
        fecha_ult_mod: getFormattedDate(),
        archivo: archivoBase64,
      });
    }


    setLoading(true);
    // Llamar al thunk para actualizar el store
    await dispatch(startUpdateHistory(history));
    setLoading(false);


    // Decodificar Base64
    const binaryString = atob(archivoBase64);

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
    link.download = `${resp.patient.cedula}_${resp.patient.nombres.replace(/\s+/g, '')}_${tipo}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      title: "¡Éxito!",
      text: `El formulario de tipo ${tipo} ha sido registrado exitosamente`,
      icon: "success",
      showCancelButton: false,
      confirmButtonText: "Ok",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(-1);
      }
    });
  };

  const download = () => {

    // Decodificar Base64
    const binaryString = atob(activeForm.archivo);

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
    link.download = `${resp.patient.cedula}_${resp.patient.nombres.replace(/\s+/g, '')}_${tipo}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenEnabled) {
      setIsFullscreen(!isFullscreen);
      return;
    }

    if (!isFullscreen) {
      paperRef.current.requestFullscreen().catch(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().catch(() => setIsFullscreen(false));
    }
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Container maxWidth="lg">
      <LoadingModal
        open={loading}
        onClose={() => setLoading(false)}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box>
            <Typography
              variant="h2"
              sx={{ fontWeight: "bold", color: "#004d40" }}
            >
              {accion === "crear"
                ? "Crear Formulario"
                : accion === "editar"
                  ? "Editar Formulario"
                  : "Ver Formulario"}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#00695c" }}>
              {accion === "crear"
                ? `Llena el formulario de tipo ${tipo}`
                : `Formulario de tipo ${tipo}`}
            </Typography>
          </Box>
          <Button
            onClick={toggleFullscreen}
            variant="outlined"
            disabled={isLoading}
            startIcon={<FullscreenIcon />}
            sx={{
              color: "#004d40",
              borderColor: "#004d40",
              ml: 2,
              display: { xs: "none", md: "inline" }, // Oculta el texto en xs (móviles), lo muestra en md o mayor
              "&:hover": { backgroundColor: "rgba(0, 77, 64, 0.04)" },
            }}
          >
            <span className="button-text">Pantalla completa</span>
          </Button>

        </Box>

        {error && (
          <Typography variant="body2" sx={{ color: "error.main", mb: 2 }}>
            {error}
          </Typography>
        )}

        <Paper
          ref={paperRef}
          elevation={3}
          sx={{
            p: 2,
            mb: 4,
            height: isFullscreen ? "calc(100vh - 120px)" : "600px",
            maxHeight: isFullscreen ? "calc(100vh - 120px)" : "600px",
            transition: "all 0.3s ease-in-out",
            "& .ag-root": {
              border: "none",
            },
            "& .ag-header": {
              border: "none",
            },
            "& .ag-cell": {
              border: "1px solid #e0e0e0",
            },
          }}
          className="ag-theme-alpine"
        >
          {isLoading ? (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
              }}
            >
              <CircularProgress />
              <Typography>Cargando...</Typography>
            </Box>
          ) : (
            <div
              className="ag-theme-alpine"
              style={{
                height: "100%",
                width: "100%",
                display: "block",
                overflow: "auto", // Habilitar barra de desplazamiento si es necesario
              }}
            >
              <AgGridReact
                ref={gridRef}
                domLayout="autoHeight"
                columnDefs={columnDefs}
                rowData={rowData}
                pagination={false} // Desactivar paginación
                suppressDragLeaveHidesColumns={true}
                suppressHorizontalScroll={true}
                suppressRowClickSelection={true}
                suppressMenu={true}
                enableColResize={true}
              />
            </div>
          )}
        </Paper>

        {accion !== "ver" && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              variant="outlined"
              disabled={isLoading}
              onClick={handleSave}
              sx={{
                color: "#004d40",
                borderColor: "#004d40",
                "&:hover": { backgroundColor: "rgba(0, 77, 64, 0.04)" },
              }}
            >
              Guardar
            </Button>
            <Button
              variant="contained"
              disabled={isLoading}
              onClick={handleSaveAndDownload}
              sx={{
                backgroundColor: "#004d40",
                "&:hover": { backgroundColor: "#00695c" },
              }}
            >
              Guardar y Descargar
            </Button>
          </Box>
        )}

        {accion === "ver" && (
          <Button
            variant="contained"
            disabled={isLoading}
            onClick={download}
            sx={{
              backgroundColor: "#004d40",
              "&:hover": { backgroundColor: "#00695c" },
            }}
          >
            Descargar
          </Button>
        )}
      </motion.div>
    </Container>
  );
};

export default FormularioPage;
