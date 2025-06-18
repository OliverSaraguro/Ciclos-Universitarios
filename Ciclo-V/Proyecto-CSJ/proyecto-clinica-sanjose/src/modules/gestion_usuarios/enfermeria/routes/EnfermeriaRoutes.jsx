import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { InicioPage } from '../pages/InicioPage'
import { PacientesPage } from '../pages/PacientesPage'
import { HistoryRoutes } from '../../../historias_clinicas/routes/HistoryRoutes'

export const EnfermeriaRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<InicioPage />} />
            <Route path="/pacientes" element={<PacientesPage />} />
            <Route path="/pacientes/historia/*" element={<HistoryRoutes />} />

            {/* Redirección a la página principal */}
            <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
    )
}