import { throws, deepEqual } from 'assert';

const Browser = require('zombie');
Browser.localhost('loc.tests', 3000);

Object.entries({
	browser: new Browser(),
	kDefaultRoutePath: '/panel/write',

	WKCWriteFilterInput: '#WIKDefaultFocusNode',
	WKCWriteFilterClearButton: '#WKCWriteFilterClearButton',
	WKCWriteCreateButton: '#WKCWriteCreateButton',

	WKCWriteListItem: '.ListItem',
	WKCWriteListItemAccessibilitySummary: '.WKCWriteListItemAccessibilitySummary',
	WKCWriteListItemTitle: '.ListItemTitle',
	WKCWriteListItemSnippet: '.ListItemSnippet',
	WKCWriteExportButton: '#WKCWriteExportButton',

	WKCWriteDetailPlaceholderContainer: '.PlaceholderContainer',

	WKCWriteDetailToolbar: '#WKCWriteDetailToolbar',
	WKCWriteDetailToolbarBackButton: '#WKCWriteDetailToolbarBackButton',

	WKCWriteDetailToolbarJumpButton: '#WKCWriteDetailToolbarJumpButton',
	WKCWriteDetailToolbarUnpublishButton: '#WKCWriteDetailToolbarUnpublishButton',
	WKCWriteDetailToolbarPublishButton: '#WKCWriteDetailToolbarPublishButton',
	WKCWriteDetailToolbarVersionsButton: '#WKCWriteDetailToolbarVersionsButton',
	WKCWriteDetailToolbarDiscardButton: '#WKCWriteDetailToolbarDiscardButton',

	WKCWriteEditorContainer: '.EditorContainer',
	WKCWriteEditorDebugInput: '#WKCWriteEditorDebugInput',

	WKCWriteReloadButton: '#WKCWriteReloadButton',

	async uCreateItem (browser) {
		browser.pressButton(WKCWriteCreateButton);
		await browser.wait({ element: WKCWriteListItem });
	},
}).map(function (e) {
	return global[e.shift()]  = e.pop();
});

describe('WKCWriteBehaviourDiscovery', function testWKCWriteBehaviourDiscovery() {

	before(function() {
		return browser.visit(kDefaultRoutePath);
	});

	it('on startup', function() {
		browser.assert.elements(WKCWriteFilterInput, 1);
		browser.assert.attribute(WKCWriteFilterInput, 'accesskey', 'f');
		browser.assert.elements(WKCWriteFilterClearButton, 0);
		browser.assert.elements(WKCWriteCreateButton, 1);
		browser.assert.attribute(WKCWriteCreateButton, 'accesskey', 'n');

		browser.assert.elements(WKCWriteListItem, 0);
		browser.assert.elements(WKCWriteExportButton, 1);
		
		browser.assert.elements(WKCWriteDetailPlaceholderContainer, 1);

		browser.assert.elements(WKCWriteDetailToolbar, 0);

		browser.assert.elements(WKCWriteEditorContainer, 0);

		browser.assert.elements(WKCWriteReloadButton, 1);
	});

	it('on create', async function() {
		await uCreateItem(browser);

		browser.assert.elements(WKCWriteListItem, 1);
		browser.assert.elements(WKCWriteListItemAccessibilitySummary, 1);
		browser.assert.elements(WKCWriteListItemTitle, 1);
		browser.assert.elements(WKCWriteListItemSnippet, 1);

		browser.assert.elements(WKCWriteDetailPlaceholderContainer, 0);

		browser.assert.elements(WKCWriteDetailToolbar, 1);
		browser.assert.elements(WKCWriteDetailToolbarBackButton, 1);
		browser.assert.elements(WKCWriteDetailToolbarJumpButton, 1);
		browser.assert.attribute(WKCWriteDetailToolbarJumpButton, 'accesskey', 'r');
		browser.assert.attribute(WKCWriteDetailToolbarJumpButton, 'disabled', '');
		browser.assert.elements(WKCWriteDetailToolbarUnpublishButton, 0);
		browser.assert.elements(WKCWriteDetailToolbarPublishButton, 0);
		browser.assert.elements(WKCWriteDetailToolbarVersionsButton, 1);
		browser.assert.elements(WKCWriteDetailToolbarDiscardButton, 1);

		browser.assert.elements(WKCWriteEditorContainer, 1);
	});

	it('on create nth item', async function() {
		await uCreateItem(browser);
		
		browser.assert.elements(WKCWriteListItem, 2);
		
		browser.assert.elements(WKCWriteDetailToolbar, 1);
	});

	context('on filter', function () {
		
		before(async function() {
			browser.fill('#WKCWriteEditorDebugInput', 'alfa');

			browser.click(`${ WKCWriteListItem }:nth-child(2)`);
			await browser.wait({ element: WKCWriteListItem });

			browser.fill('#WKCWriteEditorDebugInput', 'bravo');
		});

		it('presents clear button on input', async function() {
			browser.fill(WKCWriteFilterInput, 'test');
			await browser.wait({ element: WKCWriteFilterClearButton });

			browser.assert.elements(WKCWriteFilterClearButton, 1);
		});

		it('presents no items if no match', async function() {
			browser.assert.elements(WKCWriteListItem, 0);
		});

		it('presents items if match', async function() {
			browser.fill(WKCWriteFilterInput, 'alfa');
			await browser.wait({ element: WKCWriteFilterClearButton });

			browser.assert.elements(WKCWriteListItem, 1);
		});

		it.skip('hides clear button on click', async function() {
			browser.click(WKCWriteFilterClearButton);
			await browser.wait({ element: WKCWriteFilterClearButton });

			browser.assert.elements(WKCWriteFilterClearButton, 0);
		});

		it.skip('presents all items if empty', async function() {
			// console.log(browser.queryAll('.ListItem').map((e) => e.innerHTML));

			browser.assert.elements(WKCWriteListItem, 2);
		});

	});

	it.skip('on publish', function() {
	});

	it.skip('type header', function() {
		// browser.fire(WKCWriteEditorContainer, 'keydown')
		browser.assert.attribute(WKCWriteDetailToolbarJumpButton, 'disabled', '');
	});

	context.skip('delete', function () {

		it('on cancel', async function() {
			const browser = new Browser();

			await browser.visit(kDefaultRoutePath);

			await uCreateItem(browser);

			await new Promise(async function (resolve, reject) {
				browser.on('confirm', function (dialog) {
					dialog.response = false;

					return resolve(dialog);
				});

				browser.pressButton(WKCWriteDetailToolbarDiscardButton);
				await browser.wait({ element: WKCWriteListItem });
			});

			await browser.wait({ element: WKCWriteListItem });

			browser.assert.elements(WKCWriteDetailPlaceholderContainer, 0);

			browser.assert.elements(WKCWriteDetailToolbar, 1);
		});

		it('on confirm', async function() {
			const browser = new Browser();

			await browser.visit(kDefaultRoutePath);

			await uCreateItem(browser);

			await new Promise(async function (resolve, reject) {
				browser.on('confirm', function (dialog) {
					return resolve(dialog);
				});

				browser.pressButton(WKCWriteDetailToolbarDiscardButton);
				await browser.wait({ element: WKCWriteListItem });
			});

			await browser.wait({ element: WKCWriteListItem });

			browser.assert.elements(WKCWriteDetailPlaceholderContainer, 1);

			browser.assert.elements(WKCWriteDetailToolbar, 0);
		});
		
	});

});

