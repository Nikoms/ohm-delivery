const {constructorShouldBeConcrete} = require('../../sharedKernel/abstractClass');
const {methodMustBeImplemented} = require('../../sharedKernel/abstractClass');

class OhmRepository {
  constructor() {
    constructorShouldBeConcrete(this.constructor, OhmRepository);
  }

  /**
   * @param {string} id
   * @return {Promise<import("./Ohm").Ohm|undefined>}
   */
  async getOhmById(id){
    methodMustBeImplemented(id);
  }
  /**
   * @param {string} id
   * @return {Promise<import("./Ohm").Ohm|undefined>}
   */
  async getOhmByTrackingId(id){
    methodMustBeImplemented(id);
  }
  /**
   * @param {import("./Ohm").Ohm} ohm
   * @return {Promise<void>}
   */
  async save(ohm){
    methodMustBeImplemented(ohm);
  }
}



module.exports = { OhmRepository }
