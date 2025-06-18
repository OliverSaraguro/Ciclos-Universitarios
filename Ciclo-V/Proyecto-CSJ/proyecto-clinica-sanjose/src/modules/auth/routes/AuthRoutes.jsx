import { Navigate, Route, Routes } from "react-router-dom";
import ChangePasswordPage from "../pages/ChangePasswordPage";
import { LoginPage } from "../pages/LoginPage";

export const AuthRoutes = () => {
    return (
        <Routes>
            <Route path="login" element={<LoginPage />} />
            <Route path="resetPassword" element={<ChangePasswordPage />} />
            <Route path="/*" element={<Navigate to="login" />} />
        </Routes>
    );
};
