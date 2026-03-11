const express = require("express");
const {
  getCandidatos,
  getCandidatoById,
  createCandidato,
  updateCandidato,
  deleteCandidato,
  addExperiencia,
  addEducacion
} = require("../controllers/candidatosController");

const router = express.Router();

// Rutas de candidatos
router.get("/", getCandidatos);
router.get("/:id", getCandidatoById);
router.post("/", createCandidato);
router.put("/:id", updateCandidato);
router.delete("/:id", deleteCandidato);

// Rutas de experiencia y educación
router.post("/:id/experiencia", addExperiencia);
router.post("/:id/educacion", addEducacion);

module.exports = router;

