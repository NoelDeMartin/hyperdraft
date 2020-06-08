import KVCNoteModel from './model.js';
import * as OLSKRemoteStoragePackage from 'OLSKRemoteStorage';
const OLSKRemoteStorage = OLSKRemoteStoragePackage.default || OLSKRemoteStoragePackage;

const kType = 'kvc_note';
const kCollection = 'kvc_notes';

const mod = {

	KVCNoteStoragePath (inputData) {
		return `${ kCollection }/${ inputData || '' }`;
	},

	KVCNoteStorageBuild (privateClient, publicClient, changeDelegate) {
		privateClient.on('change', function (event) {
			if (!changeDelegate) {
				return;
			}
			
			if (event.relativePath.indexOf(kCollection) !== 0) {
				return;
			}

			const delegateMethod = OLSKRemoteStorage.OLSKRemoteStorageChangeDelegateProperty(event);

			if (!delegateMethod) {
				return;
			}

			if (typeof changeDelegate[delegateMethod] !== 'function') {
				return console.warn(`${ delegateMethod } not function`);
			}


			if (event.origin === 'remote' && event.oldValue && event.newValue) {
				// #hotfix-remotestorage-remote-event-from-local-change
				if (JSON.stringify(event.oldValue) === JSON.stringify(event.newValue)) {
					return console.info('RemoteIdentical', event);
				}
			}

			changeDelegate[delegateMethod](KVCNoteModel.KVCNoteModelPostJSONParse(event[OLSKRemoteStorage.OLSKRemoteStorageChangeDelegateInput(delegateMethod)]));
		});

		return {
			KVCStorageCollection: kCollection,
			KVCStorageType: kType,
			KVCStorageModelErrors: KVCNoteModel.KVCNoteModelErrorsFor({}),
			KVCStorageExports: {
				KVCStorageList () {
					return privateClient.getAll(mod.KVCNoteStoragePath(), false);
				},
				async KVCStorageWrite (param1, param2) {
					await privateClient.storeObject(kType, mod.KVCNoteStoragePath(param1), KVCNoteModel.KVCNoteModelPreJSONSchemaValidate(param2));
					return KVCNoteModel.KVCNoteModelPostJSONParse(param2);
				},
				KVCStorageRead (inputData) {
					return privateClient.getObject(mod.KVCNoteStoragePath(inputData));
				},
				KVCStorageDelete (inputData) {
					return privateClient.remove(mod.KVCNoteStoragePath(inputData));
				},
			},
		};
	},

};

export default mod;
