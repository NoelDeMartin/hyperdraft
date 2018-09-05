/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var testingLibrary = require('OLSKTesting');

var apiNotesController = require('./controller');

describe('OLSKControllerRoutes', function testOLSKControllerRoutes() {

	it('returns route objects', function() {
		assert.deepEqual(apiNotesController.OLSKControllerRoutes(), {
			WKCRouteAPINotesCreate: {
				OLSKRoutePath: '/api/notes',
				OLSKRouteMethod: 'post',
				OLSKRouteFunction: apiNotesController.WKCActionAPINotesCreate,
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPINotesRead: {
				OLSKRoutePath: '/api/notes/:wkc_note_id(\\d+)',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: apiNotesController.WKCActionAPINotesRead,
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPINotesUpdate: {
				OLSKRoutePath: '/api/notes/:wkc_note_id(\\d+)',
				OLSKRouteMethod: 'put',
				OLSKRouteFunction: apiNotesController.WKCActionAPINotesUpdate,
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPINotesDelete: {
				OLSKRoutePath: '/api/notes/:wkc_note_id(\\d+)',
				OLSKRouteMethod: 'delete',
				OLSKRouteFunction: apiNotesController.WKCActionAPINotesDelete,
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPINotesSearch: {
				OLSKRoutePath: '/api/notes/search',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: apiNotesController.WKCActionAPINotesSearch,
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAPIAuthenticate',
				],
			},
		});
	});

});

describe('Connection', function testConnection() {

	var mongodbPackage = require('mongodb');
	var mongoClient;

	before(function(done) {
		mongodbPackage.MongoClient.connect(process.env.WKC_DATABASE_URL, function(err, client) {
			if (err) {
				throw err;
			}

			mongoClient = client;

			done();
		});
	});

	after(function() {
		if (!mongoClient) {
			return;
		}

		mongoClient.close();
	});

	beforeEach(function() {
		mongoClient.db(process.env.WKC_SHARED_DATABASE_NAME).dropDatabase();
	});

	var WKCFakeRequest = function(inputData = {}) {
		return Object.assign(testingLibrary.OLSKTestingFakeRequestForHeaders({
			'x-client-key': process.env.WKC_INSECURE_API_ACCESS_TOKEN,
		}), {
			OLSKSharedConnectionFor: function() {
				return {
					OLSKConnectionClient: mongoClient,
				};
			},
			
		}, inputData);
	};

	var WKCFakeResponseSync = function() {
		return {
			json: function(inputData) {
				return inputData;
			},
		};
	};

	var WKCFakeResponseAsync = function(callback) {
		return {
			json: function(inputData) {
				return callback(inputData);
			},
		};
	};

	describe('WKCAPISettingsLastGeneratedPublicIDWithClientAndCallback', function testWKCAPISettingsLastGeneratedPublicIDWithClientAndCallback() {

		it('throws error if param1 empty', function() {
			assert.throws(function() {
				apiNotesController.WKCAPISettingsLastGeneratedPublicIDWithClientAndCallback(null, function() {});
			}, /WKCErrorInvalidInput/);
		});

		it('throws error if param2 not function', function() {
			assert.throws(function() {
				apiNotesController.WKCAPISettingsLastGeneratedPublicIDWithClientAndCallback({}, null);
			}, /WKCErrorInvalidInput/);
		});

		it('returns 0 if no existing items', function(done) {
			apiNotesController.WKCAPISettingsLastGeneratedPublicIDWithClientAndCallback(mongoClient, function(lastRepoID) {
				assert.strictEqual(lastRepoID, 0);
				
				done();
			});
		});

		var fakeRequest = function() {
			return WKCFakeRequest({
				body: {
					WKCNoteBody: 'alpha',
				},
			});
		};

		it('returns 1 if created one item', function(done) {
			apiNotesController.WKCActionAPINotesCreate(fakeRequest(), WKCFakeResponseAsync(function() {
				apiNotesController.WKCAPISettingsLastGeneratedPublicIDWithClientAndCallback(mongoClient, function(lastRepoID) {
					assert.strictEqual(lastRepoID, 1);
					
					done();
				});
			}));
		});

		it('returns 2 if created two items and deleted first one', function(done) {
			apiNotesController.WKCActionAPINotesCreate(fakeRequest(), WKCFakeResponseAsync(function() {
				apiNotesController.WKCActionAPINotesCreate(fakeRequest(), WKCFakeResponseAsync(function(responseJSON) {
					apiNotesController.WKCActionAPINotesDelete(WKCFakeRequest({
						params: {
							wkc_note_id: responseJSON.WKCNoteID.toString(),
						},
					}), WKCFakeResponseAsync(function() {
						apiNotesController.WKCAPISettingsLastGeneratedPublicIDWithClientAndCallback(mongoClient, function(lastRepoID) {
							assert.strictEqual(lastRepoID, 2);
							
							done();
						});
					}));
				}));
			}));
		});

	});

	describe('WKCActionAPINotesCreate', function testWKCActionAPINotesCreate() {

		var fakeRequest = function(inputData = {}) {
			return WKCFakeRequest({
				body: Object.assign({}, inputData),
			});
		};

		it('returns WKCErrors if not valid noteObject', function() {
			assert.deepEqual(apiNotesController.WKCActionAPINotesCreate(fakeRequest(), WKCFakeResponseSync()).WKCErrors, {
				WKCNoteBody: [
					'WKCErrorNotString',
				],
			});
		});

		it('returns noteObject with WKCNoteID', function(done) {
			apiNotesController.WKCActionAPINotesCreate(fakeRequest({
				WKCNoteBody: 'alpha',
			}), WKCFakeResponseAsync(function(responseJSON) {
				assert.strictEqual(responseJSON.WKCNoteID, 1);
				assert.strictEqual(responseJSON.WKCNoteBody, 'alpha');
				assert.strictEqual(responseJSON.WKCNoteDateCreated instanceof Date, true);
				assert.strictEqual(responseJSON.WKCNoteDateUpdated instanceof Date, true);
				
				done();
			}));
		});

	});

	describe('WKCActionAPINotesRead', function testWKCActionAPINotesRead() {

		it('returns next(WKCAPIClientError) if wkc_note_id does not exist', function(done) {
			apiNotesController.WKCActionAPINotesRead(WKCFakeRequest({
				params: {
					wkc_note_id: 'alpha',
				},
			}), WKCFakeResponseAsync(), function(inputData) {
				assert.deepEqual(inputData, new Error('WKCAPIClientErrorNotFound'));
				
				done();
			});
		});

		it('returns noteObject', function(done) {
			apiNotesController.WKCActionAPINotesCreate(WKCFakeRequest({
				body: {
					WKCNoteBody: 'alpha',
				},
			}), WKCFakeResponseAsync(function(responseJSON) {
				apiNotesController.WKCActionAPINotesRead(WKCFakeRequest({
					params: {
						wkc_note_id: responseJSON.WKCNoteID.toString(),
					},
				}), WKCFakeResponseAsync(function(responseJSON) {
					assert.strictEqual(responseJSON.WKCNoteID, 1);
					assert.strictEqual(responseJSON.WKCNoteBody, 'alpha');
					assert.strictEqual(responseJSON.WKCNoteDateCreated instanceof Date, true);
					assert.strictEqual(responseJSON.WKCNoteDateUpdated instanceof Date, true);

					done();
				}));
			}));
		});

	});

	describe('WKCActionAPINotesUpdate', function testWKCActionAPINotesUpdate() {

		var fakeRequest = function(id, body) {
			return WKCFakeRequest({
				params: {
					wkc_note_id: id.toString(),
				},
				body: Object.assign({}, body),
			});
		};

		it('returns next(WKCAPIClientError) if wkc_note_id does not exist', function(done) {
			apiNotesController.WKCActionAPINotesUpdate(fakeRequest('alpha', {
				WKCNoteBody: 'bravo',
			}), WKCFakeResponseSync(), function(inputData) {
				assert.deepEqual(inputData, new Error('WKCAPIClientErrorNotFound'));

				done();
			});
		});

		it('returns WKCErrors if not valid noteObject', function(done) {
			apiNotesController.WKCActionAPINotesCreate(fakeRequest('', {
				WKCNoteBody: 'alpha',
			}), WKCFakeResponseAsync(function(responseJSON) {
				assert.deepEqual(apiNotesController.WKCActionAPINotesUpdate(fakeRequest(responseJSON.WKCNoteID, Object.assign(responseJSON, {
					WKCNoteBody: null,
				})), WKCFakeResponseSync()).WKCErrors, {
					WKCNoteBody: [
						'WKCErrorNotString',
					],
				});

				done();
			}));
		});

		it('returns updated object if valid noteObject', function(done) {
			apiNotesController.WKCActionAPINotesCreate(WKCFakeRequest({
				body: {
					WKCNoteBody: 'alpha',
				},
			}), WKCFakeResponseAsync(function(responseJSON) {
				var originalDateUpdated = responseJSON.WKCNoteDateUpdated;

				apiNotesController.WKCActionAPINotesUpdate(fakeRequest(responseJSON.WKCNoteID, Object.assign(responseJSON, {
					WKCNoteBody: 'bravo',
				})), WKCFakeResponseAsync(function(responseJSON) {
					assert.strictEqual(responseJSON.WKCNoteBody, 'bravo');
					assert.strictEqual(responseJSON.WKCNoteDateUpdated > originalDateUpdated, true);
					
					done();
				}));
			}));
		});

	});

	describe('WKCActionAPINotesDelete', function testWKCActionAPINotesDelete() {

		it('returns next(WKCAPIClientError) if wkc_note_id does not exist', function(done) {
			apiNotesController.WKCActionAPINotesDelete(WKCFakeRequest({
				params: {
					wkc_note_id: 'alpha',
				},
			}), WKCFakeResponseAsync(), function(inputData) {
				assert.deepEqual(inputData, new Error('WKCAPIClientErrorNotFound'));
				
				done();
			});
		});

		it('returns true', function(done) {
			apiNotesController.WKCActionAPINotesCreate(WKCFakeRequest({
				body: {
					WKCNoteBody: 'alpha',
				}
			}), WKCFakeResponseAsync(function(responseJSON) {
				var noteID = responseJSON.WKCNoteID.toString();
				apiNotesController.WKCActionAPINotesDelete(WKCFakeRequest({
					params: {
						wkc_note_id: noteID,
					},
				}), WKCFakeResponseAsync(function(responseJSON) {
					assert.strictEqual(responseJSON.WKCAPIResponse, true);

					apiNotesController.WKCActionAPINotesRead(WKCFakeRequest({
						params: {
							wkc_note_id: noteID,
						},
					}), WKCFakeResponseAsync(), function(inputData) {
						assert.deepEqual(inputData, new Error('WKCAPIClientErrorNotFound'));

						done();
					});
				}));
			}));
		});

	});

	describe('WKCActionAPINotesSearch', function testWKCActionAPINotesSearch() {

		it('returns noteObject', function(done) {
			apiNotesController.WKCActionAPINotesCreate(WKCFakeRequest({
				body: {
					WKCNoteBody: 'alpha',
				},
			}), WKCFakeResponseAsync(function(responseJSON) {
				apiNotesController.WKCActionAPINotesSearch(WKCFakeRequest(), WKCFakeResponseAsync(function(responseJSON) {
					assert.strictEqual(Array.isArray(responseJSON), true);
					assert.strictEqual(responseJSON[0]._id, undefined);
					assert.strictEqual(responseJSON[0].WKCNoteID, 1);
					assert.strictEqual(responseJSON[0].WKCNoteBody, 'alpha');
					assert.strictEqual(responseJSON[0].WKCNoteDateCreated instanceof Date, true);
					assert.strictEqual(responseJSON[0].WKCNoteDateUpdated instanceof Date, true);
					
					done();
				}));
			}));
		});

	});

});
