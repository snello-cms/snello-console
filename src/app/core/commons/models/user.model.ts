/**
 * User model interface
 * Represents a user in the system with authentication and authorization data
 */
export interface User {
	/** User's email address */
	email: string;

	/** Unique username for login */
	username: string;

	/** User's first name */
	name: string;

	/** User's last name */
	lastname: string;

	/** Array of user roles for authorization */
	roles: string[];
}
