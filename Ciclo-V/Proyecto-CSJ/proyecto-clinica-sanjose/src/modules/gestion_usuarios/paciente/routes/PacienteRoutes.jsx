import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { InicioPage } from '../pages/InicioPage'
import { HistoryRoutes } from '../../../historias_clinicas/routes/HistoryRoutes'

export const PacienteRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<InicioPage />} />
            <Route path="/historias/*" element={<HistoryRoutes />} />

            {/* Redirección a la página principal */}
            <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
    )
}