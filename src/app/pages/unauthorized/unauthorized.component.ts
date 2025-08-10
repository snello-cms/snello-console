import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
	selector: 'app-unauthorized',
	standalone: true,
	imports: [CommonModule, ButtonModule, CardModule],
	template: `
		<div class="container mx-auto p-4">
			<p-card header="Access Denied" styleClass="text-center">
				<div class="space-y-4">
					<div class="text-6xl text-red-500 mb-4">
						<i class="pi pi-exclamation-triangle"></i>
					</div>

					<h2 class="text-2xl font-bold text-red-600">Unauthorized Access</h2>

					<p class="text-gray-600">You don't have the required permissions to access this page.</p>

					<div class="mt-6 space-x-4">
						<p-button label="Go Home" severity="primary" (onClick)="goHome()" icon="pi pi-home"> </p-button>

						<p-button label="Go Back" severity="secondary" (onClick)="goBack()" icon="pi pi-arrow-left">
						</p-button>
					</div>
				</div>
			</p-card>
		</div>
	`,
	styles: [
		`
			:host {
				display: block;
				min-height: 100vh;
				background-color: #f5f5f5;
			}
		`
	]
})
export class UnauthorizedComponent {
	constructor(private router: Router) {}

	goHome(): void {
		this.router.navigate(['/']);
	}

	goBack(): void {
		window.history.back();
	}
}
