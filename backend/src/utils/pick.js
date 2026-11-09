/**
 * Crea un nuevo objeto compuesto por las propiedades seleccionadas de un objeto origen.
 *
 * @param {Object} object - El objeto de origen (ej. req.body)
 * @param {Array<string>} keys - Las claves permitidas a extraer
 * @returns {Object} El objeto filtrado con solo las claves permitidas
 */
const pick = (object, keys = []) => {
  if (!object || typeof object !== 'object') {
    return {};
  }

  return keys.reduce((obj, key) => {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

module.exports = { pick };
module.exports.default = pick;