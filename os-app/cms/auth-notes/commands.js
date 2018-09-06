/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKControl = global.WKControl || {})));
}(this, (function (exports) { 'use strict';

	//_ WKCommandsAlertTokenUnavailable

	exports.WKCommandsAlertTokenUnavailable = function () {
		window.alert('<%= OLSKLocalized('WKCNotesErrors').WKCAppErrorTokenUnavailable %>');
		throw new Error('WKCAppErrorTokenUnavailable');
	};

	//_ WKCommandsAlertNotesUnavailable

	exports.WKCommandsAlertNotesUnavailable = function () {
		window.alert('<%= OLSKLocalized('WKCNotesErrors').WKCAppErrorNotesUnavailable %>');
		throw new Error('WKCAppErrorNotesUnavailable');
	};

	//_ WKCommandsSelectNote

	exports.WKCommandsSelectNote = function (item, sharedData) {
		sharedData.WKCAppNotesSharedSelectedItem = item;
		
		d3.select('#WKCNotesAppEditorTextarea').node().value = item.WKCNoteBody;
		d3.select('#WKCNotesAppEditorTextarea').node().focus();

		d3.selectAll('.WKCAppNotesListItem').classed('WKCAppNotesListItemSelected', function(d) {
			return d === item;
		});
	};

	//_ WKReactNoteObjects

	exports.WKReactNoteObjects = function (noteObjects, sharedData) {
		var selection = d3.select('#WKCAppNotesList')
			.selectAll('.WKCAppNotesListItem').data(noteObjects);
		
		selection.enter()
			.append('div')
				.attr('class', 'WKCAppNotesListItem')
				.on('click', function(obj) {
					d3.selectAll('.WKCAppNotesListItem').classed('WKCAppNotesListItemSelected', false);
					d3.select(this).classed('WKCAppNotesListItemSelected', true);

					return exports.WKCommandsSelectNote(obj, sharedData);
				})
				.merge(selection)
					.html(function(obj) {
						return [
							'<pre>',
							(obj.WKCNoteBody || '').split('\n').slice(0, 3).join('\n'),
							'</pre>',
						].join('');
					});

		selection.exit().remove();
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
