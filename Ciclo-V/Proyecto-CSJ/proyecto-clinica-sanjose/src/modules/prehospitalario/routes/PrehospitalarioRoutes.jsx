import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import IngresoPreHospitalario from "../pages/IngresoPreHospitalario";

export const PrehospitalarioRoutes = () => {
  return (
    <Routes>
      {/* Ruta principal */}
      <Route
        path="/"
        element={<IngresoPreHospitalario/>}
      />

      {/* Redirección a la página principal */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
