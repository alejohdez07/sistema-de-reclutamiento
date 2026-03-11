# PLAN DEL PROYECTO: SISTEMA DE RECLUTAMIENTO Y REGISTRO DE ASPIRANTES

## 1. INFORMACIÓN RECOLECTADA

### Requisitos del usuario:
- Sistema de reclutamiento y registro de aspirantes
- 6 funcionalidades principales:
  1. Registro de candidatos (datos personales, experiencia, educación)
  2. Gestión de vacantes (crear, editar, eliminar puestos)
  3. Postulación a vacantes
  4. Seguimiento de estado (aplicado, en revisión, entrevistado, contratado, rechazado)
  5. Notas/observaciones por candidato
  6. Panel de estadísticas/dashboard

### Tecnologías a utilizar (basadas en el proyecto existente):
- **Backend:** Node.js + Express + MySQL
- **Frontend:** HTML + JavaScript (Vanilla) + CSS (SB Admin 2)
- **Autenticación:** JWT o sesiones básicas

---

## 2. ESTRUCTURA DEL PROYECTO

```
sistema-reclutamiento/
├── BACKEND/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── candidatosController.js
│   │   │   ├── vacanciesController.js
│   │   │   ├── postulacionesController.js
│   │   │   └── notasController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── candidatosRoutes.js
│   │   │   ├── vacanciesRoutes.js
│   │   │   ├── postulacionesRoutes.js
│   │   │   └── notasRoutes.js
│   │   ├── database/
│   │   │   ├── connection.js
│   │   │   └── init.js
│   │   └── utils/
│   │       └── errorHandler.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── FRONTEND/
│   ├── css/
│   ├── js/
│   │   ├── api.js
│   │   └── main.js
│   ├── index.html (Dashboard)
│   ├── login.html
│   ├── register.html
│   ├── candidatos/
│   │   ├── listar-candidatos.html
│   │   ├── crear-candidato.html
│   │   └── ver-candidato.html
│   ├── vacancies/
│   │   ├── listar-vacancies.html
│   │   └── crear-vacante.html
│   └── postulaciones/
│       └── listar-postulaciones.html
└── README.md
```

---

## 3. DETALLE DE LAS RUTAS Y CONTROLADORES

### Tablas de Base de Datos:

1. **usuarios** - Usuarios del sistema (admin, reclutador)
2. **candidatos** - Datos de los aspirantes
3. **vacantes** - Puestos disponibles
4. **postulaciones** - Relación candidato-vacante con estado
5. **notas** - Observaciones por candidato
6. **experiencia** - Experiencia laboral del candidato
7. **educacion** - Formación académica del candidato

### Endpoints API:

**Autenticación:**
- POST /api/auth/login
- POST /api/auth/register

**Candidatos:**
- GET /api/candidatos - Listar todos
- GET /api/candidatos/:id - Ver candidato
- POST /api/candidatos - Crear candidato
- PUT /api/candidatos/:id - Actualizar candidato
- DELETE /api/candidatos/:id - Eliminar candidato

**Vacantes:**
- GET /api/vacantes - Listar todas
- GET /api/vacantes/:id - Ver vacante
- POST /api/vacantes - Crear vacante
- PUT /api/vacantes/:id - Actualizar vacante
- DELETE /api/vacantes/:id - Eliminar vacante

**Postulaciones:**
- GET /api/postulaciones - Listar todas
- GET /api/postulaciones/candidato/:id - Postulaciones por candidato
- GET /api/postulaciones/vacante/:id - Candidatos por vacante
- POST /api/postulaciones - Crear postulación
- PATCH /api/postulaciones/:id/estado - Actualizar estado

**Notas:**
- GET /api/notas/candidato/:id - Notas por candidato
- POST /api/notas - Crear nota
- DELETE /api/notas/:id - Eliminar nota

**Estadísticas:**
- GET /api/estadisticas/dashboard - Datos para dashboard

---

## 4. PASOS DE IMPLEMENTACIÓN

### Fase 1: Backend
1. [ ] Crear estructura de carpetas
2. [ ] Configurar package.json y dependencias
3. [ ] Crear conexión a MySQL (connection.js)
4. [ ] Crear inicialización de BD (init.js) con todas las tablas
5. [ ] Crear controladores (candidatos, vacantes, postulaciones, notas, auth)
6. [ ] Crear rutas
7. [ ] Crear server.js principal

### Fase 2: Frontend
1. [ ] Copiar estructura CSS del proyecto existente
2. [ ] Crear archivo api.js con funciones reutilizables
3. [ ] Crear página de login
4. [ ] Crear dashboard con estadísticas
5. [ ] Crear páginas de candidatos (listar, crear, ver)
6. [ ] Crear páginas de vacantes (listar, crear)
7. [ ] Crear página de postulaciones

### Fase 3: Pruebas
1. [ ] Iniciar servidor backend
2. [ ] Probar endpoints con Postman
3. [ ] Probar frontend en navegador

---

## 5. ARCHIVOS A CREAR

### Backend (13 archivos):
- package.json
- server.js
- .env
- src/database/connection.js
- src/database/init.js
- src/utils/errorHandler.js
- src/controllers/authController.js
- src/controllers/candidatosController.js
- src/controllers/vacantesController.js
- src/controllers/postulacionesController.js
- src/controllers/notasController.js
- src/routes/*.js (5 archivos)

### Frontend (10+ archivos):
- index.html, login.html, register.html
- css/sb-admin-2.min.css
- js/api.js, js/main.js
- candidatos/*.html (3 archivos)
- vacancies/*.html (2 archivos)
- postulaciones/*.html (1 archivo)

---

## 6. ESTADOS DE POSTULACIÓN

1. aplicado - Candidato aplicó a la vacante
2. en_revision - En revisión por RRHH
3. entrevistado - Ya realizó entrevista
4. pendiente_resultados - Esperando resultados
5. contratado - Candidato seleccionado
6. rechazado - Candidato no seleccionado

---

*Plan creado para Sistema de Reclutamiento v1.0*

