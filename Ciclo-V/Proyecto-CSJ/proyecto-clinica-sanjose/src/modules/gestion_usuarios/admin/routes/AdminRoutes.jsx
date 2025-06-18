import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import { AdminLayout } from "../AdminLayout";
import { DoctorsView } from "../views/DoctorsView";
import { CreateDoctor } from "../pages/CreateDoctor";
import { NursesView } from "../views/NursesView";
import { useSelector } from "react-redux";
import { EscogerOpcion } from "../components/EscogerOpcion";
import { CreateNurse } from "../pages/CreateNurse";
import { PatientsView } from "../views/PatientsView";
import { RecepcionistsView } from "../views/RecepcionistsView";
import { CreateRecepcionist } from "../pages/CreateRecepcionist";

export const AdminRoutes = () => {
  const { resp } = useSelector((state) => state.admin);

  return (
    <Routes>
      {/* Ruta base con AdminLayout */}
      <Route path="/" element={<AdminLayout><Outlet /></AdminLayout>}>
        {/* Rutas hijas */}
        <Route index element={<EscogerOpcion/>} />
        <Route path="medicos" element={<DoctorsView />} />
        <Route path="medicos/crear" element={<CreateDoctor />} />

        <Route path="enfermeria" element={<NursesView />} />
        <Route path="enfermeria/crear" element={<CreateNurse />} />

        <Route path="recepcionistas" element={<RecepcionistsView />} />
        <Route path="recepcionistas/crear" element={<CreateRecepcionist />} />

        <Route path="pacientes" element={<PatientsView />} />
      </Route>

      {/* Ruta para manejar no encontradas */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
