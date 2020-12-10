const { throws, deepEqual } = require('assert');

const mod = require('./model.js').default;

const kTesting = {
	StubSettingObjectValid() {
		return {
			KVCSettingKey: 'alfa',
			KVCSettingValue: 'bravo',
		};
	},
};

describe('KVCSettingModelErrorsFor', function test_KVCSettingModelErrorsFor() {

	it('throws error if not object', function() {
		throws(function() {
			mod.KVCSettingModelErrorsFor(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns object if KVCSettingKey not string', function() {
		deepEqual(mod.KVCSettingModelErrorsFor(Object.assign(kTesting.StubSettingObjectValid(), {
			KVCSettingKey: null,
		})), {
			KVCSettingKey: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns object if KVCSettingKey not filled', function() {
		deepEqual(mod.KVCSettingModelErrorsFor(Object.assign(kTesting.StubSettingObjectValid(), {
			KVCSettingKey: ' ',
		})), {
			KVCSettingKey: [
				'KVCErrorNotFilled',
			],
		});
	});

	it('returns object if KVCSettingValue not string', function() {
		deepEqual(mod.KVCSettingModelErrorsFor(Object.assign(kTesting.StubSettingObjectValid(), {
			KVCSettingValue: null,
		})), {
			KVCSettingValue: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns null', function() {
		deepEqual(mod.KVCSettingModelErrorsFor(kTesting.StubSettingObjectValid()), null);
	});

});
