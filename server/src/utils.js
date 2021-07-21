const {ohmRepository} = require('./di');
/**
 * @deprecated use "domain/ohm/infrastructure/JsonOhmRepository.js" (extends "domain/ohm/OhmRepository") please :)
 * @param {string} id
 * @return {Promise<*>}
 */
async function getOhmById(id) {
  return await ohmRepository.getOhmById(id);
}

module.exports = { getOhmById }
