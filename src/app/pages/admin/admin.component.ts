import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { MessageService } from 'primeng/api';

import { SidebarComponent } from '../../common/components/sidebar/sidebar.component';
import { AdminHomeTopbarComponent } from '../../common/components/admin-home-topbar/admin-home-topbar.component';
import { ADMIN_ITEMS, AdminItem, APP_VERSION } from '../../constants/admin-items';
import { PermitDirective } from '../../core/directives/permit.directive';

@Component({
	selector: 'app-admin',
	standalone: true,
	imports: [CommonModule, RouterModule, SidebarComponent, AdminHomeTopbarComponent, PermitDirective],
	templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {
	private keycloakService = inject(KeycloakService);
	private messageService = inject(MessageService);

	items: AdminItem[] = ADMIN_ITEMS;
	userDetails = signal<KeycloakProfile | null>(null);
	roles = signal<string[]>([]);

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

	showViaService(): void {
		this.messageService.add({
			severity: 'info',
			summary: 'Service Message',
			detail: 'Via MessageService'
		});
	}

	version(): string {
		return APP_VERSION;
	}
}
