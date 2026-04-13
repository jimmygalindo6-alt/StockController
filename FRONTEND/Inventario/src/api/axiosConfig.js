import axios from "axios";

// Configuración de Axios para apuntar a tu backend de Django
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // Cambia si tu ruta es distinta
});

export default api;
