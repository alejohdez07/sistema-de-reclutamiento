const { getPool } = require("../database/connection");
const { handleError } = require("../utils/errorHandler");

// Obtener todas las vacantes
const getVacantes = async (req, res) => {
  try {
    const pool = getPool();
    const connection = await pool.getConnection();
    
    const [rows] = await connection.query(`
      SELECT v.*, 
        (SELECT COUNT(*) FROM postulaciones p WHERE p.id_vacante = v.id) as total_postulaciones
      FROM vacantes v 
      ORDER BY v.created_at DESC
    `);
    connection.release();

    res.status(200).json(rows);
  } catch (error) {
    handleError(res, error, "Error al obtener las vacantes");
  }
};

// Obtener una vacante por ID
const getVacanteById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    const connection = await pool.getConnection();
    
    const [vacante] = await connection.query("SELECT * FROM vacantes WHERE id = ?", [id]);
    
    if (vacante.length === 0) {
      connection.release();
      return res.status(404).json({ message: "Vacante no encontrada" });
    }

    // Obtener candidatos que han postulado
    const [postulaciones] = await connection.query(`
      SELECT p.*, c.nombre, c.apellido, c.email, c.telefono, c.ciudad
      FROM postulaciones p
      JOIN candidatos c ON p.id_candidato = c.id
      WHERE p.id_vacante = ?
      ORDER BY p.fecha_postulacion DESC
    `, [id]);

    connection.release();

    res.status(200).json({
      ...vacante[0],
      postulaciones: postulaciones
    });
  } catch (error) {
    handleError(res, error, "Error al obtener la vacante");
  }
};

// Crear una nueva vacante
const createVacante = async (req, res) => {
  try {
    const {
      titulo, descripcion, requisitos, ubicacion, tipo_contrato,
      salario_min, salario_max, area, nivel_experiencia,
      estado, fecha_publicacion, fecha_cierre
    } = req.body;

    if (!titulo || !descripcion) {
      return res.status(400).json({ message: "Título y descripción son requeridos" });
    }

    const pool = getPool();
    const connection = await pool.getConnection();
    
    const [result] = await connection.query(
      `INSERT INTO vacantes (titulo, descripcion, requisitos, ubicacion, tipo_contrato,
        salario_min, salario_max, area, nivel_experiencia, estado, fecha_publicacion, fecha_cierre) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [titulo, descripcion, requisitos, ubicacion, tipo_contrato,
       salario_min, salario_max, area, nivel_experiencia,
       estado || "activa", fecha_publicacion || new Date(), fecha_cierre]
    );
    connection.release();

    res.status(201).json({
      message: "Vacante creada correctamente",
      id: result.insertId
    });
  } catch (error) {
    handleError(res, error, "Error al crear la vacante");
  }
};

// Actualizar una vacante
const updateVacante = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titulo, descripcion, requisitos, ubicacion, tipo_contrato,
      salario_min, salario_max, area, nivel_experiencia,
      estado, fecha_publicacion, fecha_cierre
    } = req.body;

    const pool = getPool();
    const connection = await pool.getConnection();
    
    const [result] = await connection.query(
      `UPDATE vacantes SET 
        titulo = ?, descripcion = ?, requisitos = ?, ubicacion = ?, tipo_contrato = ?,
        salario_min = ?, salario_max = ?, area = ?, nivel_experiencia = ?,
        estado = ?, fecha_publicacion = ?, fecha_cierre = ?
       WHERE id = ?`,
      [titulo, descripcion, requisitos, ubicacion, tipo_contrato,
       salario_min, salario_max, area, nivel_experiencia,
       estado, fecha_publicacion, fecha_cierre, id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Vacante no encontrada" });
    }

    res.status(200).json({ message: "Vacante actualizada correctamente" });
  } catch (error) {
    handleError(res, error, "Error al actualizar la vacante");
  }
};

// Eliminar una vacante
const deleteVacante = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    const connection = await pool.getConnection();
    
    const [result] = await connection.query("DELETE FROM vacantes WHERE id = ?", [id]);
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Vacante no encontrada" });
    }

    res.status(200).json({ message: "Vacante eliminada correctamente" });
  } catch (error) {
    handleError(res, error, "Error al eliminar la vacante");
  }
};

// Obtener vacantes activas
const getVacantesActivas = async (req, res) => {
  try {
    const pool = getPool();
    const connection = await pool.getConnection();
    
    const [rows] = await connection.query(`
      SELECT v.*, 
        (SELECT COUNT(*) FROM postulaciones p WHERE p.id_vacante = v.id) as total_postulaciones
      FROM vacantes v 
      WHERE v.estado = 'activa'
      ORDER BY v.fecha_publicacion DESC
    `);
    connection.release();

    res.status(200).json(rows);
  } catch (error) {
    handleError(res, error, "Error al obtener las vacantes activas");
  }
};

module.exports = {
  getVacantes,
  getVacanteById,
  createVacante,
  updateVacante,
  deleteVacante,
  getVacantesActivas
};

