/**
 * Manejador de errores centralizado
 */

const handleError = (res, error, customMessage = "Error en la operación") => {
  console.error(`❌ ${customMessage}:`, error.message);
  
  // Manejar errores específicos de MySQL
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      message: "El registro ya existe. No se permiten duplicados.",
      error: error.message
    });
  }

  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      message: "El registro referenciado no existe. Verifique los datos.",
      error: error.message
    });
  }

  if (error.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(400).json({
      message: "No se puede eliminar el registro porque está siendo utilizado.",
      error: error.message
    });
  }

  // Error genérico
  return res.status(500).json({
    message: customMessage,
    error: error.message
  });
};

module.exports = { handleError };

