export const keycloakConfig = {
	url: 'https://sso.kayak.love/',
	realm: 'kayak',
	clientId: 'snello-admin'
};

export const environment = {
	production: true,
	keycloakConfig,
	scope: 'openid'
};
