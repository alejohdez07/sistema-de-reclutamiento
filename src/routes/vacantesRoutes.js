const express = require("express");
const {
  getVacantes,
  getVacanteById,
  createVacante,
  updateVacante,
  deleteVacante,
  getVacantesActivas
} = require("../controllers/vacantesController");

const router = express.Router();

// Rutas de vacantes
router.get("/", getVacantes);
router.get("/activas", getVacantesActivas);
router.get("/:id", getVacanteById);
router.post("/", createVacante);
router.put("/:id", updateVacante);
router.delete("/:id", deleteVacante);

module.exports = router;

