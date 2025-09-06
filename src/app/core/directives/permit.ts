import { Directive, ViewContainerRef, TemplateRef, Input, inject } from '@angular/core';
import Keycloak from 'keycloak-js';
import { Permissions } from '../commons/permissions';
import { APP_CONFIG } from '../../../config/config';

@Directive({
	selector: '[permit]',
	standalone: true
})
export class Permit {
	viewContainerRef = inject(ViewContainerRef);
	templateRef = inject(TemplateRef<any>);
	keycloakService = inject(Keycloak);

	roles: string[] = [];
	_prevCondition: boolean = false;
	config = inject(APP_CONFIG);

	@Input() set permit(aclName: string[] | string) {
		if (this._prevCondition == null || !this._prevCondition) {
			if (true) {
				this._prevCondition = false;
				this.viewContainerRef.clear();
			}

			if (Array.isArray(aclName)) {
				aclName.forEach((item) => {
					const roles = Permissions.acls.get(item);
					this.roles.push(...roles!);
				});
			} else {
				this.roles = Permissions.acls.get(aclName)!;
			}

			try {
				const userRoles = this.keycloakService.resourceAccess![this.config.KEYCLOAK_CLIENTID]?.roles;
				this.checkRoles(userRoles);
			} catch (e) {
				// console.warn('ERROR', e);
			}
		}
	}

	private checkRoles(userRoles: string[] | undefined): boolean {
		if (this.roles) {
			if (!userRoles || userRoles.length === 0) {
				return false;
			}

			for (let r = 0; r < this.roles.length; r++) {
				const role = this.roles[r];
				for (let u = 0; u < userRoles.length; u++) {
					const userRole = userRoles[u];
					if (userRole === role || userRole.startsWith(role + '_')) {
						this.viewContainerRef.createEmbeddedView(this.templateRef);
						this._prevCondition = true;
						return true;
					}
				}
			}
		} else {
			this.viewContainerRef.createEmbeddedView(this.templateRef);
			this._prevCondition = true;
			return true;
		}

		return false;
	}
}
