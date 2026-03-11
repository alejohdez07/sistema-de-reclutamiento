/**
 * ============================================
 * API UTILITIES - Sistema de Reclutamiento
 * ============================================
 * Funciones reutilizables para interactuar con la API
 */

const API_CONFIG = {
    BASE_URL: 'http://localhost:3000/api',
    TIMEOUT: 10000,
    HEADERS: {
        'Content-Type': 'application/json'
    }
};

async function hacerPeticion(endpoint, metodo = 'GET', datos = null) {
    try {
        const opciones = {
            method: metodo,
            headers: API_CONFIG.HEADERS
        };

        if (datos && (metodo === 'POST' || metodo === 'PUT' || metodo === 'PATCH')) {
            opciones.body = JSON.stringify(datos);
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
        opciones.signal = controller.signal;

        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, opciones);
        clearTimeout(timeoutId);

        if (!response.ok) {
            let mensajeError = `Error HTTP ${response.status}`;
            try {
                const errorData = await response.json();
                if (errorData.message) {
                    mensajeError = errorData.message;
                }
            } catch (e) {
                mensajeError = `${metodo} ${endpoint} falló con estado ${response.status}`;
            }
            throw new Error(mensajeError);
        }

        const resultado = await response.json();
        return resultado;
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('La solicitud tardó demasiado tiempo. Intente de nuevo.');
        }
        throw error;
    }
}

// Candidatos
async function obtenerCandidatos() {
    return await hacerPeticion('/candidatos');
}

async function obtenerCandidato(id) {
    return await hacerPeticion(`/candidatos/${id}`);
}

async function crearCandidato(datos) {
    return await hacerPeticion('/candidatos', 'POST', datos);
}

async function actualizarCandidato(id, datos) {
    return await hacerPeticion(`/candidatos/${id}`, 'PUT', datos);
}

async function eliminarCandidato(id) {
    return await hacerPeticion(`/candidatos/${id}`, 'DELETE');
}

// Vacantes
async function obtenerVacantes() {
    return await hacerPeticion('/vacantes');
}

async function obtenerVacante(id) {
    return await hacerPeticion(`/vacantes/${id}`);
}

async function crearVacante(datos) {
    return await hacerPeticion('/vacantes', 'POST', datos);
}

async function actualizarVacante(id, datos) {
    return await hacerPeticion(`/vacantes/${id}`, 'PUT', datos);
}

async function eliminarVacante(id) {
    return await hacerPeticion(`/vacantes/${id}`, 'DELETE');
}

// Postulaciones
async function obtenerPostulaciones() {
    return await hacerPeticion('/postulaciones');
}

async function obtenerPostulacionesPorVacante(idVacante) {
    return await hacerPeticion(`/postulaciones/vacante/${idVacante}`);
}

async function crearPostulacion(datos) {
    return await hacerPeticion('/postulaciones', 'POST', datos);
}

async function actualizarEstadoPostulacion(id, estado) {
    return await hacerPeticion(`/postulaciones/${id}/estado`, 'PATCH', { estado });
}

// Notas
async function crearNota(datos) {
    return await hacerPeticion('/notas', 'POST', datos);
}

// Auth
async function login(email, password) {
    return await hacerPeticion('/auth/login', 'POST', { email, password });
}

// Estadisticas
async function obtenerEstadisticas() {
    return await hacerPeticion('/estadisticas/dashboard');
}

// Utilidades
function mostrarAlerta(mensaje, tipo = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} alert-dismissible fade show`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        ${mensaje}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    `;
    
    const container = document.getElementById('alertContainer') || document.body;
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => alertDiv.remove(), 5000);
    return alertDiv;
}

function formatearFecha(fecha) {
    if (!fecha) return '-';
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-CO');
}

function formatearMoneda(cantidad) {
    return '$' + parseFloat(cantidad).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Disponibilizar globalmente
window.API = {
    hacerPeticion,
    obtenerCandidatos,
    obtenerCandidato,
    crearCandidato,
    actualizarCandidato,
    eliminarCandidato,
    obtenerVacantes,
    obtenerVacante,
    crearVacante,
    actualizarVacante,
    eliminarVacante,
    obtenerPostulaciones,
    obtenerPostulacionesPorVacante,
    crearPostulacion,
    actualizarEstadoPostulacion,
    crearNota,
    login,
    obtenerEstadisticas,
    mostrarAlerta,
    formatearFecha,
    formatearMoneda
};

console.log('%c✅ API de Reclutamiento cargada', 'color: green; font-weight: bold;');

