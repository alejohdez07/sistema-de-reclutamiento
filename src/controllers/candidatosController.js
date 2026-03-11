const { getPool } = require("../database/connection");
const { handleError } = require("../utils/errorHandler");

// Obtener todos los candidatos
const getCandidatos = async (req, res) => {
  try {
    const pool = getPool();
    const connection = await pool.getConnection();
    
    const [rows] = await connection.query(`
      SELECT c.*, 
        (SELECT COUNT(*) FROM postulaciones p WHERE p.id_candidato = c.id) as total_postulaciones
      FROM candidatos c 
      ORDER BY c.created_at DESC
    `);
    connection.release();

    res.status(200).json(rows);
  } catch (error) {
    handleError(res, error, "Error al obtener los candidatos");
  }
};

// Obtener un candidato por ID
const getCandidatoById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    const connection = await pool.getConnection();
    
    // Obtener datos del candidato
    const [candidato] = await connection.query("SELECT * FROM candidatos WHERE id = ?", [id]);
    
    if (candidato.length === 0) {
      connection.release();
      return res.status(404).json({ message: "Candidato no encontrado" });
    }

    // Obtener experiencia laboral
    const [experiencia] = await connection.query(
      "SELECT * FROM experiencia_laboral WHERE id_candidato = ? ORDER BY fecha_inicio DESC",
      [id]
    );

    // Obtener educación
    const [educacion] = await connection.query(
      "SELECT * FROM educacion WHERE id_candidato = ? ORDER BY fecha_inicio DESC",
      [id]
    );

    // Obtener postulaciones
    const [postulaciones] = await connection.query(`
      SELECT p.*, v.titulo as vacante_titulo 
      FROM postulaciones p
      JOIN vacantes v ON p.id_vacante = v.id
      WHERE p.id_candidato = ?
      ORDER BY p.fecha_postulacion DESC
    `, [id]);

    // Obtener notas
    const [notas] = await connection.query(`
      SELECT n.*, u.nombre as nombre_usuario 
      FROM notas n
      JOIN usuarios u ON n.id_usuario = u.id
      WHERE n.id_candidato = ?
      ORDER BY n.created_at DESC
    `, [id]);

    connection.release();

    res.status(200).json({
      ...candidato[0],
      experiencia_laboral: experiencia,
      educacion: educacion,
      postulaciones: postulaciones,
      notas: notas
    });
  } catch (error) {
    handleError(res, error, "Error al obtener el candidato");
  }
};

// Crear un nuevo candidato
const createCandidato = async (req, res) => {
  try {
    const {
      nombre, apellido, email, telefono, documento_identidad,
      fecha_nacimiento, genero, direccion, ciudad, pais,
      linkedin, portfolio, foto, estado
    } = req.body;

    if (!nombre || !apellido || !email) {
      return res.status(400).json({ message: "Nombre, apellido y email son requeridos" });
    }

    const pool = getPool();
    const connection = await pool.getConnection();
    
    const [result] = await connection.query(
      `INSERT INTO candidatos (nombre, apellido, email, telefono, documento_identidad,
        fecha_nacimiento, genero, direccion, ciudad, pais, linkedin, portfolio, foto, estado) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, email, telefono, documento_identidad,
       fecha_nacimiento, genero, direccion, ciudad, pais,
       linkedin, portfolio, foto, estado || "activo"]
    );
    connection.release();

    res.status(201).json({
      message: "Candidato creado correctamente",
      id: result.insertId
    });
  } catch (error) {
    handleError(res, error, "Error al crear el candidato");
  }
};

// Actualizar un candidato
const updateCandidato = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre, apellido, email, telefono, documento_identidad,
      fecha_nacimiento, genero, direccion, ciudad, pais,
      linkedin, portfolio, foto, estado
    } = req.body;

    const pool = getPool();
    const connection = await pool.getConnection();
    
    const [result] = await connection.query(
      `UPDATE candidatos SET 
        nombre = ?, apellido = ?, email = ?, telefono = ?, documento_identidad = ?,
        fecha_nacimiento = ?, genero = ?, direccion = ?, ciudad = ?, pais = ?,
        linkedin = ?, portfolio = ?, foto = ?, estado = ?
       WHERE id = ?`,
      [nombre, apellido, email, telefono, documento_identidad,
       fecha_nacimiento, genero, direccion, ciudad, pais,
       linkedin, portfolio, foto, estado, id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Candidato no encontrado" });
    }

    res.status(200).json({ message: "Candidato actualizado correctamente" });
  } catch (error) {
    handleError(res, error, "Error al actualizar el candidato");
  }
};

// Eliminar un candidato
const deleteCandidato = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    const connection = await pool.getConnection();
    
    const [result] = await connection.query("DELETE FROM candidatos WHERE id = ?", [id]);
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Candidato no encontrado" });
    }

    res.status(200).json({ message: "Candidato eliminado correctamente" });
  } catch (error) {
    handleError(res, error, "Error al eliminar el candidato");
  }
};

// Agregar experiencia laboral
const addExperiencia = async (req, res) => {
  try {
    const { id } = req.params;
    const { empresa, puesto, fecha_inicio, fecha_fin, trabajo_actual, descripcion } = req.body;

    if (!empresa || !puesto || !fecha_inicio) {
      return res.status(400).json({ message: "Empresa, puesto y fecha de inicio son requeridos" });
    }

    const pool = getPool();
    const connection = await pool.getConnection();
    
    const [result] = await connection.query(
      `INSERT INTO experiencia_laboral (id_candidato, empresa, puesto, fecha_inicio, fecha_fin, trabajo_actual, descripcion) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, empresa, puesto, fecha_inicio, fecha_fin, trabajo_actual || false, descripcion]
    );
    connection.release();

    res.status(201).json({
      message: "Experiencia laboral agregada correctamente",
      id: result.insertId
    });
  } catch (error) {
    handleError(res, error, "Error al agregar experiencia laboral");
  }
};

// Agregar educación
const addEducacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { institucion, titulo, nivel_estudio, fecha_inicio, fecha_fin, estudio_actual } = req.body;

    if (!institucion || !titulo || !nivel_estudio || !fecha_inicio) {
      return res.status(400).json({ message: "Institución, título, nivel de estudio y fecha de inicio son requeridos" });
    }

    const pool = getPool();
    const connection = await pool.getConnection();
    
    const [result] = await connection.query(
      `INSERT INTO educacion (id_candidato, institucion, titulo, nivel_estudio, fecha_inicio, fecha_fin, estudio_actual) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, institucion, titulo, nivel_estudio, fecha_inicio, fecha_fin, estudio_actual || false]
    );
    connection.release();

    res.status(201).json({
      message: "Educación agregada correctamente",
      id: result.insertId
    });
  } catch (error) {
    handleError(res, error, "Error al agregar educación");
  }
};

module.exports = {
  getCandidatos,
  getCandidatoById,
  createCandidato,
  updateCandidato,
  deleteCandidato,
  addExperiencia,
  addEducacion
};

