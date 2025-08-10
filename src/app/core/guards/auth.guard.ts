import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { from, map, catchError, of, Observable } from 'rxjs';

/**
 * Basic authentication guard
 * Ensures user is logged in before accessing protected routes
 */
export const authGuard: CanActivateFn = (route, state): Observable<boolean> => {
	const keycloakService = inject(KeycloakService);
	const router = inject(Router);

	return from(Promise.resolve(keycloakService.isLoggedIn())).pipe(
		map((authenticated) => {
			if (authenticated) {
				return true;
			} else {
				keycloakService.login();
				return false;
			}
		}),
		catchError(() => {
			keycloakService.login();
			return of(false);
		})
	);
};

/**
 * Role-based guard factory
 * Creates a guard that requires ANY of the specified roles
 */
export const roleGuard = (requiredRoles: string[]): CanActivateFn => {
	return (route, state): Observable<boolean> => {
		const keycloakService = inject(KeycloakService);
		const router = inject(Router);

		return from(Promise.resolve(keycloakService.isLoggedIn())).pipe(
			map((authenticated) => {
				if (!authenticated) {
					keycloakService.login();
					return false;
				}

				const userRoles = keycloakService.getUserRoles();
				const hasRequiredRole = requiredRoles.some((role) => userRoles.includes(role));

				if (hasRequiredRole) {
					return true;
				} else {
					router.navigate(['/unauthorized']);
					return false;
				}
			}),
			catchError(() => {
				keycloakService.login();
				return of(false);
			})
		);
	};
};

/**
 * All roles guard factory
 * Creates a guard that requires ALL of the specified roles
 */
export const allRolesGuard = (requiredRoles: string[]): CanActivateFn => {
	return (route, state): Observable<boolean> => {
		const keycloakService = inject(KeycloakService);
		const router = inject(Router);

		return from(Promise.resolve(keycloakService.isLoggedIn())).pipe(
			map((authenticated) => {
				if (!authenticated) {
					keycloakService.login();
					return false;
				}

				const userRoles = keycloakService.getUserRoles();
				const hasAllRequiredRoles = requiredRoles.every((role) => userRoles.includes(role));

				if (hasAllRequiredRoles) {
					return true;
				} else {
					router.navigate(['/unauthorized']);
					return false;
				}
			}),
			catchError(() => {
				keycloakService.login();
				return of(false);
			})
		);
	};
};
