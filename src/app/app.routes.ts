import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'adminpage',
		pathMatch: 'full'
	},
	{
		path: 'home',
		loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
		canActivate: [authGuard]
	},
	{
		path: 'adminpage',
		loadComponent: () => import('./pages/admin/admin.component').then((m) => m.AdminComponent),
		canActivate: [authGuard]
	},
	{
		path: 'unauthorized',
		loadComponent: () => import('./pages/unauthorized/unauthorized.component').then((m) => m.UnauthorizedComponent)
	},
	{
		path: '**',
		redirectTo: 'adminpage'
	}
];
