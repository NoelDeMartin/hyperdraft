const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

kDefaultRoute.OLSKRouteLanguageCodes.forEach(function (OLSKRoutingLanguage) {

	const uLocalized = function (inputData) {
		return OLSKTestingLocalized(inputData, OLSKRoutingLanguage);
	};

	describe(`KVCVitrine_Localize-${ OLSKRoutingLanguage }`, function () {

		before(function() {
			return browser.OLSKVisit(kDefaultRoute, {
				OLSKRoutingLanguage,
			});
		});

		it('localizes title', function() {
			browser.assert.text('title', uLocalized('KVCVitrineTitle'));
		});

		it('localizes meta[description]', function() {
			browser.assert.attribute('meta[name=description]', 'content', uLocalized('KVCVitrineDescription'));
		});

		it('localizes KVCVitrineIdentityName', function () {
			browser.assert.text(KVCVitrineIdentityName, uLocalized('KVCVitrineTitle'));
		});

		it('localizes KVCVitrineIdentityBlurb', function () {
			browser.assert.text(KVCVitrineIdentityBlurb, uLocalized('KVCVitrineDescription'));
		});

		it('localizes KVCVitrineContent', function() {
			const item = require('OLSKString').OLSKStringReplaceTokens(require('fs').readFileSync(require('path').join(__dirname, `text.${ OLSKRoutingLanguage }.md`), 'utf-8'), {
				'_': '',
				'\n\n': '\n',
				'KVCVitrineDescription': uLocalized('KVCVitrineDescription'),
			});
			browser.assert.OLSKTextContent(KVCVitrineContent, item.slice(0, 20), function (inputData) {
				return inputData.slice(0, 20);
			});
		});

		it('localizes KVC_VITRINE_NV_URL', function() {
			browser.assert.element(`a[href="${ process.env.KVC_VITRINE_NV_URL }"]`);
		});

		it('localizes KVC_SHARED_GITHUB_URL', function() {
			browser.assert.element(`a[href="${ process.env.KVC_SHARED_GITHUB_URL }"]`);
		});

		it('localizes KVC_SHARED_DONATE_URL', function() {
			browser.assert.element(`a[href="${ process.env.KVC_SHARED_DONATE_URL }"]`);
		});

		it('localizes KVCVitrineVideoHeading', function () {
			browser.assert.text(KVCVitrineVideoHeading, uLocalized('KVCVitrineVideoHeadingText'));
		});

		context('KVCVitrineContentAppButton', function test_KVCVitrineContentAppButton () {

			it('classes OLSKCommonButton', function () {
				browser.assert.hasClass(KVCVitrineContentAppButton, 'OLSKCommonButton');
			});
			
			it('classes OLSKCommonButtonPrimary', function () {
				browser.assert.hasClass(KVCVitrineContentAppButton, 'OLSKCommonButtonPrimary');
			});
			
			it('sets href', function () {
				browser.assert.attribute(KVCVitrineContentAppButton, 'href', OLSKTestingCanonical(require('../open-write/controller.js').OLSKControllerRoutes().shift(), {
					OLSKRoutingLanguage,
				}));
			});
		
		});

	});

});
