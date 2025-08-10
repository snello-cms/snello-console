import { InjectionToken } from '@angular/core';

export type Config = {
	KEYCLOAK_CLIENTID: string;
	KEYCLOAK_REALM: string;
	KEYCLOAK_URL: string;

	BACKEND_API: string;
	LDAP_BACKEND_API: string;
	PROCUREMENT_BACKEND_API: string;
	EXPORT_BACKEND_API: string;
	API_APP_VERSION: string;
	EDI_BACKEND_API: string;
};

export const APP_CONFIG: InjectionToken<Config> = new InjectionToken<Config>('Application Config');
