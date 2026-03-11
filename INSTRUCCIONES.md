# 🚀 Instrucciones para Ejecutar el Sistema de Reclutamiento

## Prerrequisitos

1. **XAMPP** instalado (para MySQL)
2. **Node.js** instalado

---

## Paso 1: Configurar XAMPP MySQL

1. Inicia XAMPP Control Panel
2. Inicia **Apache** (opcional, solo si quieres PHP)
3. Inicia **MySQL**
4. MySQL estará corriendo en `localhost:3306`

---

## Paso 2: Configurar la Base de Datos

El servidor automáticamente creará la base de datos `reclutamiento_db` al iniciarse.

---

## Paso 3: Instalar Dependencias

Abre una terminal en la carpeta del proyecto:

```bash
cd sistema-reclutamiento
npm install
```

---

## Paso 4: Configurar Conexión a MySQL (XAMPP)

Edita el archivo `.env` con estos valores típicos de XAMPP:

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=reclutamiento_db
```

**Nota:** XAMPP MySQL típicamente usa usuario `root` y sin contraseña.

---

## Paso 5: Iniciar el Servidor

```bash
npm start
```

Deberías ver:
```
✅ Pool de conexiones MySQL creado correctamente
✅ Base de datos MySQL inicializada correctamente
🚀 Servidor corriendo en http://localhost:3000
```

---

## Paso 6: Usar la Aplicación

1. Abre el archivo `frontend/login.html` en tu navegador
   - También puedes usar: `http://localhost:3000` si sirves los archivos estáticos

2. Inicia sesión con:
   - **Admin:** admin@reclutamiento.com / admin123
   - **Reclutador:** reclutador@reclutamiento.com / reclutador123

---

## Solución de Problemas

### Error "Failed to fetch"
- ❌ El servidor Node.js no está corriendo
- ✅ Ejecuta `npm start` en la terminal

### Error de Conexión MySQL
- ❌ MySQL de XAMPP no está corriendo
- ✅ Inicia MySQL en XAMPP Control Panel

### Error "Access denied"
- ❌ Usuario o contraseña de MySQL incorrectos
- ✅ Verifica el archivo `.env`

---

## Estructura de Archivos Creados

```
sistema-reclutamiento/
├── server.js           # Servidor Node.js
├── package.json        # Dependencias
├── .env               # Configuración (EDÍTALO)
├── src/               # Backend API
│   ├── controllers/
│   ├── routes/
│   └── database/
└── frontend/          # Interfaz HTML
    ├── login.html
    ├── index.html
    └── ...
```

