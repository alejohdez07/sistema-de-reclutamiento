const { getPool } = require("./connection");

const initializeDatabase = async () => {
  try {
    const pool = getPool();
    const connection = await pool.getConnection();

    // Crear tabla usuarios (del sistema)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        rol VARCHAR(50) NOT NULL DEFAULT 'reclutador',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Crear tabla candidatos
    await connection.query(`
      CREATE TABLE IF NOT EXISTS candidatos (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        telefono VARCHAR(20),
        documento_identidad VARCHAR(50),
        fecha_nacimiento DATE,
        genero VARCHAR(20),
        direccion VARCHAR(255),
        ciudad VARCHAR(100),
        pais VARCHAR(100),
       linkedin VARCHAR(255),
        portfolio VARCHAR(255),
        foto VARCHAR(255),
        estado VARCHAR(50) DEFAULT 'activo',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_estado (estado)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Crear tabla experiencia_laboral
    await connection.query(`
      CREATE TABLE IF NOT EXISTS experiencia_laboral (
        id INT PRIMARY KEY AUTO_INCREMENT,
        id_candidato INT NOT NULL,
        empresa VARCHAR(150) NOT NULL,
        puesto VARCHAR(150) NOT NULL,
        fecha_inicio DATE NOT NULL,
        fecha_fin DATE,
        trabajo_actual BOOLEAN DEFAULT FALSE,
        descripcion TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_candidato) REFERENCES candidatos (id) ON DELETE CASCADE,
        INDEX idx_candidato (id_candidato)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Crear tabla educacion
    await connection.query(`
      CREATE TABLE IF NOT EXISTS educacion (
        id INT PRIMARY KEY AUTO_INCREMENT,
        id_candidato INT NOT NULL,
        institucion VARCHAR(150) NOT NULL,
        titulo VARCHAR(150) NOT NULL,
        nivel_estudio VARCHAR(50) NOT NULL,
        fecha_inicio DATE NOT NULL,
        fecha_fin DATE,
        estudio_actual BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_candidato) REFERENCES candidatos (id) ON DELETE CASCADE,
        INDEX idx_candidato (id_candidato)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Crear tabla vacantes
    await connection.query(`
      CREATE TABLE IF NOT EXISTS vacantes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        titulo VARCHAR(150) NOT NULL,
        descripcion TEXT NOT NULL,
        requisitos TEXT,
        ubicacion VARCHAR(150),
        tipo_contrato VARCHAR(50),
        salario_min DECIMAL(15,2),
        salario_max DECIMAL(15,2),
        area VARCHAR(100),
        nivel_experiencia VARCHAR(50),
        estado VARCHAR(50) DEFAULT 'activa',
        fecha_publicacion DATE,
        fecha_cierre DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_estado (estado),
        INDEX idx_area (area)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Crear tabla postulaciones
    await connection.query(`
      CREATE TABLE IF NOT EXISTS postulaciones (
        id INT PRIMARY KEY AUTO_INCREMENT,
        id_candidato INT NOT NULL,
        id_vacante INT NOT NULL,
        estado VARCHAR(50) DEFAULT 'aplicado',
        fecha_postulacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (id_candidato) REFERENCES candidatos (id) ON DELETE CASCADE,
        FOREIGN KEY (id_vacante) REFERENCES vacantes (id) ON DELETE CASCADE,
        UNIQUE KEY unique_postulacion (id_candidato, id_vacante),
        INDEX idx_candidato (id_candidato),
        INDEX idx_vacante (id_vacante),
        INDEX idx_estado (estado)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Crear tabla notas
    await connection.query(`
      CREATE TABLE IF NOT EXISTS notas (
        id INT PRIMARY KEY AUTO_INCREMENT,
        id_candidato INT NOT NULL,
        id_usuario INT NOT NULL,
        titulo VARCHAR(150),
        contenido TEXT NOT NULL,
        tipo VARCHAR(50) DEFAULT 'general',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_candidato) REFERENCES candidatos (id) ON DELETE CASCADE,
        FOREIGN KEY (id_usuario) REFERENCES usuarios (id) ON DELETE CASCADE,
        INDEX idx_candidato (id_candidato),
        INDEX idx_usuario (id_usuario)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Insertar datos de ejemplo
    const [usuariosCount] = await connection.query("SELECT COUNT(*) as count FROM usuarios");
    if (usuariosCount[0].count === 0) {
      // Usuario administrador por defecto
      await connection.query(
        "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)",
        ["Administrador", "admin@reclutamiento.com", "admin123", "administrador"]
      );

      // Usuario reclutador
      await connection.query(
        "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)",
        ["Reclutador", "reclutador@reclutamiento.com", "reclutador123", "reclutador"]
      );

      console.log("✅ Usuarios de ejemplo insertados");
    }

    // Insertar vacantes de ejemplo
    const [vacantesCount] = await connection.query("SELECT COUNT(*) as count FROM vacantes");
    if (vacantesCount[0].count === 0) {
      await connection.query(
        `INSERT INTO vacantes (titulo, descripcion, requisitos, ubicacion, tipo_contrato, area, nivel_experiencia, estado, fecha_publicacion) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          "Desarrollador Frontend",
          "Buscamos desarrollador frontend con experiencia en React y Angular para proyectos de e-commerce.",
          "• 2+ años de experiencia\n• Conocimiento de React, Angular\n• HTML, CSS, JavaScript\n• Control de versiones Git",
          "Bogotá, Colombia",
          "Tiempo completo",
          "Tecnología",
          "Junior",
          "activa",
          new Date()
        ]
      );

      await connection.query(
        `INSERT INTO vacantes (titulo, descripcion, requisitos, ubicacion, tipo_contrato, area, nivel_experiencia, estado, fecha_publicacion) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          "Gerente de Marketing Digital",
          "Responsable de estrategias de marketing digital y gestión de redes sociales.",
          "• 5+ años en marketing digital\n• Experiencia en Google Ads, Facebook Ads\n• Conocimiento de SEO/SEM\n• Liderazgo de equipos",
          "Medellín, Colombia",
          "Tiempo completo",
          "Marketing",
          "Senior",
          "activa",
          new Date()
        ]
      );

      await connection.query(
        `INSERT INTO vacantes (titulo, descripcion, requisitos, ubicacion, tipo_contrato, area, nivel_experiencia, estado, fecha_publicacion) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          "Asistente Administrativo",
          "Apoyo en tareas administrativas y atención al cliente.",
          "• Formación técnica o profesional\n• Manejo de Office\n• Comunicación efectiva\n• Experiencia en atención al cliente",
          "Cali, Colombia",
          "Medio tiempo",
          "Administración",
          "Junior",
          "activa",
          new Date()
        ]
      );

      console.log("✅ Vacantes de ejemplo insertadas");
    }

    // Insertar candidatos de ejemplo
    const [candidatosCount] = await connection.query("SELECT COUNT(*) as count FROM candidatos");
    if (candidatosCount[0].count === 0) {
      await connection.query(
        `INSERT INTO candidatos (nombre, apellido, email, telefono, documento_identidad, ciudad, linkedin, estado) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        ["Juan", "Pérez", "juan.perez@email.com", "3001234567", "12345678", "Bogotá", "https://linkedin.com/in/juanperez", "activo"]
      );

      await connection.query(
        `INSERT INTO candidatos (nombre, apellido, email, telefono, documento_identidad, ciudad, linkedin, estado) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        ["María", "Gómez", "maria.gomez@email.com", "3009876543", "87654321", "Medellín", "https://linkedin.com/in/mariagomez", "activo"]
      );

      await connection.query(
        `INSERT INTO candidatos (nombre, apellido, email, telefono, documento_identidad, ciudad, linkedin, estado) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        ["Carlos", "Rodríguez", "carlos.r@email.com", "3205551234", "11223344", "Cali", "https://linkedin.com/in/carlosrodriguez", "activo"]
      );

      console.log("✅ Candidatos de ejemplo insertados");
    }

    connection.release();
    console.log("✅ Base de datos MySQL inicializada correctamente");
  } catch (error) {
    console.error("❌ Error al inicializar la base de datos:", error.message);
    process.exit(1);
  }
};

module.exports = { initializeDatabase };

