const {OhmRepository} = require('../OhmRepository');
const {Ohm} = require('../Ohm');


class InMemoryOhmRepository extends OhmRepository{
  /**
   * @param {Ohm[]} ohms
   */
  constructor(ohms = []) {
    super();
    this.ohms = ohms.map(o => o.toSnapshot());
  }

  reset(){
    this.ohms = [];
  }

  async getOhmById(id){
    const ohm = this.ohms.find(o => o.id === id);
    return ohm ? Ohm.fromSnapshot(ohm): undefined;
  }
  async getOhmByTrackingId(trackingId){
    const ohm = this.ohms.find(o => o.trackingId === trackingId);
    return ohm ? Ohm.fromSnapshot(ohm): undefined;
  }

  async save(ohm) {
    const snapshot = ohm.toSnapshot();
    const index = this.ohms.findIndex(o => o.trackingId === snapshot.trackingId);
    if(index >=0){
      this.ohms[index] = snapshot;
    }
  }

  async add(ohm) {
    this.ohms.push(ohm.toSnapshot())
  }
}



module.exports = { InMemoryOhmRepository }
