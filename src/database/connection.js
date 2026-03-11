const mysql = require("mysql2/promise");
require("dotenv").config();

let pool;

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "reclutamiento_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Función para crear la base de datos si no existe
const createDatabaseIfNotExists = async () => {
  try {
    // Conexión sin especificar base de datos
    const tempConfig = { ...dbConfig, database: undefined };
    const tempPool = mysql.createPool(tempConfig);
    
    const connection = await tempPool.getConnection();
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    connection.release();
    await tempPool.end();
    
    console.log(`✅ Base de datos '${dbConfig.database}' verificada/creada correctamente`);
  } catch (error) {
    console.error("❌ Error al crear la base de datos:", error.message);
    throw error;
  }
};

const initializePool = async () => {
  try {
    // Primero crear la base de datos si no existe
    await createDatabaseIfNotExists();
    
    pool = mysql.createPool(dbConfig);
    console.log("✅ Pool de conexiones MySQL creado correctamente");
    return pool;
  } catch (error) {
    console.error("❌ Error al crear el pool de conexiones:", error.message);
    throw error;
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error("Pool de conexiones no inicializado. Llama a initializePool() primero.");
  }
  return pool;
};

const closePool = async () => {
  if (pool) {
    await pool.end();
    console.log("🔒 Pool de conexiones cerrado");
  }
};

module.exports = {
  initializePool,
  getPool,
  closePool,
};

