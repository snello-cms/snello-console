import {
	ApplicationConfig,
	importProvidersFrom,
	provideBrowserGlobalErrorListeners,
	provideZonelessChangeDetection,
	APP_INITIALIZER
} from '@angular/core';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { KeycloakService, KeycloakAngularModule } from 'keycloak-angular';
import { NgxSpinnerModule } from 'ngx-spinner';

import { ConfirmationService, MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { TranslateModule } from '@ngx-translate/core';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { APP_CONFIG, Config } from '../config/config';
import { initializeKeycloak } from './core/initializers/keycloak.init';
import { Helpers } from './constants/helpers';
import { ConfigurationService } from './services/configuration.service';

export function loadConfigurations(configService: ConfigurationService) {
	return () => configService.getConfigs();
}

export function getAppConfig(config: Config): ApplicationConfig {
	return {
		providers: [
			provideBrowserGlobalErrorListeners(),
			provideZonelessChangeDetection(),
			provideRouter(routes),
			Helpers,
			ConfirmationService,
			MessageService,
			importProvidersFrom(
				NgxSpinnerModule.forRoot({
					type: 'ball-atom'
				}),
				TranslateModule.forRoot({
					fallbackLang: 'en'
				})
			),
			importProvidersFrom(KeycloakAngularModule),
			{
				provide: APP_INITIALIZER,
				useFactory: initializeKeycloak,
				multi: true,
				deps: [KeycloakService]
			},
			{
				provide: APP_INITIALIZER,
				useFactory: loadConfigurations,
				multi: true,
				deps: [ConfigurationService]
			},
			provideHttpClient(withInterceptors([authInterceptor])),
			provideAnimationsAsync('animations'),
			providePrimeNG({
				theme: {
					preset: Aura,
					options: {
						darkModeSelector: false
					}
				}
			}),
			{ provide: APP_CONFIG, useValue: config }
		]
	};
}
