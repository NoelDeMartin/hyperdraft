import KVCSettingModel from './model.js';

const kType = 'kvc_setting';
const kCollection = 'kvc_settings';

const mod = {

	KVCSettingStoragePath (inputData) {
		return `${ kCollection }/${ inputData || '' }`;
	},

	KVCSettingStorageBuild (privateClient, publicClient, changeDelegate) {
		return {
			KVCStorageCollection: kCollection,
			KVCStorageType: kType,
			KVCStorageModelErrors: KVCSettingModel.KVCSettingModelErrorsFor({}),
			KVCStorageExports: {
				KVCStorageList () {
					return privateClient.getAll(mod.KVCSettingStoragePath(), false);
				},
				async KVCStorageWrite (param1, param2) {
					await privateClient.storeObject(kType, mod.KVCSettingStoragePath(param1), param2);
					return param2;
				},
				KVCStorageRead (inputData) {
					return privateClient.getObject(mod.KVCSettingStoragePath(inputData));
				},
				KVCStorageDelete (inputData) {
					return privateClient.remove(mod.KVCSettingStoragePath(inputData));
				},
			},
		};
	},

};

export default mod;
