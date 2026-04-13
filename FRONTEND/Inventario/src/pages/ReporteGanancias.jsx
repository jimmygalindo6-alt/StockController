import React from "react";
import { useState, useEffect } from "react";

const ReporteGanancias = () => {

    // Estado para almacenar las ganancias
    const [tipoFiltro, setTipoFiltro] = useState("");
    const [usarRango, setUsarRango] = useState(false);
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [ventas, setVentas] = useState([]);
    const [totalGanancia, setTotalGanancia] = useState(0);
    const [detallesVentas, setdetalle] = useState([]);


     // Obtener la fecha actual en formato YYYY-MM-DD para usar como valor predeterminado
        const hoy = new Date().toISOString().split('T')[0];
        const [fecha1, setFecha1] = useState(hoy);
        const [fecha2, setFecha2] = useState(hoy);

    // Función para obtener el rango de fechas según el filtro seleccionado
    const obtenerRangoFechas = () => {
        const hoy = new Date();
        let inicio = new Date();
        let fin = new Date();

        if (usarRango) {
            return {
                inicio: fecha1,
                fin: fecha2
            };
        }

        switch (tipoFiltro) {
            case "semanal":
                const diaSemana = hoy.getDay();
                const lunes = hoy.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1);
                inicio = new Date(hoy.setDate(lunes));
                break;

            case "mensual":
                inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
                break;

            case "anual":
                inicio = new Date(hoy.getFullYear(), 0, 1);
                break;

            default:
                return null;
        }

        return {
            inicio: inicio.toISOString().split("T")[0],
            fin: new Date().toISOString().split("T")[0]
        };
    };


    // Función para calcular la ganancia de cada venta
    const calcularGanancia = (venta) => {
        return (venta.precio - venta.costo) * venta.cantidad;
    };

    // Función para obtener las ventas desde el backend
    const total = ventas.reduce((acc, venta) => {
        return acc + calcularGanancia(venta);
    }, 0);


    const cargarVentas = async (fechaInicio, fechaFin) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/detallesVentas/`
            );
            const data = await response.json();
            setdetalle(data);
        } catch (error) {
            console.error("Error al cargar ventas:", error);
        }
    };

    // Función para buscar el reporte de ganancias
    const buscarReporte = async () => {
        // Validar que se haya seleccionado un filtro o rango
        const rango = obtenerRangoFechas();
        if (!rango) {
            alert("Seleccione un tipo de filtro");
            return;
        }

        try {

            const data = detallesVentas;
            setVentas(data);

            // Calcular total
            const total = data.reduce((acc, venta) => {
                return acc + calcularGanancia(venta);
            }, 0);

            setTotalGanancia(total);

        } catch (error) {
            console.error("Error al obtener reporte:", error);
        }
    };

    return (
        <div className="container mt-4">

            {/* TÍTULO */}
            <div className="row mb-3">
                <div className="col">
                    <h3 className="fw-bold">Reporte de Ganancias / Ingresos</h3>
                    <hr />
                </div>
            </div>

            {/* CARD FILTROS */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">

                    <div className="row align-items-end">

                        {/* SELECT TIPO FILTRO */}
                        <div className="col-md-3">
                            <label className="form-label">Tipo de búsqueda</label>
                            <select
                                className="form-select"
                                value={tipoFiltro}
                                onChange={(e) => setTipoFiltro(e.target.value)}
                            >
                                <option value="">Seleccione</option>
                                <option value="semanal">Semanal</option>
                                <option value="mensual">Mensual</option>
                                <option value="anual">Anual</option>
                            </select>
                        </div>

                        {/* CHECKBOX RANGO */}
                        <div className="col-md-3">
                            <div className="form-check mt-4">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={usarRango}
                                    onChange={() => setUsarRango(!usarRango)}
                                />
                                <label className="form-check-label">
                                    Usar rango de fechas
                                </label>
                            </div>
                        </div>

                        {/* FECHA INICIO */}
                        {usarRango && (
                            <>
                                <div className="col-md-2">
                                    <label className="form-label">Fecha Inicio</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={fecha1}
                                        onChange={(e) => setFecha1(e.target.value)}
                                    />
                                </div>

                                <div className="col-md-2">
                                    <label className="form-label">Fecha Fin</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={fecha2}
                                        onChange={(e) => setFecha2(e.target.value)}
                                    />
                                </div>
                            </>
                        )}

                        {/* BOTÓN BUSCAR */}
                        <div className="col-md-2">
                            <button className="btn btn-primary w-100" onClick={buscarReporte}>
                                Buscar
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* CARD TOTAL GANANCIA */}
            <div className="card bg-success text-white mb-4 shadow-sm">
                <div className="card-body d-flex justify-content-between">
                    <h5 className="mb-0">Total de Ganancia del Período</h5>
                    <h4 className="mb-0">$ 0.00</h4>
                </div>
            </div>

            {/* TABLA DETALLE */}
            <div className="card shadow-sm">
                <div className="card-body table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>Fecha Venta</th>
                                <th>Producto</th>
                                <th>Costo</th>
                                <th>Precio Venta</th>
                                <th>Cantidad</th>
                                <th>Ganancia</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventas.length > 0 ? (
                                ventas.map((venta, index) => {
                                    const ganancia = calcularGanancia(venta);

                                    return (
                                        <tr key={index}>
                                            <td>{venta.fechaVenta}</td>
                                            <td>{venta.producto}</td>
                                            <td>${venta.costo}</td>
                                            <td>${venta.precio}</td>
                                            <td>{venta.cantidad}</td>
                                            <td className="fw-bold text-success">
                                                ${ganancia.toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        No hay datos para mostrar
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>

    );
}
export default ReporteGanancias;