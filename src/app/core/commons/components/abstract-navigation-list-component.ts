import { inject } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Abstract base component for navigation in list components
 * Provides common navigation functionality for list operations
 */
export abstract class AbstractNavigationListComponent<T> {
	protected readonly router = inject(Router);

	/** Currently selected element */
	protected element: T | null = null;

	/**
	 * Navigate to view page for selected element
	 */
	public view(element: T): void {
		this.element = element;
		this.router.navigate([`/${this.path}/view`, this.getId()]);
	}

	/**
	 * Navigate to edit page for selected element
	 */
	public edit(element: T): void {
		this.element = element;
		this.router.navigate([`/${this.path}/edit`, this.getId()]);
	}

	/**
	 * Navigate back to home page
	 */
	public back(): void {
		this.router.navigate(['/']);
	}

	/**
	 * Navigate to create new element page
	 */
	public addNew(): void {
		this.router.navigate([`/${this.path}/new`]);
	}

	// Abstract methods that must be implemented by subclasses
	abstract getId(): string | null;
	abstract readonly path: string;
}
