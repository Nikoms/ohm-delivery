const {OhmRepository} = require('../OhmRepository');
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const {Ohm} = require('../Ohm');


const db = (path, config ={}) => (async () => {
  const adapter = new FileAsync(path);
  const database = await low(adapter);
  await database.defaults(config).write();
  return database;
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
    const database = await db(this.jsonPathname);
    const snapshot = database.get('ohms')
      .find({id})
      .value();
    return snapshot ? Ohm.fromSnapshot(snapshot) : undefined;
  }
  async getOhmByTrackingId(trackingId){
    const database = await db(this.jsonPathname);
    const snapshot = database.get('ohms')
      .find({trackingId})
      .value();
    return snapshot ? Ohm.fromSnapshot(snapshot) : undefined;
  }

  async save(ohm) {
    const database = await db(this.jsonPathname);
    const snapshot = ohm.toSnapshot();
    database
      .get('ohms')
      .find({trackingId:snapshot.trackingId})
      .assign(snapshot)
      .value();
    await database.write();
  }
}



module.exports = { JsonOhmRepository }
