/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKSubscriptions = global.WKSubscriptions || {})));
}(this, (function (exports) { 'use strict';

	var moi = exports;

	var WKSubscriptionsPropertyAPIToken;

	//# PROPERTIES

	//_ propertiesAPIToken

	moi.propertiesAPIToken = function (inputData) {
		if (typeof inputData === 'undefined') {
			return WKSubscriptionsPropertyAPIToken;
		}

		WKSubscriptionsPropertyAPIToken = inputData;
	};

	//# INTERFACE

	//_ interfaceFetchFormDidSubmit

	moi.interfaceFetchFormDidSubmit = function () {
		moi.commandsFetchURL(d3.select('#WKCAppSubscriptionsFormInput').property('value'));
	};

	//# COMMANDS

	//_ commandsAlertConnectionError

	moi.commandsAlertConnectionError = function (error) {
		window.alert('<%= OLSKLocalized('WKSharedErrorServiceUnavailable') %>');

		throw error;
	};

	//_ commandsAlertTokenUnavailable

	moi.commandsAlertTokenUnavailable = function () {
		window.alert('<%= OLSKLocalized('WKSharedErrorTokenUnavailable') %>');

		throw new Error('WKCAppErrorTokenUnavailable');
	};

	//_ commandsFetchURL

	moi.commandsFetchURL = function (inputData) {
		d3.select('#WKCSubscriptionsLoader').classed('WKCAppSubscriptionsHidden', false);

		d3.text(inputData).then(function(data) {
			var parsedXML = (new DOMParser()).parseFromString(data, 'application/xml');

			if (!parsedXML.getElementsByTagName('parsererror').length && parsedXML.documentElement.getElementsByTagName('channel').length) {
				return moi.commandsConfirmURLFeed(inputData, parsedXML);
			}

			var parsedHTML = (new DOMParser()).parseFromString(data, 'text/html');

			[].slice.call(parsedHTML.getElementsByTagName('link')).filter(function(e) {
				return e.type.trim().toLowerCase() === 'application/rss+xml';
			}).map(function(e) {
				return WKLogic.WKSubscriptionsCompleteURL(d3.select(e).attr('href'), inputData);
			});
		}).catch(moi.commandsAlertFetchError);
	};

	//_ commandsAlertFetchError

	moi.commandsAlertFetchError = function (error) {
		window.alert('<%= OLSKLocalized('WKCSubscriptionsErrorFetch') %>');

		throw error;
	};

	//_ commandsConfirmURLFeed

	moi.commandsConfirmURLFeed = function (inputData, parsedXML) {
		d3.select('#WKCSubscriptionsLoader').classed('WKCAppSubscriptionsHidden', true);

		moi.reactConfirmationPreviewShared(parsedXML.getElementsByTagName('channel')[0].getElementsByTagName('title')[0].textContent.trim(), parsedXML.getElementsByTagName('channel')[0].getElementsByTagName('description')[0].textContent.trim());

		moi.reactConfirmationPreviewFeedItems([].slice.call(parsedXML.getElementsByTagName('channel')[0].getElementsByTagName('item')));

		d3.select('#WKCAppSubscriptionsConfirmation').classed('WKCAppSubscriptionsHidden', false);
		d3.select('#WKCAppSubscriptionsForm').classed('WKCAppSubscriptionsHidden', true);

		d3.select('#WKCAppSubscriptionsConfirmationFormName').attr('autofocus', true);
	};

	//# REACT

	//_ reactConfirmationPreviewShared

	moi.reactConfirmationPreviewShared = function (titleContent, blurbContent) {
		d3.select('#WKCAppSubscriptionsConfirmationFormName').node().value = titleContent;

		d3.select('#WKCAppSubscriptionsConfirmationFormBlurb').node().value = blurbContent;
	};

	//_ reactConfirmationPreviewFeedItems

	moi.reactConfirmationPreviewFeedItems = function (itemElements) {
		var selection = d3.select('#WKCAppSubscriptionsConfirmationPreviewFeed ul')
			.selectAll('.WKCAppSubscriptionsConfirmationPreviewFeedItem').data(itemElements);
		
		selection.enter()
			.append('li')
				.attr('class', 'WKCAppSubscriptionsConfirmationPreviewFeedItem')
				.merge(selection)
					.html(function(e) {
						return e.getElementsByTagName('title')[0].textContent.trim();
					});

		selection.exit().remove();
	};

	//# SETUP

	//_ setupEverything

	moi.setupEverything = function () {
		moi.setupAPIToken(function () {});
	};

	//_ setupAPIToken

	moi.setupAPIToken = function (completionHandler) {
		d3.json('<%= OLSKCanonicalFor('WKCRouteAPIToken') %>', {
			method: 'GET',
		}).then(function(responseJSON) {
			if (!responseJSON.WKCAPIToken) {
				return moi.commandsAlertTokenUnavailable();
			}

			moi.propertiesAPIToken(responseJSON.WKCAPIToken);

			completionHandler();
		}, moi.commandsAlertConnectionError);
	};

	//# LIFECYCLE

	//_ lifecyclePageWillLoad

	moi.lifecyclePageWillLoad = function () {
		moi.setupEverything();
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
