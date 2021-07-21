const {JsonOhmRepository} = require('./domain/ohm/infrastructure/JsonOhmRepository');

const rootDir = `${__dirname}/..`
const ohmRepository = new JsonOhmRepository(`${rootDir}/db.json`);

module.exports = {ohmRepository}
