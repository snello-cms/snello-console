import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { APP_VERSION } from '../../../constants/admin-items';
import { PermitDirective } from '../../../core/directives/permit.directive';

@Component({
	selector: 'sidebar',
	standalone: true,
	imports: [CommonModule, RouterModule, PermitDirective],
	templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
	private keycloakService = inject(KeycloakService);
	private router = inject(Router);

	selected = 'adminpage';
	userDetails = signal<KeycloakProfile | null>(null);
	roles = signal<string[]>([]);
	asset_path = '/assets';

	async ngOnInit(): Promise<void> {
		await this.refreshKeycloak();
	}

	async refreshKeycloak(): Promise<void> {
		if (await this.keycloakService.isLoggedIn()) {
			const profile = await this.keycloakService.loadUserProfile();
			this.userDetails.set(profile);
			const userRoles = this.keycloakService.getUserRoles();
			this.roles.set(userRoles);
		}
	}

	async logout(): Promise<void> {
		await this.keycloakService.logout();
	}

	select(page: string): void {
		this.selected = page;
	}

	version(): string {
		return APP_VERSION;
	}

	isContenPage(): string {
		const lastIndexOfSlash = this.router.url.indexOf('home') || this.router.url.indexOf('datalist');
		return lastIndexOfSlash >= 0 ? 'active' : '';
	}

	isAdminPage(): string {
		const lastIndexOfSlash =
			this.router.url.indexOf('adminpage') ||
			this.router.url.indexOf('metadata') ||
			this.router.url.indexOf('fielddefinition') ||
			this.router.url.indexOf('condition') ||
			this.router.url.indexOf('document') ||
			this.router.url.indexOf('publicdata') ||
			this.router.url.indexOf('selectqueries') ||
			this.router.url.indexOf('user') ||
			this.router.url.indexOf('role') ||
			this.router.url.indexOf('urlmaprules') ||
			this.router.url.indexOf('link');
		return lastIndexOfSlash >= 0 ? 'active' : '';
	}
}
