import { Directive, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractService } from '../services/abstract.service';
import { AbstractNavigationEditComponent } from './abstract-navigation-edit-component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastService } from '../../toast.service';
import { Helpers } from '../../../constants/helpers';

/**
 * Abstract base component for edit/create operations
 * Provides common CRUD functionality for all entity edit components
 */
@Directive()
export abstract class AbstractEditComponent<T> extends AbstractNavigationEditComponent {
	// Dependency injection
	protected readonly toastService = inject(ToastService);
	protected readonly spinner = inject(NgxSpinnerService);
	protected readonly helpers = inject(Helpers);
	protected readonly route = inject(ActivatedRoute);
	protected override readonly router = inject(Router);

	// Component state
	public editMode = false;
	public element: T | null = null;
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
	 * Handle route parameters to determine edit or create mode
	 */
	protected handleRouteParams(params: any): void {
		const id = params['id'];

		if (id) {
			this.loadExistingEntity(id);
		} else {
			this.createNewEntity();
		}
	}

	/**
	 * Load existing entity for editing
	 */
	protected loadExistingEntity(id: string): void {
		this.editMode = true;
		this.showSpinner();

		this.service.find(id).subscribe({
			next: (element) => {
				this.element = element;
				this.hideSpinner();
				this.postFind();
			},
			error: (error) => {
				this.handleError(error);
				this.hideSpinner();
			}
		});
	}

	/**
	 * Create new entity instance
	 */
	protected createNewEntity(): void {
		this.editMode = false;
		this.element = this.createInstance();
		this.postCreate();
	}

	/**
	 * Save new entity
	 */
	public save(): void {
		if (!this.preSave()) {
			return;
		}

		this.showSpinner();
		this.editMode = false;

		this.service.persist(this.element).subscribe({
			next: (element) => {
				this.element = element;
				this.hideSpinner();
				this.postSave();
				this.navigateAfterSave();
			},
			error: (error) => {
				this.handleError(error);
				this.hideSpinner();
			}
		});
	}

	/**
	 * Update existing entity
	 */
	public update(): void {
		if (!this.preUpdate()) {
			return;
		}

		this.showSpinner();

		this.service.update(this.element).subscribe({
			next: (element) => {
				this.element = element;
				this.editMode = false;
				this.hideSpinner();
				this.postUpdate();
				this.navigateAfterUpdate();
			},
			error: (error) => {
				this.handleError(error);
				this.hideSpinner();
			}
		});
	}

	/**
	 * Delete entity
	 */
	public delete(): void {
		this.showSpinner();

		this.service.delete(this.getId()).subscribe({
			next: () => {
				this.editMode = false;
				this.hideSpinner();
				this.postDelete();
				this.navigateAfterDelete();
			},
			error: (error) => {
				this.handleError(error);
				this.hideSpinner();
			}
		});
	}

	/**
	 * Check if component is in edit mode
	 */
	public isEditMode(): boolean {
		return this.editMode;
	}

	// Spinner management
	protected showSpinner(): void {
		this.spinner.show();
	}

	protected hideSpinner(): void {
		this.spinner.hide();
	}

	// Error handling
	protected handleError(error: any): void {
		this.addError(error);
	}

	protected addError(error: any): void {
		this.toastService.addError(this.helpers.generateErrorMessage(error));
	}

	protected addWarn(message: string): void {
		this.toastService.addWarning(message);
	}

	protected addSuccess(message: string): void {
		this.toastService.addSuccess(message);
	}

	// Lifecycle hooks - override in subclasses
	protected postCreate(): void {}
	protected postFind(): void {}
	protected postSave(): void {}
	protected postUpdate(): void {}
	protected postDelete(): void {}

	// Validation hooks - override in subclasses
	protected preSave(): boolean {
		return true;
	}

	protected preUpdate(): boolean {
		return true;
	}

	// Abstract methods that must be implemented by subclasses
	abstract createInstance(): T;
	abstract override getId(): string;
}
