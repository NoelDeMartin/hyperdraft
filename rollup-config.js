export default require('OLSKRollupScaffold').OLSKRollupScaffoldScanStart(__dirname, {
	OLSKRollupPluginSwapTokens: Object.assign(require('OLSKUIAssets').OLSKUIAssetsSwapTokens(), {
		OLSK_VERSION_LIMIT_SWAP_TOKEN: process.env.OLSK_VERSION_LIMIT,

		OLSK_APROPOS_FEEDBACK_EMAIL_SWAP_TOKEN: Buffer.from(`mailto:${ process.env.OLSK_APROPOS_FEEDBACK_EMAIL }`).toString('base64'),
		
		KVC_FUND_DOCUMENT_LIMIT_SWAP_TOKEN: process.env.KVC_FUND_DOCUMENT_LIMIT,
		
		KVC_TEMPLATE_NORMALIZE_URL_SWAP_TOKEN: process.env.KVC_TEMPLATE_NORMALIZE_URL,
		KVC_TEMPLATE_DECOR_URL_SWAP_TOKEN: process.env.KVC_TEMPLATE_DECOR_URL,

		OLSK_FUND_API_URL_SWAP_TOKEN: process.env.OLSK_FUND_API_URL,
		OLSK_FUND_FORM_URL_SWAP_TOKEN: process.env.OLSK_FUND_FORM_URL,
		OLSK_FUND_PRICING_STRING_SWAP_TOKEN: process.env.OLSK_FUND_PRICING_STRING,

		OLSK_CRYPTO_PAIR_RECEIVER_PRIVATE_SWAP_TOKEN: process.env.OLSK_CRYPTO_PAIR_RECEIVER_PRIVATE,
		OLSK_CRYPTO_PAIR_SENDER_PUBLIC_SWAP_TOKEN: process.env.OLSK_CRYPTO_PAIR_SENDER_PUBLIC,
	}),
});
