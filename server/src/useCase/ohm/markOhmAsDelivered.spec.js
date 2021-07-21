const {Ohm} = require('../../domain/ohm/Ohm');
const {aFakeOhm} = require('../../domain/ohm/OhmBuilder');
const {markOhmAsDelivered:markOhmAsDeliveredUseCase} = require('./markOhmAsDelivered');
const {InMemoryOhmRepository} = require('../../domain/ohm/infrastructure/InMemoryOhmRepository');

const ohmRepository = new InMemoryOhmRepository();
const markOhmAsDelivered = markOhmAsDeliveredUseCase(ohmRepository);

beforeEach(()=>{
  ohmRepository.reset();
})

it('fails when ohm is not found', async ()=>{
  const response = await markOhmAsDelivered('unknown');
  expect(response.error).toBe('Ohm not found')
})

it('can not be marked as delivered when status is created', async ()=>{
  const ohm = aFakeOhm().build();
  await ohmRepository.add(ohm);
  const response = await markOhmAsDelivered({trackingId:ohm.toSnapshot().trackingId});
  expect(response.error).toBe('Impossible to update status to "DELIVERED" because the current status is "CREATED"');
})

it('can not be marked as delivered when status is "preparing"', async ()=>{
  const ohm = aFakeOhm().build().markAsPreparing();
  await ohmRepository.add(ohm);
  const response = await markOhmAsDelivered({trackingId:ohm.toSnapshot().trackingId});
  expect(response.error).toBe('Impossible to update status to "DELIVERED" because the current status is "PREPARING"');
})

it('can not be marked as delivered when status is "ready"', async ()=>{
  const ohm = aFakeOhm().build().markAsPreparing().markAsReady();
  await ohmRepository.add(ohm);
  const response = await markOhmAsDelivered({trackingId:ohm.toSnapshot().trackingId});
  expect(response.error).toBe('Impossible to update status to "DELIVERED" because the current status is "READY"');
})

it('can only be marked as delivered when status is "in delivery"', async ()=>{
  const ohm = aFakeOhm().build().markAsPreparing().markAsReady().markAsInDelivery();
  await ohmRepository.add(ohm);
  const trackingId = ohm.toSnapshot().trackingId;

  const response = await markOhmAsDelivered({trackingId: trackingId});
  expect(response.error).toBeUndefined();
  expect(response.ohm).toBeInstanceOf(Ohm);
  expect(response.ohm.toSnapshot().status).toBe('DELIVERED');

  const savedOhm = await ohmRepository.getOhmByTrackingId(trackingId);
  expect(savedOhm.toSnapshot().status).toBe('DELIVERED');
})

it('saves it in an history', async ()=>{
  const ohm = aFakeOhm().build().markAsPreparing().markAsReady().markAsInDelivery();
  await ohmRepository.add(ohm);
  const trackingId = ohm.toSnapshot().trackingId;

  await markOhmAsDelivered({trackingId: trackingId});

  const savedOhm = await ohmRepository.getOhmByTrackingId(trackingId);
  const lastOfHistory = savedOhm.toSnapshot().history.pop();
  expect(lastOfHistory.state).toBe('DELIVERED');
  expect(lastOfHistory.at).toBeDefined();
})
