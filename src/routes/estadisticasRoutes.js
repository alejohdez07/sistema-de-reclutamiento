const express = require("express");
const { getDashboardStats } = require("../controllers/estadisticasController");

const router = express.Router();

// Rutas de estadísticas
router.get("/dashboard", getDashboardStats);

module.exports = router;

