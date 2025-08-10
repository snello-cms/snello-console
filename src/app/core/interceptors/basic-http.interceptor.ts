import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';
import { UserService } from '../commons/services/user.service';

@Injectable()
export class BasicHttpInterceptor implements HttpInterceptor {
	keycloakService = inject(KeycloakService);
	userService = inject(UserService);
	router = inject(Router);

	trackedRequests: Set<string> = new Set<string>();

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const isLoggedIn = this.keycloakService.isLoggedIn();

		if (!isLoggedIn) {
			this.keycloakService.login();
		} else {
			if (this.keycloakService.isTokenExpired()) {
				this.keycloakService.login();
			}
		}
		return next.handle(request);
	}
}
