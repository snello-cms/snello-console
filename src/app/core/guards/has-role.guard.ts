import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../commons/services/user.service';

@Injectable({
	providedIn: 'root'
})
export class HasRoleGuard implements CanActivate {
	userService = inject(UserService);
	router = inject(Router);

	canActivate(
		route: ActivatedRouteSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		const hasPermission = this.userService.getUser()?.roles.some((role) => route.data['role'].includes(role));
		if (!hasPermission) {
			this.router.navigate(['/']);
			return false;
		}
		return true;
	}
}
