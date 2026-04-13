import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

export default function ProveedoresList() {
  
  //Estados para proveedores
  const [proveedores, setProveedores] = useState([]);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
  nombre: "",
  ruc: "",
  direccion: "",
  telefono: "",
  email: "",
  estado: true,
 });

 const resetFormulario = () => {
  setFormData({ nombre: "", ruc: "", direccion: "", telefono: "", email: "", estado: true });
  setEditando(false);
  setIdActual(null);
};

//Funciones para proveedores
const cargarProveedores = () => {
  api.get("proveedores/")
    .then((response) => {
      setProveedores(response.data);
    });
};
  
//Estados para edición
  const [editando, setEditando] = useState(false);
  const [idActual, setIdActual] = useState(null);

  const guardarProveedor = () => {
  if (editando) {
    // EDITAR
    api.put(`proveedores/${idActual}/`, formData)
      .then(() => {
        cargarProveedores();
        resetFormulario();
      });
  } else {
    // CREAR
    api.post("proveedores/", formData)
      .then(() => {
        cargarProveedores();
        resetFormulario();
      });
  }
};

const eliminarProveedor = (id) => {
  if (window.confirm("¿Seguro que deseas eliminar este proveedor?")) {
    api.delete(`proveedores/${id}/`)
      .then(() => {
        cargarProveedores();
      });
  }
};

const editarProveedor = (proveedor) => {
  setFormData({
    nombre: proveedor.nombre,
    ruc: proveedor.ruc,
    direccion: proveedor.direccion,
    telefono: proveedor.telefono,
    email: proveedor.email,
    estado: proveedor.estado,
  });
  setIdActual(proveedor.id);
  setEditando(true);
};


   useEffect(() => {
  cargarProveedores();
}, []);

// Renderizado del componente
  return (
    <div className="card shadow">
      <div className="card-header bg-dark text-white">
        Proveedores
      </div>

      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}

        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>ruc</th>
                <th>Dirección</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Estado</th>
                <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.length > 0 ? (
              proveedores.map((proveedor) => (
                <tr key={proveedor.id}>
                  <td>{proveedor.id}</td>
                  <td>{proveedor.nombre}</td>
                  <td>{proveedor.ruc}</td>
                  <td>{proveedor.direccion}</td>
                  <td>{proveedor.telefono}</td>
                  <td>{proveedor.email}</td>
                  <td>{proveedor.estado ? "Activo" : "Inactivo"}</td>
                   <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => editarProveedor(proveedor)}>
                    <i className="bi bi-pencil"></i></button>
                    
                    <button className="btn btn-sm btn-danger" onClick={() => eliminarProveedor(proveedor.id)} >
                    <i className="bi bi-trash"></i></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No hay registros
                </td>
              </tr>
            )}
          </tbody>
        </table>

  <div className="card p-3 mb-3">
  <div className="row">
    
    <div className="col-md-5">
      <input
        type="text"
        className="form-control"
        placeholder="Nombre"
        value={formData.nombre}
        onChange={(e) =>
          setFormData({ ...formData, nombre: e.target.value })
        }
      />
    </div>

    <div className="col-md-5">
      <input
        type="text"
        className="form-control"
        placeholder="ruc"
        value={formData.ruc}
        onChange={(e) =>
          setFormData({ ...formData, ruc: e.target.value })
        }
      />
    </div>

        <div className="col-md-5 mt-2">
        <input
            type="text"
            className="form-control"
            placeholder="Dirección"
            value={formData.direccion}
            onChange={(e) =>
              setFormData({ ...formData, direccion: e.target.value })
            }
          />
        </div>

        <div className="col-md-5 mt-2">
        <input
            type="text"
            className="form-control"
            placeholder="Teléfono"
            value={formData.telefono}
            onChange={(e) =>
              setFormData({ ...formData, telefono: e.target.value })
            }
          />
        </div>

        <div className="col-md-5 mt-2">
        <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        <div className="col-md-5 mt-2">
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="estadoProveedor"
            checked={formData.estado}
            onChange={(e) =>
              setFormData({ ...formData, estado: e.target.checked })
            }
          />
          <label className="form-check-label" htmlFor="estadoProveedor">
            Activo
          </label>
        </div>
        </div>  

    <div className="col-md-2 mt-2" style={{ marginBottom: "50px" }}>
      <button
        className={`btn ${editando ? "btn-warning" : "btn-success"} w-100`}
        onClick={guardarProveedor}
      >
        {editando ? "Actualizar" : "Guardar"}
      </button>
    </div>
  </div>
</div>

      </div>
    </div>
  );
}
