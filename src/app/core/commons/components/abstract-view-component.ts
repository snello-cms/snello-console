import { Directive, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AbstractService } from '../services/abstract.service';
import { AbstractNavigationViewComponent } from './abstract-navigation-view-component';
import { ToastService } from '../../toast.service';

/**
 * Abstract base component for view operations
 * Provides common functionality for display/view operations
 */
@Directive()
export abstract class AbstractViewComponent<T> extends AbstractNavigationViewComponent<T> {
	protected readonly router = inject(Router);
	protected readonly route = inject(ActivatedRoute);
	protected toastService = inject(ToastService);

	// Component state
	protected element: T | null = null;

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
			if (id) {
				this.loadElement(id);
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
	 * Navigate to edit page
	 */
	public edit(): void {
		this.router.navigate([`/${this.path}/edit`, this.getId()]);
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
	protected postFind(): void {}

	// Abstract methods that must be implemented by subclasses
	abstract createInstance(): T;
	abstract getId(): string;
}
