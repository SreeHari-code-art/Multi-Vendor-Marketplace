// Copy only the whitelisted keys that are present on obj (prevents mass assignment).
module.exports = (obj = {}, keys = []) =>
  Object.fromEntries(keys.filter((k) => obj[k] !== undefined).map((k) => [k, obj[k]]));
