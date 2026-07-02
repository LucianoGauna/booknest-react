import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
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
        <Route path="/" element={<Navigate to="/catalogo" replace />} />

        <Route
          path="/catalogo"
          element={
            <ProtectedRoute>
              <Catalogo />
            </ProtectedRoute>
          }
        />

        <Route
          path="/libros/:id"
          element={
            <ProtectedRoute>
              <LibroDetalle />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mis-prestamos"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <MisPrestamos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/libros"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLibros />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/prestamos"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPrestamos />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}