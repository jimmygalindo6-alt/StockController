import { use, useEffect, useState } from "react";
import api from "../api/axiosConfig";

export default function VentasList() {

    // Estados para manejar los datos del formulario
    const [fecha, setFecha] = useState("");

    // Estado para el número de factura
    const [numeroFactura, setNumeroFactura] = useState("");

    // Estado para almacenar las ventas existentes (simulando una consulta a la API)
    const [ventas, setVentas] = useState([]);
    const [detalleVentas, setDetalleVentas] = useState([]);
    const [cliente, setCliente] = useState("");

    // Estado para almacenar los productos disponibles para el select
    const [productos, setProductos] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState("");

    // Estado para manejar el detalle temporal de la compra antes de guardarla
    const [cantidad, setCantidad] = useState("");
    const [precio, setPrecio] = useState("");

    // Estado para almacenar los productos disponibles (simulando una consulta a la API)
    const cargarProductos = () => {
        api.get("productos/")
            .then((response) => {
                setProductos(response.data);
            });
    };

    // Función para manejar el cambio de producto y actualizar el costo automáticamente
    const handleProductoChange = (e) => {
        const idProducto = e.target.value;

        setProductoSeleccionado(idProducto);

        const producto = productos.find(
            (prod) => prod.id == idProducto
        );

        if (producto) {
            setPrecio(producto.precio); // Asumiendo que el producto tiene un campo precio_venta
        }

    };


    // Función para generar número de factura automáticamente
    const generarNumeroFactura = () => {

        const ruc = "9610";
        const hoy = new Date();
        const dia = String(hoy.getDate()).padStart(2, "0");

        // Obtener compras existentes del día
        const VentasHoy = ventas.filter((vent) => {
            const fechaComp = new Date(vent.fecha);
            return fechaComp.getDate() === hoy.getDate();
        });

        const consecutivo = VentasHoy.length + 1;
        const consecutivoStr = String(consecutivo).padStart(4, "0");

        const numero = `${ruc}-${dia}-${consecutivoStr}`;

        setNumeroFactura(numero);
    };

    // Función para agregar un producto al detalle temporal
    const agregarProducto = () => {

        if (!cliente) {
            alert("Ingresa el nombre del cliente");
            return;
        }

        // Aquí agregarías el producto seleccionado al detalle temporal de la venta
        if (!productoSeleccionado || !cantidad || cantidad <= 0) {
            alert("Selecciona un producto y cantidad");
            return;
        }

        const subtotal = parseFloat(precio) * parseInt(cantidad);

        const nuevoItem = {
            id: productoSeleccionado,
            nombre: productos.find(p => p.id == productoSeleccionado)?.nombre || "Producto no encontrado",
            cantidad: parseInt(cantidad),
            precio: parseFloat(precio),
            subtotal: subtotal
        };

        setDetalleVentas([...detalleVentas, nuevoItem]);

        // Limpiar campos después de agregar
        setProductoSeleccionado("");
        setCantidad("");
        setPrecio("");

    };

    // Función para eliminar un producto del detalle temporal
    const eliminarProducto = (index) => {
        const nuevosItems = detalleVentas.filter(
            (_, i) => i !== index
        );

        setDetalleVentas(nuevosItems);
    };

    // Calcular el total de la compra sumando los subtotales de cada producto en el detalle
    const total = detalleVentas.reduce(
        (acc, item) => acc + item.subtotal,
        0);

    const guardarVenta = async () => {

        if (!cliente.trim()) {
            alert("Ingrese el nombre del cliente");
            return;
        }

        if (detalleVentas.length === 0) {
            alert("Agregue al menos un producto");
            return;
        }

        try {

            // 1️⃣ Crear venta
            const ventaResponse = await fetch("http://127.0.0.1:8000/api/ventas/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    cliente: cliente,
                    n_factura: numeroFactura,
                    fecha: fecha,
                    total: parseFloat(total)
                })
            });

            const ventaData = await ventaResponse.json();

            // 2️⃣ Crear detalles y RESTAR stock
            for (let item of detalleVentas) {

                // Crear detalle
                await fetch("http://127.0.0.1:8000/api/detalleVentas/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        venta: ventaData.id,
                        producto: item.id,
                        cantidad: item.cantidad,
                        precio_unitario: item.precio,
                        subtotal: item.subtotal
                    })
                });

                // Obtener producto actual
                const productoResponse = await fetch(
                    `http://127.0.0.1:8000/api/productos/${item.id}/`
                );

                const productoData = await productoResponse.json();

                // Validar stock antes de restar
                if (productoData.stock < item.cantidad) {
                    alert(`Stock insuficiente para ${productoData.nombre}`);
                    return;
                }

                // Actualizar stock RESTANDO
                await fetch(
                    `http://127.0.0.1:8000/api/productos/${item.id}/`,
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            ...productoData,
                            stock: productoData.stock - item.cantidad
                        })
                    }
                );
            }

            alert("Venta guardada correctamente ✅");

            // Limpiar formulario
            setDetalleVentas([]);
            setCliente("");
            setProductoSeleccionado("");
            setCantidad("");
            setPrecio("");

            generarNumeroFactura();
            cargarProductos();

        } catch (error) {
            console.error("Error:", error);
            alert("Error al guardar la venta");
        }
    };

    // useEffect para cargar datos iniciales, como productos disponibles
    useEffect(() => {
        // Aquí podrías cargar datos iniciales, como productos disponibles

        // Establecer la fecha actual por defecto
        const hoy = new Date().toISOString().split("T")[0];
        setFecha(hoy);

        // Generar número de factura al cargar la página
        generarNumeroFactura();

        // Cargar productos disponibles para el select
        cargarProductos();
    }, []);

    return (

        <div className="container mt-4">

            <div className="card">
                <div className="card-header bg-dark text-white">
                    Registro de Venta
                </div>

                <div className="card-body">

                    {/* ============================= */}
                    {/* 1️⃣ DATOS GENERALES */}
                    {/* ============================= */}

                    <div className="row mb-4">
                        <div className="col-md-4">
                            <label>Cliente</label>
                            <input type="text" className="form-control"
                                value={cliente}
                                onChange={(e) => setCliente(e.target.value)} />
                        </div>

                        <div className="col-md-4">
                            <label>Fecha</label>
                            <input type="date" className="form-control" value={fecha}
                                onChange={(e) => setFecha(e.target.value)} />
                        </div>

                        <div className="col-md-4">
                            <label>No. Factura</label>
                            <input type="text" className="form-control" value={numeroFactura} readOnly />
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
                            <select className="form-control"
                                value={productoSeleccionado}
                                onChange={(e) => handleProductoChange(e)}>
                                <option>Selecciona producto</option>
                                {productos.map((producto) => (
                                    <option key={producto.id} value={producto.id}>
                                        {producto.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-2">
                            <label>Cantidad</label>
                            <input type="number" className="form-control" value={cantidad}
                                onChange={(e) => setCantidad(parseInt(e.target.value) || 0)} />
                        </div>

                        <div className="col-md-2">
                            <label>Precio</label>
                            <input type="number" className="form-control" value={precio} readOnly />
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
                                <th>Precio de venta</th>
                                <th>Subtotal</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {detalleVentas.length > 0 ? (
                                detalleVentas.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.nombre}</td>
                                        <td>{item.cantidad}</td>
                                        <td>{item.precio}</td>
                                        <td>{item.subtotal}</td>
                                        <td>
                                            <button className="btn btn-danger btn-sm" onClick={() => eliminarProducto(index)}>
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
                            onClick={guardarVenta}>
                                Guardar venta
                            </button>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};