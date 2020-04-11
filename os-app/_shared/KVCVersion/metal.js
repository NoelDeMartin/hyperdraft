import { KVCVersionModelErrorsFor, KVCVersionModelPostJSONParse } from './model.js';

const mod = {

	async KVCVersionMetalWrite (storageClient, inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		let errors = KVCVersionModelErrorsFor(inputData);
		if (errors) {
			return Promise.resolve({
				KVCErrors: errors,
			});
		}

		return await storageClient.wikiavec.kvc_versions.writeObject(inputData.KVCVersionID, inputData);
	},

	async KVCVersionMetalRead (storageClient, inputData) {
		if (typeof inputData !== 'string') {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		return KVCVersionModelPostJSONParse(await storageClient.wikiavec.kvc_versions.readObject(inputData));
	},

	async KVCVersionMetalList (storageClient) {
		let outputData = await storageClient.wikiavec.kvc_versions.listObjects();

		for (let key in outputData) {
			KVCVersionModelPostJSONParse(outputData[key]);
		}
		
		return outputData;
	},

	async KVCVersionMetalDelete (storageClient, inputData) {
		if (typeof inputData !== 'string') {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		return await storageClient.wikiavec.kvc_versions.deleteObject(inputData);
	},

};

export default mod;
