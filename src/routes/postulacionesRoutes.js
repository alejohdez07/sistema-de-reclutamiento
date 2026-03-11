const express = require("express");
const {
  getPostulaciones,
  getPostulacionesByCandidato,
  getPostulacionesByVacante,
  createPostulacion,
  updateEstadoPostulacion,
  deletePostulacion
} = require("../controllers/postulacionesController");

const router = express.Router();

// Rutas de postulaciones
router.get("/", getPostulaciones);
router.get("/candidato/:id", getPostulacionesByCandidato);
router.get("/vacante/:id", getPostulacionesByVacante);
router.post("/", createPostulacion);
router.patch("/:id/estado", updateEstadoPostulacion);
router.delete("/:id", deletePostulacion);

module.exports = router;

