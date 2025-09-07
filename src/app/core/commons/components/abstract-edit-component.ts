import { Directive, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AbstractService } from '../services/abstract.service';
import { AbstractNavigationEditComponent } from './abstract-navigation-edit-component';
import { ToastService } from '../../toast.service';

/**
 * Abstract base component for edit operations
 * Provides common functionality for create/update operations
 */
@Directive()
export abstract class AbstractEditComponent<T> extends AbstractNavigationEditComponent<T> {
	protected readonly router = inject(Router);
	protected readonly route = inject(ActivatedRoute);
	protected toastService = inject(ToastService);

	// Component state
	protected element: T | null = null;
	public editMode = false;

	constructor(
		protected readonly service: AbstractService<T>,
		public override readonly path: string
	) {
		super();
	}

	/**
	 * Initialize component
	 */
	public ngOnInit(): void {
		this.route.params.subscribe((params) => {
			const id = params['id'];
			if (id && id !== 'new') {
				this.loadElement(id);
			} else {
				this.element = this.createInstance();
			}
		});
	}

	/**
	 * Load element by ID
	 */
	protected loadElement(id: string): void {
		this.service.find(id).subscribe({
			next: (element) => {
				this.element = element;
				this.postFind();
			},
			error: (error) => {
				this.handleError(error);
			}
		});
	}

	/**
	 * Save new element
	 */
	public save(): void {
		if (!this.preSave()) {
			return;
		}

		this.service.persist(this.element).subscribe({
			next: (element) => {
				this.element = element;
				this.postSave();
				this.navigateAfterSave();
			},
			error: (error) => {
				this.handleError(error);
			}
		});
	}

	/**
	 * Update existing element
	 */
	public update(): void {
		if (!this.preUpdate()) {
			return;
		}

		this.service.update(this.element).subscribe({
			next: (element) => {
				this.element = element;
				this.postUpdate();
				this.navigateAfterUpdate();
			},
			error: (error) => {
				this.handleError(error);
			}
		});
	}

	/**
	 * Delete element
	 */
	public delete(): void {
		if (!this.element) return;

		this.service.delete(this.getId()).subscribe({
			next: () => {
				this.postDelete();
				this.navigateToList();
			},
			error: (error) => {
				this.handleError(error);
			}
		});
	}

	/**
	 * Navigate to list after save
	 */
	protected navigateAfterSave(): void {
		this.navigateToList();
	}

	/**
	 * Navigate to list after update
	 */
	protected navigateAfterUpdate(): void {
		this.navigateToList();
	}

	/**
	 * Navigate to list
	 */
	public navigateToList(): void {
		this.router.navigate([`/${this.path}`]);
	}

	/**
	 * Handle errors
	 */
	protected handleError(error: any): void {
		this.toastService.addError(error);
	}

	// Lifecycle hooks - override in subclasses
	protected preSave(): boolean {
		return true;
	}
	protected preUpdate(): boolean {
		return true;
	}
	protected postFind(): void {}
	protected postSave(): void {}
	protected postUpdate(): void {}
	protected postDelete(): void {}

	// Abstract methods that must be implemented by subclasses
	abstract createInstance(): T;
	abstract getId(): string;
}
