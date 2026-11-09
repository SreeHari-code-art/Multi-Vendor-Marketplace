/**
 * Formatea un valor numérico como moneda en Rupias Indias (INR).
 * Utiliza la API nativa de internacionalización del navegador ('en-IN').
 * 
 * @param {number} amount - Cantidad numérica a formatear.
 * @returns {string} - Cadena formateada (ej. ₹1,234.50).
 */
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '₹0.00';
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formatea una fecha ISO o timestamp a un formato legible por el usuario.
 * 
 * @param {string|Date} dateString - Fecha en formato string o objeto Date.
 * @returns {string} - Fecha formateada en español (ej. 7 de nov. de 2026).
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  
  return new Intl.DateTimeFormat('es-ES', options).format(date);
};

/**
 * Trunca un texto largo y añade puntos suspensivos si excede la longitud máxima.
 * Útil para descripciones de productos en las tarjetas del marketplace.
 * 
 * @param {string} text - Texto original.
 * @param {number} maxLength - Longitud máxima permitida antes de truncar.
 * @returns {string} - Texto truncado o el original si es menor al límite.
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}...`;
};

/**
 * Capitaliza la primera letra de una cadena de texto.
 * 
 * @param {string} string - Texto de entrada.
 * @returns {string} - Texto con la primera letra en mayúscula.
 */
export const capitalize = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};