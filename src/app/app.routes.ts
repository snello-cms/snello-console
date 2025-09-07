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
		path: 'metadata',
		children: [
			{
				path: '',
				redirectTo: 'list',
				pathMatch: 'full'
			},
			{
				path: 'list',
				loadComponent: () =>
					import('./pages/metadata/metadata-list.component').then((m) => m.MetadataListComponent),
				canActivate: [authGuard]
			},
			{
				path: 'new',
				loadComponent: () =>
					import('./pages/metadata/metadata-edit.component').then((m) => m.MetadataEditComponent),
				canActivate: [authGuard]
			},
			{
				path: 'edit/:id',
				loadComponent: () =>
					import('./pages/metadata/metadata-edit.component').then((m) => m.MetadataEditComponent),
				canActivate: [authGuard]
			},
			{
				path: 'view/:id',
				loadComponent: () =>
					import('./pages/metadata/metadata-view.component').then((m) => m.MetadataViewComponent),
				canActivate: [authGuard]
			}
		]
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
