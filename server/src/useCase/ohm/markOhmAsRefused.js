/**
 *
 * @param {import("../../domain/ohm/OhmRepository").OhmRepository} ohmRepository
 * @return {(function({trackingId: string, reason?: string}): Promise<{ohm: import("../../domain/ohm/Ohm").Ohm, error?: string}>)|*}
 */
const markOhmAsRefused = (ohmRepository) => async ({trackingId, reason}) => {
  const ohm = await ohmRepository.getOhmByTrackingId(trackingId);
  if(!ohm){
    return {error:'Ohm not found'}
  }
  try {
    ohm.markAsRefused(reason);
    await ohmRepository.save(ohm);
    return {ohm};
  } catch (e) {
    return {error: e.message, ohm}
  }
}

module.exports = {markOhmAsRefused};
