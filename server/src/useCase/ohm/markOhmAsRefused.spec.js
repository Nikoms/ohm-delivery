const {Ohm} = require('../../domain/ohm/Ohm');
const {aFakeOhm} = require('../../domain/ohm/OhmBuilder');
const {markOhmAsRefused:markOhmAsRefusedUseCase} = require('./markOhmAsRefused');
const {InMemoryOhmRepository} = require('../../domain/ohm/infrastructure/InMemoryOhmRepository');

const ohmRepository = new InMemoryOhmRepository();
const markOhmAsRefused = markOhmAsRefusedUseCase(ohmRepository);

beforeEach(()=>{
  ohmRepository.reset();
})

it('fails when ohm is not found', async ()=>{
  const response = await markOhmAsRefused('unknown');
  expect(response.error).toBe('Ohm not found')
})

it('can not be marked as refused when status is created', async ()=>{
  const ohm = aFakeOhm().build();
  await ohmRepository.add(ohm);
  const response = await markOhmAsRefused({trackingId:ohm.toSnapshot().trackingId});
  expect(response.error).toBe('Impossible to update status to "REFUSED" because the current status is "CREATED"');
})

it('can not be marked as refused when status is "preparing"', async ()=>{
  const ohm = aFakeOhm().build().markAsPreparing();
  await ohmRepository.add(ohm);
  const response = await markOhmAsRefused({trackingId:ohm.toSnapshot().trackingId});
  expect(response.error).toBe('Impossible to update status to "REFUSED" because the current status is "PREPARING"');
})

it('can not be marked as refused when status is "ready"', async ()=>{
  const ohm = aFakeOhm().build().markAsPreparing().markAsReady();
  await ohmRepository.add(ohm);
  const response = await markOhmAsRefused({trackingId:ohm.toSnapshot().trackingId});
  expect(response.error).toBe('Impossible to update status to "REFUSED" because the current status is "READY"');
})

it('can only be marked as refused when status is "in delivery"', async ()=>{
  const ohm = aFakeOhm().build().markAsPreparing().markAsReady().markAsInDelivery();
  await ohmRepository.add(ohm);
  const trackingId = ohm.toSnapshot().trackingId;

  const response = await markOhmAsRefused({trackingId: trackingId});
  expect(response.error).toBeUndefined();
  expect(response.ohm).toBeInstanceOf(Ohm);
  expect(response.ohm.toSnapshot().status).toBe('REFUSED');

  const savedOhm = await ohmRepository.getOhmByTrackingId(trackingId);
  expect(savedOhm.toSnapshot().status).toBe('REFUSED');
})

it('A reason can be added to explain the refuse', async ()=>{
  const ohm = aFakeOhm().build().markAsPreparing().markAsReady().markAsInDelivery();
  await ohmRepository.add(ohm);
  const trackingId = ohm.toSnapshot().trackingId;
  const reason = 'too fast';

  const response = await markOhmAsRefused({trackingId, reason});
  expect(response.error).toBeUndefined();
  expect(response.ohm).toBeInstanceOf(Ohm);
  expect(response.ohm.toSnapshot().status).toBe('REFUSED');

  const savedOhm = await ohmRepository.getOhmByTrackingId(trackingId);
  const lastOfHistory = savedOhm.toSnapshot().history.pop();
  expect(lastOfHistory.reason).toBe(reason);
  expect(lastOfHistory.state).toBe('REFUSED');
  expect(lastOfHistory.at).toBeDefined();
})
