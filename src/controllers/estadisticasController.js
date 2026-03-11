const { getPool } = require("../database/connection");
const { handleError } = require("../utils/errorHandler");

// Obtener estadísticas del dashboard
const getDashboardStats = async (req, res) => {
  try {
    const pool = getPool();
    const connection = await pool.getConnection();
    
    // Total de candidatos
    const [totalCandidatos] = await connection.query("SELECT COUNT(*) as total FROM candidatos");
    
    // Total de vacantes activas
    const [totalVacantesActivas] = await connection.query(
      "SELECT COUNT(*) as total FROM vacantes WHERE estado = 'activa'"
    );
    
    // Total de postulaciones
    const [totalPostulaciones] = await connection.query("SELECT COUNT(*) as total FROM postulaciones");
    
    // Postulaciones por estado
    const [postulacionesPorEstado] = await connection.query(`
      SELECT estado, COUNT(*) as total 
      FROM postulaciones 
      GROUP BY estado
    `);
    
    // Vacantes por área
    const [vacantesPorArea] = await connection.query(`
      SELECT area, COUNT(*) as total 
      FROM vacantes 
      WHERE area IS NOT NULL 
      GROUP BY area
    `);
    
    // Candidatos postulados recently (últimos 30 días)
    const [candidatosRecientes] = await connection.query(`
      SELECT COUNT(*) as total 
      FROM candidatos 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);
    
    // Postulaciones últimos 30 días
    const [postulacionesRecientes] = await connection.query(`
      SELECT COUNT(*) as total 
      FROM postulaciones 
      WHERE fecha_postulacion >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);
    
    // Candidatos por ciudad
    const [candidatosPorCiudad] = await connection.query(`
      SELECT ciudad, COUNT(*) as total 
      FROM candidatos 
      WHERE ciudad IS NOT NULL 
      GROUP BY ciudad
    `);

    connection.release();

    res.status(200).json({
      totalCandidatos: totalCandidatos[0].total,
      totalVacantesActivas: totalVacantesActivas[0].total,
      totalPostulaciones: totalPostulaciones[0].total,
      postulacionesPorEstado: postulacionesPorEstado,
      vacantesPorArea: vacantesPorArea,
      candidatosRecientes: candidatosRecientes[0].total,
      postulacionesRecientes: postulacionesRecientes[0].total,
      candidatosPorCiudad: candidatosPorCiudad
    });
  } catch (error) {
    handleError(res, error, "Error al obtener las estadísticas");
  }
};

module.exports = {
  getDashboardStats
};

