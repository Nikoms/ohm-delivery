const utils = require('../src/utils');

describe('db return ohm', () => {
    test('returns Ohm object', async () => {
        expect(await utils.getOhmById('1')).toBeDefined();
    });
})
