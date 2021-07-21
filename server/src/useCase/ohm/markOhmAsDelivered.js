/**
 * 
 * @param {import("../../domain/ohm/OhmRepository").OhmRepository} ohmRepository
 * @return {(function({trackingId: string}): Promise<{ohm: import("../../domain/ohm/Ohm").Ohm, error?: string}>)|*}
 */
const markOhmAsDelivered = (ohmRepository) => async ({trackingId}) => {
  const ohm = await ohmRepository.getOhmByTrackingId(trackingId);
  if(!ohm){
    return {error:'Ohm not found'}
  }
  try {
    ohm.markAsDelivered();
    await ohmRepository.save(ohm);
    return {ohm};
  } catch (e) {
    return {error: e.message, ohm}
  }
}

module.exports = {markOhmAsDelivered};
