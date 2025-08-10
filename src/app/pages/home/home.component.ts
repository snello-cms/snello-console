import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../core/services/auth.service';

@Component({
	selector: 'app-home',
	standalone: true,
	imports: [CommonModule, ButtonModule, CardModule],
	templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
	authService = inject(AuthService);
	router = inject(Router);

	ngOnInit(): void {
		// Component initialized
	}

	login(): void {
		this.authService.login().subscribe();
	}

	logout(): void {
		this.authService.logout().subscribe();
	}

	goToAdmin(): void {
		this.router.navigate(['/admin']);
	}
}
