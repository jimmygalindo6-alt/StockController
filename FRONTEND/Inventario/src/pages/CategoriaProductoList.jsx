import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

export default function CategoriaProductoList() {
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
  nombre: "",
  descripcion: "",
 });

 const resetFormulario = () => {
  setFormData({ nombre: "", descripcion: "" });
  setEditando(false);
  setIdActual(null);
};

const cargarCategorias = () => {
  api.get("categorias/")
    .then((response) => {
      setCategorias(response.data);
    });
};
  
  const [editando, setEditando] = useState(false);
  const [idActual, setIdActual] = useState(null);

  const guardarCategoria = () => {
  if (editando) {
    // EDITAR
    api.put(`categorias/${idActual}/`, formData)
      .then(() => {
        cargarCategorias();
        resetFormulario();
      });
  } else {
    // CREAR
    api.post("categorias/", formData)
      .then(() => {
        cargarCategorias();
        resetFormulario();
      });
  }
};

const eliminarCategoria = (id) => {
  if (window.confirm("¿Seguro que deseas eliminar esta categoría?")) {
    api.delete(`categorias/${id}/`)
      .then(() => {
        cargarCategorias();
      });
  }
};

const editarCategoria = (categoria) => {
  setFormData({
    nombre: categoria.nombre,
    descripcion: categoria.descripcion,
  });
  setIdActual(categoria.id);
  setEditando(true);
};

  useEffect(() => {
  cargarCategorias();
}, []);

  return (
    <div className="card shadow">
      <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
        Categorías de Productos
      </div>

      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}

        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.length > 0 ? (
              categorias.map((categoria) => (
                <tr key={categoria.id}>
                  <td>{categoria.id}</td>
                  <td>{categoria.nombre}</td>
                  <td>{categoria.descripcion}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => editarCategoria(categoria)}>
                    <i className="bi bi-pencil"></i></button>
                    
                    <button className="btn btn-sm btn-danger" onClick={() => eliminarCategoria(categoria.id)} >
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
        placeholder="Descripción"
        value={formData.descripcion}
        onChange={(e) =>
          setFormData({ ...formData, descripcion: e.target.value })
        }
      />
    </div>

    <div className="col-md-5 mt-2">
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="estadoCategoria"
            checked={formData.estado}
            onChange={(e) =>
              setFormData({ ...formData, estado: e.target.checked })
            }
          />
          <label className="form-check-label" htmlFor="estadoCategoria">
            Activo
          </label>
        </div>
      </div>

    <div className="col-md-2">
      <button
        className={`btn ${editando ? "btn-warning" : "btn-success"} w-100`}
        onClick={guardarCategoria}
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