describe('WKCWriteBehaviourLanguage', function testWKCWriteBehaviourLanguage() {

	['en'].forEach(function (languageCode) {

		context(languageCode, function () {

			const uLocalized = function (inputData) {
				return OLSKTestingLocalized(inputData, languageCode);
			};

			before(function() {
				return browser.visit(`${ languageCode }${ kDefaultRoutePath }`);
			});

			it('localizes interface', function() {
				deepEqual(browser.query(WKCWriteFilterInput).placeholder, uLocalized('WKCWriteMasterToolbarFilterInputPlaceholderText'));
				deepEqual(browser.query(WKCWriteCreateButton).title, uLocalized('WKCWriteMasterToolbarCreateButtonText'));

				deepEqual(browser.query(WKCWriteExportButton).textContent, uLocalized('WKCUpdateExportText'));

				deepEqual(browser.query(WKCWriteDetailPlaceholderContainer).textContent, uLocalized('WKCWriteDetailPlaceholderText'));

				deepEqual(browser.query(WKCWriteReloadButton).title, uLocalized('WKCWriteFooterToolbarReloadButtonText'));
			});

			it('on create', async function() {
				await uCreateItem(browser);

				deepEqual(browser.query(WKCWriteListItemAccessibilitySummary).textContent, '');
				deepEqual(browser.query(WKCWriteListItemTitle).textContent, '');
				deepEqual(browser.query(WKCWriteListItemSnippet).textContent, '');

				deepEqual(browser.query(WKCWriteDetailToolbarBackButton).title, uLocalized('WKCWriteDetailToolbarBackButtonText'));
				deepEqual(browser.query(WKCWriteDetailToolbarJumpButton).title, uLocalized('WKCWriteDetailToolbarJumpButtonText'));
				deepEqual(browser.query(WKCWriteDetailToolbarVersionsButton).title, uLocalized('WKCWriteDetailToolbarVersionsButtonText'));
				deepEqual(browser.query(WKCWriteDetailToolbarDiscardButton).title, uLocalized('WKCWriteDetailToolbarDiscardButtonText'));

				deepEqual(browser.query(WKCWriteEditorDebugInput).value, '');
			});

			it('on edit title', async function() {
				browser.fill(WKCWriteEditorDebugInput, 'alfa');
				await browser.wait({ element: WKCWriteListItem });

				deepEqual(browser.query(WKCWriteListItemAccessibilitySummary).textContent, 'alfa');
				deepEqual(browser.query(WKCWriteListItemTitle).textContent, 'alfa');
				deepEqual(browser.query(WKCWriteListItemSnippet).textContent, '');
			});

			it('on edit body', async function() {
				browser.fill(WKCWriteEditorDebugInput, 'alfa\nbravo');
				await browser.wait({ element: WKCWriteListItem });

				deepEqual(browser.query(WKCWriteListItemAccessibilitySummary).textContent, 'alfa');
				deepEqual(browser.query(WKCWriteListItemTitle).textContent, 'alfa');
				deepEqual(browser.query(WKCWriteListItemSnippet).textContent, 'bravo');
			});

			it('on edit long title', async function() {
				browser.fill(WKCWriteEditorDebugInput, 'alfa bravo charlie delta echo foxtrot golf hotel juliet kilos');
				await browser.wait({ element: WKCWriteListItem });

				deepEqual(browser.query(WKCWriteListItemAccessibilitySummary).textContent, 'alfa bravo charlie delta echo foxtrot golf hotel juliet…');
				deepEqual(browser.query(WKCWriteListItemTitle).textContent, 'alfa bravo charlie delta echo foxtrot golf hotel juliet');
				deepEqual(browser.query(WKCWriteListItemSnippet).textContent, '');
			});

			it('on edit long body', async function() {
				browser.fill(WKCWriteEditorDebugInput, '\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.');
				await browser.wait({ element: WKCWriteListItem });

				deepEqual(browser.query(WKCWriteListItemAccessibilitySummary).textContent, '');
				deepEqual(browser.query(WKCWriteListItemTitle).textContent, '');
				deepEqual(browser.query(WKCWriteListItemSnippet).textContent, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the…');

				browser.fill(WKCWriteEditorDebugInput, 'alfa\nbravo');
			});

			it('on create nth item', async function() {
				await uCreateItem(browser);

				deepEqual(browser.query(WKCWriteEditorDebugInput).value, '');
			});

			it('on select 1st item', async function() {
				browser.click(`${ WKCWriteListItem }:nth-child(2)`);
				await browser.wait({ element: WKCWriteListItem });

				deepEqual(browser.query(WKCWriteEditorDebugInput).value, 'alfa\nbravo');
			});

			it('on delete', async function() {
				const browser = new Browser();

				await browser.visit(`${ languageCode }${ kDefaultRoutePath }`);

				await uCreateItem(browser);

				deepEqual((await new Promise(async function (resolve, reject) {
					browser.on('confirm', function (dialog) {
						resolve(dialog);
					});

					browser.pressButton(WKCWriteDetailToolbarDiscardButton);
					await browser.wait({ element: WKCWriteListItem });
				})).question, uLocalized('WKCWriteNotesDeleteAlertText'));
			});

			it.skip('on filter', async function() {
				browser.fill(WKCWriteFilterInput, 'alfa');
				await browser.wait({ element: WKCWriteFilterClearButton });

				deepEqual(browser.query(WKCWriteFilterClearButton).title, uLocalized('WKCWriteFilterClearButtonText'));
				
				browser.pressButton(WKCWriteFilterClearButton);
				await browser.wait({ element: WKCWriteFilterClearButton });

				browser.assert.elements(WKCWriteFilterClearButton, 0);
			});

			it.skip('on write', async function() {
				browser.fill('#WKCWriteEditorDebugInput', 'test');

				await browser.wait({ element: WKCWriteListItem });
				
				deepEqual(browser.query(WKCWriteListItemAccessibilitySummary).textContent, 'test');
				deepEqual(browser.query(WKCWriteListItemTitle).textContent, '');
				deepEqual(browser.query(WKCWriteListItemSnippet).textContent, '');

				// browser.assert.elements(WKCWriteEditorContainer, 1);
			});

		});
		
	});
});

describe('WKCWriteBehaviourInteraction', function testWKCWriteBehaviourInteraction() {

	before(function() {
		return browser.visit(kDefaultRoutePath);
	});

	context('on create', async function() {

		it('focuses .CodeMirror textarea', async function() {
			await uCreateItem(browser);

			deepEqual(browser.document.activeElement, browser.query('.CodeMirror textarea'));
		});

	});

	context('on select', async function() {

		it('focuses .CodeMirror textarea', async function() {
			await uCreateItem(browser);

			browser.click(`${ WKCWriteListItem }:nth-child(2)`);
			await browser.wait({ element: WKCWriteListItem });

			deepEqual(browser.document.activeElement, browser.query('.CodeMirror textarea'));
		});

	});

	context('on filter', function () {
		
		before(async function() {
			browser.fill('#WKCWriteEditorDebugInput', 'alfa');

			browser.click(`${ WKCWriteListItem }:nth-child(2)`);
			await browser.wait({ element: WKCWriteListItem });

			browser.fill('#WKCWriteEditorDebugInput', 'bravo');
			await browser.wait({ element: WKCWriteListItem });
		});

		it.skip('selects item if exact title match', async function() {
			browser.assert.elements(WKCWriteListItem, 2);

			browser.fill(WKCWriteFilterInput, 'bravo');
			await browser.wait({ element: WKCWriteFilterClearButton });
			// console.log(browser.queryAll(WKCWriteListItem).map((e) => e.outerHTML));

			browser.assert.elements(WKCWriteListItem, 1);
		});

	});

});
