import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import { RoleController } from "./RoleController";
import { AuthRoutes } from "../modules/auth/routes/AuthRoutes";

export const AppRouter = () => {
    const { status } = useSelector((state) => state.auth);

    return (
        <Routes>
            {status === "not-auth" ? (
                // Rutas de autenticación
                <>
                    <Route path="auth/*" element={<AuthRoutes />} />
                    <Route path="/*" element={<Navigate to="/auth/login" />} />
                </>
            ) : (
                // Rutas protegidas según roles
                <>
                    <Route path="role/*" element={<RoleController />} />
                    <Route path="/*" element={<Navigate to="role" />} />
                </>
            )}
        </Routes>
    );
};
