import { Injectable, inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { BehaviorSubject, Observable, from, map, switchMap, catchError, of } from 'rxjs';
import { User } from '../commons/models/user.model';

/**
 * User information interface
 * Contains user profile data from Keycloak
 */
export interface UserInfo {
	id: string;
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	roles: string[];
	token: string;
}

/**
 * Authentication service for Keycloak integration
 * Manages user authentication state and provides authentication utilities
 */
@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private readonly keycloakService = inject(KeycloakService);

	// State management
	private readonly userInfoSubject = new BehaviorSubject<UserInfo | null>(null);
	public readonly userInfo$ = this.userInfoSubject.asObservable();

	private readonly isLoggedInSubject = new BehaviorSubject<boolean>(false);
	public readonly isLoggedIn$ = this.isLoggedInSubject.asObservable();

	constructor() {
		this.initializeUserInfo();
	}

	/**
	 * Initialize user information on service creation
	 */
	private async initializeUserInfo(): Promise<void> {
		try {
			const isLoggedIn = await this.keycloakService.isLoggedIn();
			this.isLoggedInSubject.next(isLoggedIn);

			if (isLoggedIn) {
				await this.loadUserInfo();
			}
		} catch (error) {
			console.error('Error initializing authentication:', error);
			this.isLoggedInSubject.next(false);
		}
	}

	/**
	 * Load user information from Keycloak
	 */
	private async loadUserInfo(): Promise<void> {
		try {
			const profile = await this.keycloakService.loadUserProfile();
			const roles = this.keycloakService.getUserRoles();
			const token = await this.keycloakService.getToken();

			const userInfo: UserInfo = {
				id: profile.id || '',
				username: profile.username || '',
				email: profile.email || '',
				firstName: profile.firstName || '',
				lastName: profile.lastName || '',
				roles: roles,
				token: token
			};

			this.userInfoSubject.next(userInfo);
		} catch (error) {
			console.error('Error loading user info:', error);
			this.userInfoSubject.next(null);
		}
	}

	/**
	 * Check if user is currently logged in
	 */
	public isLoggedIn(): Observable<boolean> {
		return from(Promise.resolve(this.keycloakService.isLoggedIn())).pipe(
			map((authenticated) => {
				this.isLoggedInSubject.next(authenticated);
				return authenticated;
			}),
			catchError(() => {
				this.isLoggedInSubject.next(false);
				return of(false);
			})
		);
	}

	/**
	 * Initiate login process
	 */
	public login(): Observable<void> {
		return from(this.keycloakService.login());
	}

	/**
	 * Initiate logout process
	 */
	public logout(): Observable<void> {
		return from(this.keycloakService.logout());
	}

	/**
	 * Get current authentication token
	 */
	public getToken(): Observable<string> {
		return from(this.keycloakService.getToken());
	}

	/**
	 * Get user roles from Keycloak
	 */
	public getUserRoles(): string[] {
		return this.keycloakService.getUserRoles();
	}

	/**
	 * Check if user has specific role
	 */
	public hasRole(role: string): boolean {
		return this.keycloakService.getUserRoles().includes(role);
	}

	/**
	 * Check if user has any of the specified roles
	 */
	public hasAnyRole(roles: string[]): boolean {
		const userRoles = this.keycloakService.getUserRoles();
		return roles.some((role) => userRoles.includes(role));
	}

	/**
	 * Check if user has all of the specified roles
	 */
	public hasAllRoles(roles: string[]): boolean {
		const userRoles = this.keycloakService.getUserRoles();
		return roles.every((role) => userRoles.includes(role));
	}

	/**
	 * Refresh authentication token
	 */
	public refreshToken(): Observable<string> {
		return from(this.keycloakService.getToken());
	}

	/**
	 * Get current user information
	 */
	public getCurrentUser(): UserInfo | null {
		return this.userInfoSubject.value;
	}

	/**
	 * Get current user information as observable
	 */
	public getCurrentUser$(): Observable<UserInfo | null> {
		return this.userInfo$;
	}

	/**
	 * Get current user as User model
	 */
	public getCurrentUserAsUser(): User | null {
		const userInfo = this.getCurrentUser();
		if (!userInfo) return null;

		return {
			name: userInfo.firstName,
			lastname: userInfo.lastName,
			username: userInfo.username,
			email: userInfo.email,
			roles: userInfo.roles
		};
	}

	/**
	 * Update authentication token
	 */
	public updateToken(): Observable<string> {
		return from(this.keycloakService.updateToken(30)).pipe(
			switchMap((refreshed) => {
				return this.getToken();
			}),
			catchError((error) => {
				console.error('Error updating token:', error);
				return this.getToken();
			})
		);
	}
}
