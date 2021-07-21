const {Ohm} = require('./Ohm');

class OhmBuilder{
  constructor() {
    this._id = undefined;
    this._trackingId = undefined;
    this._status = undefined;
    this._comment = undefined;
    this._description = {volts:undefined, amperes:undefined};

    this._client = {};
    this._history = [];
  }
  withTestValue(){
    this._id = Math.random().toString();
    this._trackingId = Math.random().toString();
    this._status = 'CREATED';
    this._comment = '';
    this._description = {volts:12, amperes:6};
    this._client = {
      name:'Emma',
      address:"1827 green street, Tree City"
    };
    this._history = [{
      "state": "CREATED",
      "at": "123456789"
    }];
    return this;
  }

  /**
   * 
   * @return {Ohm}
   */
  build(){
    return new Ohm({
      id:this._id,
      trackingId:this._trackingId,
      status:this._status,
      comment:this._comment,
      description:this._description,
      client:this._client,
      history:this._history,
    })
  }
}

module.exports = {aFakeOhm: () => new OhmBuilder().withTestValue()}
