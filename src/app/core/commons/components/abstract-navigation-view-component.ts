import { inject } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Abstract base component for navigation in view components
 * Provides common navigation functionality for view operations
 */
export abstract class AbstractNavigationViewComponent<T> {
	protected readonly router = inject(Router);

	/** Currently displayed element */
	public element: T | null = null;

	/**
	 * Navigate to list view
	 */
	public goToList(): void {
		this.navigateToList();
	}

	/**
	 * Navigate to list view
	 */
	protected navigateToList(): void {
		this.router.navigate([`/${this.path}/list`]);
	}

	/**
	 * Navigate to edit page for current element
	 */
	public edit(element: T | null): void {
		this.element = element;
		this.router.navigate([`/${this.path}/edit`, this.getId()]);
	}

	// Abstract methods that must be implemented by subclasses
	abstract getId(): string | null;
	abstract readonly path: string;
}
