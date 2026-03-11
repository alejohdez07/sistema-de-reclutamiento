const { getPool } = require("../database/connection");
const { handleError } = require("../utils/errorHandler");

// Login de usuario
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son requeridos" });
    }

    const pool = getPool();
    const connection = await pool.getConnection();
    
    const [rows] = await connection.query(
      "SELECT id, nombre, email, rol FROM usuarios WHERE email = ? AND password = ?",
      [email, password]
    );
    connection.release();

    if (rows.length > 0) {
      res.status(200).json({
        id: rows[0].id,
        nombre: rows[0].nombre,
        email: rows[0].email,
        rol: rows[0].rol
      });
    } else {
      res.status(401).json({ message: "Credenciales incorrectas" });
    }
  } catch (error) {
    handleError(res, error, "Error al verificar el inicio de sesión");
  }
};

// Registro de nuevo usuario
const register = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: "Nombre, email y contraseña son requeridos" });
    }

    const pool = getPool();
    const connection = await pool.getConnection();
    
    const [result] = await connection.query(
      "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)",
      [nombre, email, password, rol || "reclutador"]
    );
    connection.release();

    res.status(201).json({
      message: "Usuario registrado correctamente",
      id: result.insertId,
      nombre,
      email,
      rol: rol || "reclutador"
    });
  } catch (error) {
    handleError(res, error, "Error al registrar el usuario");
  }
};

module.exports = {
  login,
  register
};

