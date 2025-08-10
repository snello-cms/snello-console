import { Directive, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractService } from '../services/abstract.service';
import { AbstractNavigationViewComponent } from './abstract-navigation-view-component';
import { ToastService } from '../../toast.service';
import { Helpers } from '../../../constants/helpers';

/**
 * Abstract base component for view operations
 * Provides common view functionality for all entity view components
 */
@Directive()
export abstract class AbstractViewComponent<T> extends AbstractNavigationViewComponent<T> {
	// Dependency injection
	protected readonly toastService = inject(ToastService);
	protected readonly helpers = inject(Helpers);
	protected readonly route = inject(ActivatedRoute);
	protected override readonly router = inject(Router);

	// Component state
	public editMode = false;
	public override element: T | null = null;
	public savedError: any = null;

	constructor(
		protected readonly service: AbstractService<T>,
		public override readonly path: string
	) {
		super();
	}

	/**
	 * Initialize component and load data
	 */
	public ngOnInit(): void {
		this.route.params.subscribe({
			next: (params) => this.handleRouteParams(params),
			error: (error) => this.handleError(error)
		});
	}

	/**
	 * Handle route parameters to load entity data
	 */
	protected handleRouteParams(params: any): void {
		const id = params['id'];

		if (id) {
			this.loadEntity(id);
		} else {
			this.handleError('Error loading data: No ID provided.');
		}
	}

	/**
	 * Load entity data by ID
	 */
	protected loadEntity(id: string): void {
		this.editMode = true;

		this.service.find(id).subscribe({
			next: (element) => {
				this.element = element;
				this.postFind();
			},
			error: (error) => this.handleError(error)
		});
	}

	/**
	 * Handle errors
	 */
	protected handleError(error: any): void {
		this.addError(error);
	}

	/**
	 * Add error message to toast
	 */
	protected addError(error: any): void {
		this.toastService.addError(this.helpers.generateErrorMessage(error));
	}

	// Lifecycle hooks - override in subclasses
	protected postFind(): void {}
}
