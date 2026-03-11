const { getPool } = require("../database/connection");
const { handleError } = require("../utils/errorHandler");

// Obtener notas por candidato
const getNotasByCandidato = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    const connection = await pool.getConnection();
    
    const [rows] = await connection.query(`
      SELECT n.*, u.nombre as nombre_usuario, u.email as email_usuario
      FROM notas n
      JOIN usuarios u ON n.id_usuario = u.id
      WHERE n.id_candidato = ?
      ORDER BY n.created_at DESC
    `, [id]);
    connection.release();

    res.status(200).json(rows);
  } catch (error) {
    handleError(res, error, "Error al obtener las notas");
  }
};

// Crear una nueva nota
const createNota = async (req, res) => {
  try {
    const { id_candidato, id_usuario, titulo, contenido, tipo } = req.body;

    if (!id_candidato || !id_usuario || !contenido) {
      return res.status(400).json({ message: "Candidato, usuario y contenido son requeridos" });
    }

    const pool = getPool();
    const connection = await pool.getConnection();
    
    const [result] = await connection.query(
      "INSERT INTO notas (id_candidato, id_usuario, titulo, contenido, tipo) VALUES (?, ?, ?, ?, ?)",
      [id_candidato, id_usuario, titulo, contenido, tipo || "general"]
    );
    connection.release();

    res.status(201).json({
      message: "Nota creada correctamente",
      id: result.insertId
    });
  } catch (error) {
    handleError(res, error, "Error al crear la nota");
  }
};

// Eliminar una nota
const deleteNota = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    const connection = await pool.getConnection();
    
    const [result] = await connection.query("DELETE FROM notas WHERE id = ?", [id]);
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }

    res.status(200).json({ message: "Nota eliminada correctamente" });
  } catch (error) {
    handleError(res, error, "Error al eliminar la nota");
  }
};

module.exports = {
  getNotasByCandidato,
  createNota,
  deleteNota
};

