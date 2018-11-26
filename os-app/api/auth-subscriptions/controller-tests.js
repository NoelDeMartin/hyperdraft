/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var testingLibrary = require('OLSKTesting');

var controllerModule = require('./controller');

describe('OLSKControllerRoutes', function testOLSKControllerRoutes() {

	it('returns route objects', function() {
		assert.deepEqual(controllerModule.OLSKControllerRoutes(), {
			WKCRouteAPISubscriptionsCreate: {
				OLSKRoutePath: '/api/subscriptions',
				OLSKRouteMethod: 'post',
				OLSKRouteFunction: controllerModule.WKCActionAPISubscriptionsCreate,
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAPIAuthenticate',
				],
			},
			WKCRouteAPISubscriptionsRead: {
				OLSKRoutePath: '/api/subscriptions/:wkc_subscription_id(\\d+)',
				OLSKRouteMethod: 'get',
				OLSKRouteFunction: controllerModule.WKCActionAPISubscriptionsRead,
				OLSKRouteMiddlewares: [
					'WKCSharedMiddlewareAPIAuthenticate',
				],
			},
		});
	});

});

