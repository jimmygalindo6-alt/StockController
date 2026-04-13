import { Link, Outlet } from "react-router-dom";

// Layout principal que envuelve todas las páginas
export default function MainLayout() {
  return (
    // Estructura básica del layout con header, nav y espacio para contenido
    <div>
      <header className="bg-primary text-white p-3">
        <nav className="navbar navbar-dark bg-primary">
          <div className="container-fluid">
            <img src="/src/assets/logo.png" alt="Logo de la empresa" className="img-fluid me-3 d-inline-block align-middle"
              style={{ width: "50px", height: "50px" }} />
            <span className="navbar-brand mb-0 h1">
              Sistema de Control de Inventario
            </span>
          </div>
        </nav>
      </header>

      {/* Navegación principal con enlaces a las diferentes secciones */}

      <nav className="navbar navbar-expand-lg navbar-custom px-3">
        <div className="container-fluid">

          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">

              {/* Inicio */}
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  <i className="bi bi-house me-1"></i>
                  Inicio
                </Link>
              </li>

              {/* Catálogos */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-folder me-1"></i>
                  Catálogos
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/categorias" className="dropdown-item">
                      Categorías
                    </Link>
                  </li>
                  <li>
                    <Link to="/proveedores" className="dropdown-item">
                      Proveedores
                    </Link>
                  </li>
                  <li>
                    <Link to="/productos" className="dropdown-item">
                      Productos
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Acciones */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-gear me-1"></i>
                  Acciones
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/compras" className="dropdown-item">
                      Compras
                    </Link>
                  </li>
                  <li>
                    <Link to="/ventas" className="dropdown-item">
                      Ventas
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Reportes */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-bar-chart me-1"></i>
                  Reportes
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/reporte-compras" className="dropdown-item">
                      Reporte Compras
                    </Link>
                  </li>
                  <li>
                    <Link to="/reportes-ventas" className="dropdown-item">
                      Reporte Ventas
                    </Link>
                  </li>
                  <li>
                    <Link to="/reporte-ganancias" className="dropdown-item">
                      Ganancias
                    </Link>
                  </li>
                </ul>
              </li>

            </ul>
          </div>
        </div>
      </nav>
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
}
