import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

export default function ProductosList() {

    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [proveedores, setProveedores] = useState([]);

    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        costo: 0,
        precio: 0,
        stock: 0,
        estado: true,
        categoria: 0,
        proveedor: 0,
    });


    const resetFormulario = () => {
        setFormData({ nombre: "", descripcion: "", costo: 0, precio: 0, stock: 0, estado: true, categoria: 0, proveedor: 0 });
        setEditando(false);
        setIdActual(null);
    };


    const [editando, setEditando] = useState(false);
    const [idActual, setIdActual] = useState(null);


    const [error, setError] = useState(null);

    const cargarProductos = () => {
        api.get("productos/")
            .then((response) => {
                setProductos(response.data);
            })
            .catch((error) => {
                console.error("Error al cargar productos:", error);
                setError("No se pudieron cargar los productos.");
            });
    };

    const cargarCategorias = () => {
        api.get("categorias/")
            .then((response) => {
                setCategorias(response.data);
            });
    };

    const cargarProveedores = () => {
        api.get("proveedores/")
            .then((response) => {
                setProveedores(response.data);
            });
    };

    const guardarProducto = () => {

        if (editando) {
            // EDITAR
            api.put(`productos/${idActual}/`, formData)
                .then(() => {
                    cargarProductos();
                    resetFormulario();
                });
        } else {
            // CREAR
            api.post("productos/", formData)
                .then(() => {
                    cargarProductos();
                    resetFormulario();
                });
        }
    };

    const eliminarProducto = (id) => {
        if (window.confirm("¿Seguro que deseas eliminar este producto?")) {
            api.delete(`productos/${id}/`)
                .then(() => {
                    cargarProductos();
                });
        }
    };

    const editarProducto = (producto) => {
        setFormData({
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            costo: producto.costo,
            precio: producto.precio,
            stock: producto.stock,
            estado: producto.estado,
            categoria: producto.categoria,
            proveedor: producto.proveedor,
        });

        setIdActual(producto.id);
        setEditando(true);
    };

    useEffect(() => {
        cargarProductos();
        cargarCategorias();
        cargarProveedores();
    }, []);

    return (
        <div className="card shadow">
            <div className="card-header bg-dark text-white">
                Productos
            </div>

            <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}

                <table className="table table-bordered table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>ID</th>
                            <th>Categoría</th>
                            <th>Proveedor</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Costo</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.length > 0 ? (
                            productos.map((producto) => (
                                <tr key={producto.id}>
                                    <td>{producto.id}</td>
                                    <td>{producto.categoria_nombre}</td>
                                    <td>{producto.proveedor_nombre}</td>
                                    <td>{producto.nombre}</td>
                                    <td>{producto.descripcion}</td>
                                    <td>{producto.costo}</td>
                                    <td>{producto.precio}</td>
                                    <td>{producto.stock}</td>
                                    <td>{producto.estado ? "Activo" : "Inactivo"}</td>
                                    <td>
                                        <button className="btn btn-sm btn-warning me-2" onClick={() => editarProducto(producto)}>
                                            <i className="bi bi-pencil"></i></button>

                                        <button className="btn btn-sm btn-danger" onClick={() => eliminarProducto(producto.id)} >
                                            <i className="bi bi-trash"></i></button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    No hay productos registrados
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="card p-3 mb-3">
                    <div className="row">

                        {/* IZQUIERDA */}
                        <div className="col-md-6">

                            <div className="mb-3">
                                <label className="form-label">Categoría</label>
                                <select
                                    className="form-select"
                                    value={formData.categoria}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            categoria: e.target.value === "" ? "" : Number(e.target.value)
                                        })
                                    }
                                >
                                    <option value="">Selecciona una categoría</option>
                                    {categorias.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.nombre}
                                        </option>
                                    ))}
                                </select>

                            </div>

                            <div className="mb-3">
                                <label className="form-label">Proveedor</label>
                                <select
                                    className="form-select"
                                    value={formData.proveedor}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            proveedor: e.target.value === "" ? "" : Number(e.target.value)
                                        })
                                    }
                                >
                                    <option value="">Selecciona un proveedor</option>
                                    {proveedores.map((prov) => (
                                        <option key={prov.id} value={prov.id}>
                                            {prov.nombre}
                                        </option>
                                    ))}
                                </select>

                            </div>

                            <div className="mb-3">
                                <label className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.nombre || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, nombre: e.target.value })
                                    }
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Descripción</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.descripcion || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, descripcion: e.target.value })
                                    }
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Costo</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={formData.costo || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, costo: parseFloat(e.target.value) || 0 })
                                    }
                                />
                            </div>

                        </div>

                        {/* DERECHA */}
                        <div className="col-md-6">

                            <div className="mb-3">
                                <label className="form-label">Precio</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={formData.precio || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, precio: parseFloat(e.target.value) || 0 })
                                    }
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Stock</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={formData.stock || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })
                                    }
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Estado</label>
                                <select
                                    className="form-select"
                                    value={formData.estado ? "true" : "false"}
                                    onChange={(e) =>
                                        setFormData({ ...formData, estado: e.target.value === "true" })
                                    }
                                >
                                    <option value="true">Activo</option>
                                    <option value="false">Inactivo</option>
                                </select>
                            </div>

                            <div className="mt-4">
                                <button
                                    className={`btn ${editando ? "btn-warning" : "btn-success"} w-100`}
                                    onClick={guardarProducto}
                                >
                                    {editando ? "Actualizar" : "Guardar"}
                                </button>
                            </div>

                        </div>

                    </div>
                </div>


            </div>
        </div>
    );
}