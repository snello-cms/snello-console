import { Injectable, inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import Keycloak from 'keycloak-js';
import { User } from '../models/user.model';
import { APP_CONFIG } from '../../../../config/config';

/**
 * Service for managing user data and authentication
 * Handles user information storage and retrieval
 */
@Injectable({
	providedIn: 'root'
})
export class UserService {
	// Dependency injection
	private readonly config = inject(APP_CONFIG);
	private readonly http = inject(HttpClient);
	private readonly keycloak = inject(Keycloak);
	private readonly jwtHelper = new JwtHelperService();

	// Constants
	private readonly LOCALSTORAGE_KEY = 'user';

	/**
	 * Get current user from localStorage
	 */
	public getUser(): User | null {
		const userItem = localStorage.getItem(this.LOCALSTORAGE_KEY);
		if (!userItem) {
			return null;
		}

		try {
			return JSON.parse(userItem) as User;
		} catch (error) {
			console.error('Error parsing user data:', error);
			this.clearUser();
			return null;
		}
	}

	/**
	 * Create and store user from access token
	 */
	public createUser(accessToken: string): void {
		try {
			const decodedToken = this.jwtHelper.decodeToken(accessToken) as any;
			const user = this.buildUserFromToken(decodedToken);
			this.storeUser(user);
		} catch (error) {
			console.error('Error creating user from token:', error);
		}
	}

	/**
	 * Clear user data from localStorage
	 */
	public clearUser(): void {
		localStorage.removeItem(this.LOCALSTORAGE_KEY);
	}

	/**
	 * Build user object from decoded token
	 */
	private buildUserFromToken(decodedToken: any): User {
		const user: User = {
			name: decodedToken.given_name || '',
			lastname: decodedToken.family_name || '',
			username: decodedToken.preferred_username || '',
			email: decodedToken.email || '',
			roles: []
		};

		// Add roles from token
		this.addRolesFromToken(user, decodedToken);

		return user;
	}

	/**
	 * Add roles from token to user object
	 */
	private addRolesFromToken(user: User, decodedToken: any): void {
		// Add legacy roles
		const extraRoles = decodedToken.roles;
		if (extraRoles && Array.isArray(extraRoles)) {
			user.roles.push(...extraRoles);
		}

		// Add Keycloak resource roles
		const resource = this.config.KEYCLOAK_CLIENTID;
		if (resource && decodedToken.resource_access?.[resource]?.roles) {
			user.roles.push(...decodedToken.resource_access[resource].roles);
		}
	}

	/**
	 * Store user in localStorage
	 */
	private storeUser(user: User): void {
		try {
			localStorage.setItem(this.LOCALSTORAGE_KEY, JSON.stringify(user));
		} catch (error) {
			console.error('Error storing user data:', error);
		}
	}
}
