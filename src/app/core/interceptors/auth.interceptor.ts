import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable, from, switchMap, catchError } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';

/**
 * Authentication HTTP interceptor
 * Automatically adds Bearer token to HTTP requests
 */
export const authInterceptor: HttpInterceptorFn = (
	req: HttpRequest<unknown>,
	next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
	const keycloakService = inject(KeycloakService);

	// Skip authentication for certain URLs
	if (shouldSkipAuth(req.url)) {
		return next(req);
	}

	return from(keycloakService.getToken()).pipe(
		switchMap((token) => {
			if (token) {
				const authReq = req.clone({
					setHeaders: {
						Authorization: `Bearer ${token}`
					}
				});
				return next(authReq);
			}
			return next(req);
		}),
		catchError((error) => {
			console.error('Auth interceptor error:', error);
			return next(req);
		})
	);
};

/**
 * Check if request should skip authentication
 */
function shouldSkipAuth(url: string): boolean {
	const skipAuthUrls = ['/assets', '/public', '/auth'];
	return skipAuthUrls.some((skipUrl) => url.includes(skipUrl));
}
