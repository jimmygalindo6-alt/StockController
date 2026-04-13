import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/Mainlayouts";
import CategoriaProductoList from "./pages/CategoriaProductoList";
import ProveedoresList from "./pages/ProveedoresList";
import ProductosList from "./pages/ProductoList";
import CompraList from "./pages/CompraList";
import VentasList from "./pages/VentasList";
import ReporteCompras from "./pages/ReporteCompras";
import ReporteVentas from "./pages/ReporteVentas";
import ReporteGanancias from "./pages/ReporteGanancias";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="categorias" element={<CategoriaProductoList />} />
        <Route path="proveedores" element={<ProveedoresList />} />
        <Route path="productos" element={<ProductosList />} />
        <Route path="compras" element={<CompraList />} />
        <Route path="ventas" element={<VentasList />} />
        <Route path="reporte-compras" element={<ReporteCompras />} />
        <Route path="reportes-ventas" element={<ReporteVentas />} />
        <Route path="reporte-ganancias" element={<ReporteGanancias />} />
      </Route>
    </Routes>
  );
}
