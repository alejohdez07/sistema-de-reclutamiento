const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

// Importar funciones de conexión y BD
const { initializePool, closePool } = require("./src/database/connection");
const { initializeDatabase } = require("./src/database/init");

// Importar rutas
const authRoutes = require("./src/routes/authRoutes");
const candidatosRoutes = require("./src/routes/candidatosRoutes");
const vacantesRoutes = require("./src/routes/vacantesRoutes");
const postulacionesRoutes = require("./src/routes/postulacionesRoutes");
const notasRoutes = require("./src/routes/notasRoutes");
const estadisticasRoutes = require("./src/routes/estadisticasRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ruta para servir index.html en la raíz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/candidatos", candidatosRoutes);
app.use("/api/vacantes", vacantesRoutes);
app.use("/api/postulaciones", postulacionesRoutes);
app.use("/api/notas", notasRoutes);
app.use("/api/estadisticas", estadisticasRoutes);

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    message: `La ruta '${req.method} ${req.originalUrl}' no existe en esta API`,
    suggestion: "Consulta GET / para ver los endpoints disponibles",
    status: 404
  });
});

// Iniciar servidor y pool de conexiones
const startServer = async () => {
  try {
    await initializePool();
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📚 API Base URL: http://localhost:${PORT}/api`);
      console.log(`💾 Base de datos MySQL: ${process.env.DB_NAME || "reclutamiento_db"}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error.message);
    process.exit(1);
  }
};

// Cerrar pool de conexiones al terminar
process.on("SIGINT", async () => {
  console.log("\n🔒 Cerrando pool de conexiones MySQL...");
  await closePool();
  console.log("✅ Pool de conexiones cerrado correctamente");
  process.exit(0);
});

// Manejo de errores no capturados
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

// Iniciar aplicación
startServer();

