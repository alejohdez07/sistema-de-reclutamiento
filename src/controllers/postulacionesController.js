const { getPool } = require("../database/connection");
const { handleError } = require("../utils/errorHandler");

// Obtener todas las postulaciones
const getPostulaciones = async (req, res) => {
  try {
    const pool = getPool();
    const connection = await pool.getConnection();
    
    const [rows] = await connection.query(`
      SELECT p.*, 
        c.nombre as candidato_nombre, c.apellido as candidato_apellido, c.email as candidato_email,
        v.titulo as vacante_titulo
      FROM postulaciones p
      JOIN candidatos c ON p.id_candidato = c.id
      JOIN vacantes v ON p.id_vacante = v.id
      ORDER BY p.fecha_postulacion DESC
    `);
    connection.release();

    res.status(200).json(rows);
  } catch (error) {
    handleError(res, error, "Error al obtener las postulaciones");
  }
};

// Obtener postulaciones por candidato
const getPostulacionesByCandidato = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    const connection = await pool.getConnection();
    
    const [rows] = await connection.query(`
      SELECT p.*, v.titulo as vacante_titulo, v.area, v.ubicacion
      FROM postulaciones p
      JOIN vacantes v ON p.id_vacante = v.id
      WHERE p.id_candidato = ?
      ORDER BY p.fecha_postulacion DESC
    `, [id]);
    connection.release();

    res.status(200).json(rows);
  } catch (error) {
    handleError(res, error, "Error al obtener las postulaciones del candidato");
  }
};

// Obtener postulaciones por vacante
const getPostulacionesByVacante = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    const connection = await pool.getConnection();
    
    const [rows] = await connection.query(`
      SELECT p.*, c.nombre, c.apellido, c.email, c.telefono, c.ciudad, c.linkedin
      FROM postulaciones p
      JOIN candidatos c ON p.id_candidato = c.id
      WHERE p.id_vacante = ?
      ORDER BY p.fecha_postulacion DESC
    `, [id]);
    connection.release();

    res.status(200).json(rows);
  } catch (error) {
    handleError(res, error, "Error al obtener las postulaciones de la vacante");
  }
};

// Crear una nueva postulación
const createPostulacion = async (req, res) => {
  try {
    const { id_candidato, id_vacante } = req.body;

    if (!id_candidato || !id_vacante) {
      return res.status(400).json({ message: "Candidato y vacante son requeridos" });
    }

    const pool = getPool();
    const connection = await pool.getConnection();
    
    // Verificar si ya existe la postulación
    const [existente] = await connection.query(
      "SELECT * FROM postulaciones WHERE id_candidato = ? AND id_vacante = ?",
      [id_candidato, id_vacante]
    );

    if (existente.length > 0) {
      connection.release();
      return res.status(409).json({ message: "El candidato ya ha postulado a esta vacante" });
    }

    const [result] = await connection.query(
      "INSERT INTO postulaciones (id_candidato, id_vacante, estado) VALUES (?, ?, ?)",
      [id_candidato, id_vacante, "aplicado"]
    );
    connection.release();

    res.status(201).json({
      message: "Postulación creada correctamente",
      id: result.insertId
    });
  } catch (error) {
    handleError(res, error, "Error al crear la postulación");
  }
};

// Actualizar estado de postulación
const updateEstadoPostulacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosValidos = ["aplicado", "en_revision", "entrevistado", "pendiente_resultados", "contratado", "rechazado"];
    
    if (!estado || !estadosValidos.includes(estado)) {
      return res.status(400).json({ 
        message: "Estado inválido. Estados válidos: " + estadosValidos.join(", ") 
      });
    }

    const pool = getPool();
    const connection = await pool.getConnection();
    
    const [result] = await connection.query(
      "UPDATE postulaciones SET estado = ? WHERE id = ?",
      [estado, id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Postulación no encontrada" });
    }

    res.status(200).json({ message: "Estado de postulación actualizado correctamente" });
  } catch (error) {
    handleError(res, error, "Error al actualizar el estado de la postulación");
  }
};

// Eliminar una postulación
const deletePostulacion = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    const connection = await pool.getConnection();
    
    const [result] = await connection.query("DELETE FROM postulaciones WHERE id = ?", [id]);
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Postulación no encontrada" });
    }

    res.status(200).json({ message: "Postulación eliminada correctamente" });
  } catch (error) {
    handleError(res, error, "Error al eliminar la postulación");
  }
};

module.exports = {
  getPostulaciones,
  getPostulacionesByCandidato,
  getPostulacionesByVacante,
  createPostulacion,
  updateEstadoPostulacion,
  deletePostulacion
};

