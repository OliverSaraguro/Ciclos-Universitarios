import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { HistoriaLayout } from "../pages/HistoriaLayout";
import { HistoriasPanelPage } from "../pages/HistoriasPanelPage";
import { HistoriaPage } from "../pages/HistoriaPage";
import FormularioPage from "../pages/FormularioPage";

export const HistoryRoutes = () => {
  return (
    <Routes>
      {/* Ruta principal */}
      <Route
        path="/"
        element={<HistoriaLayout children={<HistoriasPanelPage />} />}
      />

      {/* Ruta para historias individuales */}
      <Route
        path="/detalle"
        element={<HistoriaLayout children={<HistoriaPage />} />}
      />

      {/* Ruta para un formulario de la historia */}
      <Route
        path="/detalle/formulario"
        element={<HistoriaLayout children={<FormularioPage />} />}
      />

      {/* Redirección a la página principal */}
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};
