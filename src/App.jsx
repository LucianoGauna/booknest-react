import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Catalogo from "./pages/Catalogo";
import LibroDetalle from "./pages/LibroDetalle";
import MisPrestamos from "./pages/MisPrestamos";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLibros from "./pages/AdminLibros";
import AdminPrestamos from "./pages/AdminPrestamos";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Catalogo />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/libros/:id" element={<LibroDetalle />} />
        <Route path="/mis-prestamos" element={<MisPrestamos />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/libros" element={<AdminLibros />} />
        <Route path="/admin/prestamos" element={<AdminPrestamos />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}