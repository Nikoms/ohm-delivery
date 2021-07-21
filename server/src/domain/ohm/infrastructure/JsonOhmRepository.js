const {OhmRepository} = require('../OhmRepository');
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');


const db = (path, config ={}) => (async () => {
  const adapter = new FileAsync(path);
  const _db = await low(adapter);
  await _db.defaults(config).write();
  return _db;
})()

class JsonOhmRepository extends OhmRepository{
  /**
   * @param {string} jsonPathname
   */
  constructor(jsonPathname) {
    super();
    this.jsonPathname = jsonPathname;
  }
  async getOhmById(id){
    const _db = await db(this.jsonPathname);
    return _db.get('ohms')
      .find({id})
      .value();
  }
  async getOhmByTrackingId(trackingId){
    const _db = await db(this.jsonPathname);
    return _db.get('ohms')
      .find({trackingId})
      .value();
  }
}



module.exports = { JsonOhmRepository }
