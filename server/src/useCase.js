const {markOhmAsRefused} = require('./useCase/ohm/markOhmAsRefused');
const {ohmRepository} = require('./di');
const {markOhmAsDelivered} = require('./useCase/ohm/markOhmAsDelivered');
module.exports = {
  markOhmAsDelivered: markOhmAsDelivered(ohmRepository),
  markOhmAsRefused: markOhmAsRefused(ohmRepository)
};
