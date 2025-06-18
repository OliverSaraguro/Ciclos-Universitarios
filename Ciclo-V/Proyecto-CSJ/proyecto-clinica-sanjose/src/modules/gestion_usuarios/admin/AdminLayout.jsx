import React from 'react';
import { SideBar } from './components/SideBar';

export const AdminLayout = ({ children }) => {
    return (
        <div className="adminlayout">

            {/* SideBar */}
            <SideBar />

            {/* Main content */}

            {/* Mostrar mensaje predeterminado si no hay hijos */}
            {children}

        </div>
    );
};