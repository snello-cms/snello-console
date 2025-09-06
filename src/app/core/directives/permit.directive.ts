import { Directive, ViewContainerRef, TemplateRef, Input, inject, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Directive({
	selector: '[permit]',
	standalone: true
})
export class PermitDirective implements OnInit {
	private viewContainerRef = inject(ViewContainerRef);
	private templateRef = inject(TemplateRef<any>);
	private keycloakService = inject(KeycloakService);

	private _roles: string | undefined;
	private _prevCondition = false;

	@Input()
	set roles(value: string | undefined) {
		this._roles = value;
		this.checkPermissions();
	}

	@Input()
	set permit(value: string | undefined) {
		this._roles = value;
		this.checkPermissions();
	}

	async ngOnInit(): Promise<void> {
		this.checkPermissions();
	}

	private async checkPermissions(): Promise<void> {
		if (!this._roles) {
			// No roles specified, show content
			if (!this._prevCondition) {
				this.viewContainerRef.createEmbeddedView(this.templateRef);
				this._prevCondition = true;
			}
			return;
		}

		try {
			if (await this.keycloakService.isLoggedIn()) {
				const userRoles = this.keycloakService.getUserRoles();
				const requiredRoles = this._roles.split(',').map((role) => role.trim());

				const hasPermission = requiredRoles.some(
					(role) => role === 'Admin' || userRoles.includes(role) || userRoles.includes('Admin')
				);

				if (hasPermission && !this._prevCondition) {
					this.viewContainerRef.createEmbeddedView(this.templateRef);
					this._prevCondition = true;
				} else if (!hasPermission && this._prevCondition) {
					this.viewContainerRef.clear();
					this._prevCondition = false;
				}
			} else {
				this.viewContainerRef.clear();
				this._prevCondition = false;
			}
		} catch (error) {
			// On error, hide content
			this.viewContainerRef.clear();
			this._prevCondition = false;
		}
	}
}
