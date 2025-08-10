import { inject } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Abstract base component for navigation in edit components
 * Provides common navigation functionality for edit/create operations
 */
export abstract class AbstractNavigationEditComponent {
	protected readonly router = inject(Router);

	/**
	 * Navigate to list view
	 */
	public goToList(): void {
		this.navigateToList();
	}

	/**
	 * Navigate after successful delete operation
	 */
	protected navigateAfterDelete(): void {
		this.router.navigate([`/${this.path}/list`]);
	}

	/**
	 * Navigate after successful update operation
	 */
	protected navigateAfterUpdate(): void {
		this.router.navigate([`/${this.path}/view`, this.getId()]);
	}

	/**
	 * Navigate after successful save operation
	 */
	protected navigateAfterSave(): void {
		this.router.navigate([`/${this.path}/view`, this.getId()]);
	}

	/**
	 * Navigate to list view
	 */
	protected navigateToList(): void {
		this.router.navigate([`/${this.path}/list`]);
	}

	// Abstract methods that must be implemented by subclasses
	abstract getId(): string;
	abstract readonly path: string;
}
