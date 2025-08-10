import { bootstrapApplication } from '@angular/platform-browser';
import { getAppConfig } from './app/app.config';
import { App } from './app/app';
import { environment } from './environments/environment';

// Create a config object that matches the expected Config interface
const config = {
	KEYCLOAK_CLIENTID: environment.keycloakConfig.clientId,
	KEYCLOAK_REALM: environment.keycloakConfig.realm,
	KEYCLOAK_URL: environment.keycloakConfig.url,
	BACKEND_API: 'https://ldap-integration-api-corporate.icgapp.com',
	LDAP_BACKEND_API: 'https://ldap-users-corporate.icgapp.dev',
	PROCUREMENT_BACKEND_API: '',
	EXPORT_BACKEND_API: '',
	API_APP_VERSION: 'https://app-versioning-corporate.icgapp.dev/',
	EDI_BACKEND_API: ''
};

bootstrapApplication(App, getAppConfig(config)).catch((err) => console.error(err));
