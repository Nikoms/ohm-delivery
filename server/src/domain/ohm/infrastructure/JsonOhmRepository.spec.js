const {JsonOhmRepository} = require('./JsonOhmRepository');
const ohmRepository = new JsonOhmRepository(__dirname+'/__mocks__/db.json');

describe('#getOhmById', ()=>{
  test('find a ohm by id', async () => {
    const ohm = await ohmRepository.getOhmById('1');
    expect(ohm).toBeDefined();
    expect(ohm.toSnapshot().id).toBe('1');
  });

  test('when ohm does not exist, it returns undefined', async () => {
    expect(await ohmRepository.getOhmById('ABC')).toBeUndefined(); //personnaly, I prefer null :)
  });
})

describe('#getOhmByTrackingId', () => {
  test('find ohm by tracking id', async () => {
    const ohm = await ohmRepository.getOhmByTrackingId('1e62adfe');
    expect(ohm).toBeDefined();
    expect(ohm.toSnapshot().trackingId).toBe('1e62adfe');
  });
  test('when ohm is not found, it returns undefined', async () => {
    expect(await ohmRepository.getOhmByTrackingId('ABC')).toBeUndefined(); //personnaly, I prefer null, but I have to be consistent with "getById"
  });
});
