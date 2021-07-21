const {constructorShouldBeConcrete} = require('../../sharedKernel/abstractClass');
const {methodMustBeImplemented} = require('../../sharedKernel/abstractClass');

class OhmRepository {
  constructor() {
    constructorShouldBeConcrete(this.constructor, OhmRepository);
  }

  /**
   * @param {string} id
   * @return {Promise<*>}
   */
  async getOhmById(id){
    methodMustBeImplemented(id);
  }
  /**
   * @param {string} id
   * @return {Promise<*>}
   */
  async getOhmByTrackingId(id){
    methodMustBeImplemented(id);
  }
}



module.exports = { OhmRepository }
