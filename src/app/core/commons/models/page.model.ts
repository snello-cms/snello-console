/**
 * Page model interface
 * Represents a navigation page with routing and access control information
 */
export interface PageModel {
	/** Display label for the page */
	label: string;

	/** Unique key identifier */
	key?: string;

	/** Icon class or identifier */
	icon?: string;

	/** Angular router link */
	routerLink?: string;

	/** Whether to include in browser history */
	history?: boolean;

	/** Child page items for nested navigation */
	items?: PageModel[];

	/** Parent route path */
	parentRoute?: string;

	/** Whether the page is currently active */
	active?: boolean;

	/** Access control level required */
	acl?: string;

	/** Search value for filtering */
	searchValue?: string | null;

	/** Unique identifier */
	id?: string;

	/** UUID for the page */
	uuid?: string;

	/** Whether the page is marked as favorite */
	favorite?: boolean;

	/** Whether the page is empty/placeholder */
	empty?: boolean;

	/** Whether this is the homepage */
	homepage?: boolean;

	/** Whether the page has extended functionality */
	extended?: boolean;

	/** Whether the user has permission to access this page */
	allowed?: boolean;
}
