import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// Importaciones para exportar a PDF
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// Importaciones para exportar a excel
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function ReporteVentas() {
    const [todasLasVentas, setTodasLasVentas] = useState([]);
    const [ventas, setVentas] = useState([]);
    const [activarRango, setActivarRango] = useState(false);
    const [tipoBusqueda, setTipoBusqueda] = useState("");
    const [textoBusqueda, setTextoBusqueda] = useState("");

    // Estado para almacenar el detalle de la venta seleccionada
    const [todosLosDetalles, setTodosLosDetalles] = useState([]);

    // Modal
    const [mostrarModal, setMostrarModal] = useState(false);
    const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

    // Obtener la fecha actual en formato YYYY-MM-DD para usar como valor predeterminado
    const hoy = new Date().toISOString().split('T')[0];
    const [fecha1, setFecha1] = useState(hoy);
    const [fecha2, setFecha2] = useState(hoy);

    // Cargar todas las ventas al inicio
    const cargarVentas = async () => {
        const response = await fetch("http://127.0.0.1:8000/api/ventas/");
        const data = await response.json();
        setTodasLasVentas(data);
    };

    // Cargar detalles de una venta (si es necesario)
    const cargarDetalles = async (id) => {
        const response = await fetch(`http://127.0.0.1:8000/api/detalleVentas/`);
        const data = await response.json();
        setTodosLosDetalles(data);
        return data;
    };

    // Función para buscar ventas según los filtros seleccionados
    const buscarVentas = () => {

        let resultados = [...todasLasVentas];

        // RANGO DE FECHA
        if (activarRango) {

            if (!fecha1 || !fecha2) {
                alert("Seleccione ambas fechas");
                return;
            }

            resultados = resultados.filter(venta =>
                venta.fecha >= fecha1 && venta.fecha <= fecha2
            );
        }

        // 🔎 FACTURA O PROVEEDOR
        else {

            if (!tipoBusqueda || !textoBusqueda.trim()) {
                alert("Seleccione tipo de búsqueda y escriba un valor");
                return;
            }

            if (tipoBusqueda === "factura") {
                resultados = resultados.filter(venta =>
                    venta.n_factura.toLowerCase().includes(textoBusqueda.toLowerCase())
                );
            }

            if (tipoBusqueda === "cliente") {
                resultados = resultados.filter(venta =>
                    venta.cliente.toLowerCase().includes(textoBusqueda.toLowerCase())
                );
            }
        }

        setVentas(resultados);
    };

    // Función para imprimir la venta seleccionada

    const imprimirVenta = () => {
        const contenido = document.getElementById("areaReporte").innerHTML;
        const ventana = window.open("", "", "width=900,height=700");

        ventana.document.write(`
        <html>
            <head>
                <title>Factura</title>
                <link 
                    rel="stylesheet" 
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
                />
            </head>
            <body>
                ${contenido}
            </body>
        </html>
    `);

        ventana.document.close();
        ventana.print();
    };

    // Función para exportar la venta seleccionada a PDF

    const exportarPDF = (venta) => {
        const doc = new jsPDF();

        doc.setFontSize(14);
        doc.text("REPORTE DEL DETALLE DE LA VENTA", 14, 15);

        doc.setFontSize(10);
        doc.text(`Factura: ${venta.n_factura}`, 14, 25);
        doc.text(`Cliente: ${venta.cliente}`, 14, 30);
        doc.text(`Fecha: ${venta.fecha}`, 14, 35);

        const detalles = venta.detalles.map(det => [
            det.producto_nombre,
            det.cantidad,
            `$${det.subtotal}`
        ]);

        autoTable(doc, {
            startY: 45,
            head: [["Producto", "Cantidad", "Subtotal"]],
            body: detalles
        });

        doc.text(
            `Total: $${venta.total}`,
            150,
            doc.lastAutoTable.finalY + 10
        );

        doc.save(`Factura_${venta.n_factura}.pdf`);

        doc.save(`Venta_${venta.n_factura}.pdf`);
    };


    useEffect(() => {
        cargarVentas();
        cargarDetalles();
    }, []);

    return (
        <div className="container mt-4">

            <h4 className="fw-bold">REPORTE DE VENTAS</h4>

            {/* FILTROS */}
            <div className="card shadow-sm p-4">

                {/* Tipo de búsqueda */}
                {!activarRango && (
                    <div className="row mb-3">

                        <div className="col-md-4">
                            <label className="fw-bold">Búsqueda</label>
                            <select
                                className="form-select"
                                value={tipoBusqueda}
                                onChange={(e) => setTipoBusqueda(e.target.value)}
                            >
                                <option value="">Seleccione</option>
                                <option value="factura">No. Factura</option>
                                <option value="cliente">Cliente</option>
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="fw-bold">Escriba</label>
                            <input
                                type="text"
                                className="form-control"
                                value={textoBusqueda}
                                onChange={(e) => setTextoBusqueda(e.target.value)}
                            />
                        </div>

                    </div>
                )}

                {/* Activar rango */}
                <div className="form-check mb-3">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={activarRango}
                        onChange={() => setActivarRango(!activarRango)}
                    />
                    <label className="form-check-label fw-bold">
                        Activar búsqueda por rango de fecha
                    </label>
                </div>

                {activarRango && (
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <label>Fecha 1</label>
                            <input
                                type="date"
                                className="form-control"
                                value={fecha1}
                                onChange={(e) => setFecha1(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <label>Fecha 2</label>
                            <input
                                type="date"
                                className="form-control"
                                value={fecha2}
                                onChange={(e) => setFecha2(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                <div className="mt-3">
                    <button
                        className="btn btn-success"
                        onClick={buscarVentas}
                    >
                        Buscar
                    </button>
                </div>
            </div>



            {/* TABLA */}
            <div className="card shadow-sm mt-4">
                <div className="card-body">

                    <h6 className="fw-bold mb-3">
                        Cuadro de lista según la búsqueda
                    </h6>

                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">

                            <thead className="table-dark text-center">
                                <tr>
                                    <th>No. Factura</th>
                                    <th>Cliente</th>
                                    <th>Fecha</th>
                                    <th>Total</th>
                                    <th>Ver</th>
                                </tr>
                            </thead>

                            <tbody className="text-center">

                                {ventas.length === 0 ? (
                                    <tr>
                                        <td colSpan="5">No hay resultados</td>
                                    </tr>
                                ) : (
                                    ventas.map((venta) => (
                                        <tr key={venta.id}>
                                            <td>{venta.n_factura}</td>
                                            <td>{venta.cliente}</td>
                                            <td>{venta.fecha}</td>
                                            <td>${venta.total}</td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-primary"
                                                    onClick={() => {
                                                        const detallesfiltrados = todosLosDetalles.filter(
                                                            det => det.venta === venta.id);
                                                        setVentaSeleccionada({ ...venta, detalles: detallesfiltrados });
                                                        setMostrarModal(true);
                                                    }}>
                                                    <i className="bi bi-eye-fill"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}

                            </tbody>

                        </table>

                        {mostrarModal && ventaSeleccionada && (
                            <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                                <div className="modal-dialog modal-xl">
                                    <div className="modal-content p-4">

                                        {/* BOTÓN CERRAR */}
                                        <div className="text-end">
                                            <button
                                                className="btn-close"
                                                onClick={() => setMostrarModal(false)}
                                            ></button>
                                        </div>

                                        {/* ===== HOJA DE REPORTE ===== */}
                                        <div id="areaReporte" className="p-4" style={{ background: "white" }}>

                                            {/* ENCABEZADO */}
                                            <div className="text-center mb-3">
                                                <h5 className="fw-bold">REPORTE DEL DETALLE DE LA VENTA</h5>
                                                <div>REPUESTOS DE MOTOS GALINDO S.A</div>
                                                <div>SISTEMA CONTROL DE INVENTARIO</div>
                                            </div>

                                            <div className="text-end mb-3">
                                                <small>
                                                    <strong>Fecha Reporte:</strong>{" "}
                                                    {new Date().toLocaleDateString()}
                                                </small>
                                            </div>

                                            {/* DATOS VENTA */}
                                            <div className="mb-3">
                                                <p><strong>Factura No:</strong> {ventaSeleccionada.n_factura}</p>
                                                <p><strong>Fecha de Venta:</strong> {ventaSeleccionada.fecha}</p>
                                                <p><strong>Cliente:</strong> {ventaSeleccionada.cliente}</p>
                                            </div>

                                            {/* DETALLE */}
                                            <h6 className="fw-bold">Detalle de Ventas</h6>
                                            <hr />

                                            <table className="table table-bordered">
                                                <thead className="table-light text-center">
                                                    <tr>
                                                        <th>Producto</th>
                                                        <th>Cantidad</th>
                                                        <th>Subtotal</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {ventaSeleccionada.detalles?.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{item.producto_nombre}</td>
                                                            <td className="text-center">{item.cantidad}</td>
                                                            <td className="text-end">${item.subtotal}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                            {/* TOTAL */}
                                            <div className="text-end mt-3">
                                                <h5 className="fw-bold">
                                                    Total: ${ventaSeleccionada.total}
                                                </h5>
                                            </div>

                                        </div>

                                        {/* BOTONES */}
                                        <div className="text-end mt-4">
                                            <button
                                                className="btn btn-secondary me-2"
                                                onClick={() => imprimirVenta()}
                                            >
                                                Imprimir
                                            </button>

                                            <button
                                                className="btn btn-danger"
                                                onClick={() => exportarPDF(ventaSeleccionada)}
                                            >
                                                Descargar PDF
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                </div>
            </div>

        </div>
    );

}
export default ReporteVentas;
