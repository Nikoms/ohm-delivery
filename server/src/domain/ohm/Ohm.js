class Ohm {
  static fromSnapshot(snap){
    return new Ohm(snap);
  }
  
  constructor({id, trackingId, status, comment, description, client, history}) {
    this._id = id;
    this._trackingId = trackingId;
    this._status = status;
    this._comment = comment;
    this._description = description;
    this._client = client;
    this._history = history;
  }
  
  canBeFinalized(){
    return this._status === 'IN_DELIVERY';
  }
  
  _changeStatusTo(newStatus, additionalValuesForHistory){
    this._status = newStatus;
    this._history.push({ state: newStatus, at: Date.now().toString(), ...additionalValuesForHistory });
    return this;
  }

  markAsPreparing(){
    if(this._status !== 'CREATED'){
      throw new Error(`Impossible to update status to "PREPARING" because the current status is "${this._status}"`)
    }
    return this._changeStatusTo('PREPARING');
  }

  markAsReady(){
    if(this._status !== 'PREPARING'){
      throw new Error(`Impossible to update status to "READY" because the current status is "${this._status}"`)
    }
    return this._changeStatusTo('READY');
  }
  
  markAsInDelivery(){
    if(this._status !== 'READY'){
      throw new Error(`Impossible to update status to "IN_DELIVERY" because the current status is "${this._status}"`)
    }
    this._changeStatusTo('IN_DELIVERY');
    return this;
  }

  markAsDelivered(){
    if(!this.canBeFinalized()){
      throw new Error(`Impossible to update status to "DELIVERED" because the current status is "${this._status}"`)
    }
    return this._changeStatusTo('DELIVERED');
  }

  /**
   * @param {string|undefined} reason
   */
  markAsRefused(reason ){
    if(!this.canBeFinalized()){
      throw new Error(`Impossible to update status to "REFUSED" because the current status is "${this._status}"`)
    }
    return this._changeStatusTo('REFUSED', reason? {reason: reason}:null);
  }
  
  toSnapshot(){
    return {
      id: this._id,
      trackingId: this._trackingId,
      status: this._status,
      comment: this._comment,
      description: this._description,
      client: this._client,
      history: this._history
    }
  }
}

module.exports ={ Ohm };
