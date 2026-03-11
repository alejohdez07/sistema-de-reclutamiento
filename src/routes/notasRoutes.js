const express = require("express");
const {
  getNotasByCandidato,
  createNota,
  deleteNota
} = require("../controllers/notasController");

const router = express.Router();

// Rutas de notas
router.get("/candidato/:id", getNotasByCandidato);
router.post("/", createNota);
router.delete("/:id", deleteNota);

module.exports = router;

