import { Directive, Input, TemplateRef, ViewContainerRef, inject, OnInit, OnDestroy } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Subject } from 'rxjs';

/**
 * Role-based conditional rendering directive
 * Shows/hides content based on user roles
 */
@Directive({
	selector: '[appRole]',
	standalone: true
})
export class RoleDirective implements OnInit, OnDestroy {
	// Dependency injection
	private readonly keycloakService = inject(KeycloakService);
	private readonly templateRef = inject(TemplateRef<any>);
	private readonly viewContainer = inject(ViewContainerRef);

	// Lifecycle management
	private readonly destroy$ = new Subject<void>();

	// Input properties
	@Input() appRole: string | string[] = '';
	@Input() appRoleOperator: 'AND' | 'OR' = 'OR';

	/**
	 * Initialize directive and check role permissions
	 */
	ngOnInit(): void {
		this.checkRole();
	}

	/**
	 * Clean up resources on destroy
	 */
	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * Check if user has required role(s) and render content accordingly
	 */
	private checkRole(): void {
		const userRoles = this.keycloakService.getUserRoles();
		const hasAccess = this.evaluateRoleAccess(userRoles);

		if (hasAccess) {
			this.viewContainer.createEmbeddedView(this.templateRef);
		} else {
			this.viewContainer.clear();
		}
	}

	/**
	 * Evaluate role access based on input configuration
	 */
	private evaluateRoleAccess(userRoles: string[]): boolean {
		if (typeof this.appRole === 'string') {
			return userRoles.includes(this.appRole);
		} else if (Array.isArray(this.appRole)) {
			if (this.appRoleOperator === 'AND') {
				return this.appRole.every((role) => userRoles.includes(role));
			} else {
				return this.appRole.some((role) => userRoles.includes(role));
			}
		}
		return false;
	}
}
