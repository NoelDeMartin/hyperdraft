import OLSKInternational from 'OLSKInternational';

let localizationDictionary = JSON.parse(`{"PLUGIN_ALFA_SEARCH_REPLACE":"PLUGIN_ALFA_SEARCH_REPLACE"}`);

export const OLSKLocalized = function(translationConstant) {
	return OLSKInternational.OLSKInternationalLocalizedStringWithTranslationKeyAndTranslationDictionary(translationConstant, localizationDictionary[window.OLSKPublicConstants('OLSKSharedPageCurrentLanguage')]);
};
