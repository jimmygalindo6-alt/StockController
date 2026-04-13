import { use, useEffect, useState } from "react";
import api from "../api/axiosConfig";

export default function CompraList() {

    // Estados para manejar datos de proveedores y productos, así como los seleccionados en el formulario
    const [proveedores, setProveedores] = useState([]);
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [compras, setCompras] = useState([]);

    // Estados para manejar los datos del formulario de compra
    const [numeroFactura, setNumeroFactura] = useState("");
    const [proveedorSeleccionado, setProveedorSeleccionado] = useState("");
    const [productoSeleccionado, setProductoSeleccionado] = useState("");
    const [costo, setCosto] = useState("");

    // Estado para manejar la fecha de la compra
    const [fecha, setFecha] = useState("");


    // Estado para manejar el detalle temporal de la compra antes de guardarla
    const [cantidad, setCantidad] = useState("");
    const [detalleCompra, setDetalleCompra] = useState([]);


    // Función para agregar un producto al detalle temporal de la compra
    const agregarProducto = () => {

        if (!proveedorSeleccionado) {
            alert("Debe seleccionar un proveedor primero");
            return;
        }

        if (!productoSeleccionado || !cantidad || cantidad <= 0) {
            alert("Completa los datos correctamente");
            return;
        }

        const producto = productosFiltrados.find(
            (p) => p.id == productoSeleccionado
        );

        if (!producto) return;

        if (!proveedorSeleccionado) {
            alert("Debe seleccionar un proveedor primero");
            return;
        }

        const subtotal = parseFloat(costo) * parseInt(cantidad);

        const nuevoItem = {
            id: producto.id,
            nombre: producto.nombre,
            cantidad: parseInt(cantidad),
            costo: parseFloat(costo),
            subtotal: subtotal
        };

        setDetalleCompra([...detalleCompra, nuevoItem]);

        // limpiar campos
        setProductoSeleccionado("");
        setCantidad("");
    };

    // Función para eliminar un producto del detalle temporal de la compra
    const eliminarItem = (index) => {
        const nuevosItems = detalleCompra.filter(
            (_, i) => i !== index
        );

        setDetalleCompra(nuevosItems);
    };

    // Calcular el total de la compra sumando los subtotales de cada producto en el detalle
    const total = detalleCompra.reduce(
        (acc, item) => acc + item.subtotal,
        0);

    // Función para guardar la compra, que incluye crear la compra, el detalle y actualizar el stock de los productos
    const guardarCompra = async () => {

        if (!proveedorSeleccionado) {
            alert("Seleccione un proveedor");
            return;
        }

        if (detalleCompra.length === 0) {
            alert("Agregue al menos un producto");
            return;
        }

        if (!numeroFactura.trim()) {
            alert("Ingrese el número de factura");
            return;
        }

        try {

            // 1️⃣ Crear compra
            const compraResponse = await fetch("http://127.0.0.1:8000/api/compras/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    proveedor: parseInt(proveedorSeleccionado),
                    n_factura: numeroFactura,
                    fecha: fecha,
                    total: parseFloat(total)
                })
            });

            const compraData = await compraResponse.json();

            // 2️⃣ Crear detalles y actualizar stock
            for (let item of detalleCompra) {

                // Crear detalle
                await fetch("http://127.0.0.1:8000/api/detalleCompras/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        compra: compraData.id,
                        producto: item.id,
                        cantidad: item.cantidad,
                        precio_unitario: item.costo,
                        subtotal: item.subtotal
                    })
                });

                // Obtener producto actual
                const productoResponse = await fetch(
                    `http://127.0.0.1:8000/api/productos/${item.id}/`
                );

                const productoData = await productoResponse.json();

                // Actualizar stock sumando
                await fetch(
                    `http://127.0.0.1:8000/api/productos/${item.id}/`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            ...productoData,
                            stock: productoData.stock + item.cantidad
                        })
                    }
                );
            }

            alert("Compra guardada correctamente");

            // Limpiar formulario
            setDetalleCompra([]);
            setProveedorSeleccionado("");
            setNumeroFactura("");

        } catch (error) {
            console.error("Error:", error);
        }
    };


    // Cargar datos de proveedores y productos al montar el componente
    const cargarProveedores = () => {
        api.get("proveedores/")
            .then((response) => {
                setProveedores(response.data);
            });
    };

    const cargarProductos = () => {
        api.get("productos/")
            .then((response) => {
                setProductos(response.data);
            });
    };

    const cargarCompras = () => {
        api.get("compras/")
            .then((response) => {
                setCompras(response.data);
            });
    };

    // Función para manejar el cambio de proveedor y filtrar los productos asociados a ese proveedor
    const handleProveedorChange = (e) => {
        const idProveedor = e.target.value;
        console.log("Proveedor seleccionado:", idProveedor);
        setProveedorSeleccionado(idProveedor);

        const filtrados = productos.filter(
            (prod) => prod.proveedor == idProveedor
        );

        setProductosFiltrados(filtrados);
    };

    // Función para manejar el cambio de producto y actualizar el costo automáticamente
    const handleProductoChange = (e) => {
        const idProducto = e.target.value;
        setProductoSeleccionado(idProducto);

        const producto = productosFiltrados.find(
            (prod) => prod.id == idProducto
        );

        if (producto) {
            setCosto(producto.costo);
        }
    };

    // Filtrar productos para mostrar solo los que están activos
    useEffect(() => {
        cargarProveedores();
        cargarProductos();
        cargarCompras();
        const hoy = new Date().toISOString().split("T")[0];
        setFecha(hoy);
    }, []);

    return (
        <div className="container mt-4">

            <div className="card">
                <div className="card-header bg-dark text-white">
                    Registro de Compra
                </div>

                <div className="card-body">

                    {/* ============================= */}
                    {/* 1️⃣ DATOS GENERALES */}
                    {/* ============================= */}

                    <div className="row mb-4">
                        <div className="col-md-4">
                            <label>Proveedor</label>
                            <select
                                className="form-control"
                                value={proveedorSeleccionado}
                                onChange={handleProveedorChange}
                                disabled={detalleCompra.length > 0}
                            >
                                <option value="">Selecciona proveedor</option>
                                {proveedores.map((prov) => (
                                    <option key={prov.id} value={prov.id}>
                                        {prov.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label>Fecha</label>
                            <input type="date" className="form-control" value={fecha}
                                onChange={(e) => setFecha(e.target.value)} />
                        </div>

                        <div className="col-md-4">
                            <label>No. Factura</label>
                            <input type="text" className="form-control"
                                value={numeroFactura}
                                onChange={(e) => setNumeroFactura(e.target.value)} />
                        </div>
                    </div>

                    <hr />

                    {/* ============================= */}
                    {/* 2️⃣ AGREGAR PRODUCTO */}
                    {/* ============================= */}

                    <h5>Agregar Producto</h5>

                    <div className="row mb-3">
                        <div className="col-md-4">
                            <label>Producto</label>
                            <select
                                className="form-control"
                                value={productoSeleccionado}
                                onChange={handleProductoChange}
                                disabled={!proveedorSeleccionado}
                            >
                                <option value="">Selecciona producto</option>
                                {productosFiltrados.map((prod) => (
                                    <option key={prod.id} value={prod.id}>
                                        {prod.nombre}
                                    </option>
                                ))}
                            </select>

                        </div>

                        <div className="col-md-2">
                            <label>Cantidad</label>
                            <input type="number" className="form-control" value={cantidad}
                                onChange={(e) => setCantidad(e.target.value)} />
                        </div>

                        <div className="col-md-2">
                            <label>Costo</label>
                            <input type="number" className="form-control" value={costo} readOnly />
                        </div>

                        <div className="col-md-2 d-flex align-items-end">
                            <button className="btn btn-primary w-100" onClick={agregarProducto}>
                                Agregar
                            </button>
                        </div>
                    </div>

                    {/* ============================= */}
                    {/* 3️⃣ TABLA DETALLE TEMPORAL */}
                    {/* ============================= */}

                    <table className="table table-bordered">
                        <thead className="table-dark">
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Costo</th>
                                <th>Subtotal</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {detalleCompra.length > 0 ? (
                                detalleCompra.map((item, index) => (

                                    <tr key={index}>
                                        <td>{item.nombre}</td>
                                        <td>{item.cantidad}</td>
                                        <td>{item.costo}</td>
                                        <td>{item.subtotal.toFixed(2)}</td>
                                        <td>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => eliminarItem(index)}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        No hay productos agregados
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* ============================= */}
                    {/* 4️⃣ TOTAL Y GUARDAR */}
                    {/* ============================= */}

                    <div className="row">
                        <div className="col-md-8"></div>
                        <div className="col-md-4 text-end">
                            <h4>Total: ${total.toFixed(2)}</h4>
                            <button className="btn btn-success w-100 mt-2"
                                onClick={guardarCompra}>
                                Guardar Compra
                            </button>
                        </div>
                    </div>

                </div>
            </div>

        </div>

    );
}