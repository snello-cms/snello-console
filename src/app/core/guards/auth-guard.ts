import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../commons/services/user.service';
import { ANY_ACL, Permissions } from '../commons/permissions';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard {
	router = inject(Router);
	userService = inject(UserService);

	roles: string[] = [];

	canActivate(): boolean {
		this.roles = Permissions.acls.get(ANY_ACL)!;

		const currentRoles = this.userService.getUser()?.roles;
		const hasRoles = this.checkRoles(currentRoles!);

		if (hasRoles) {
			return true;
		}

		this.router.navigate(['/no-permission-page']).then();
		return false;
	}

	private checkRoles(userRoles: string | any[]): boolean {
		if (!userRoles || userRoles.length === 0) {
			return false;
		}
		if (this.roles) {
			for (let r = 0; r < this.roles.length; r++) {
				const role = this.roles[r];
				for (let u = 0; u < userRoles.length; u++) {
					const userRole = userRoles[u];
					if (userRole === role || userRole.startsWith(role + '_')) {
						return true;
					}
				}
			}
		}

		return false;
	}
}
