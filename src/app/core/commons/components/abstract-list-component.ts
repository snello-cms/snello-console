import { Directive, HostListener, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';

import { LazyLoadEvent } from 'primeng/api';
import { Popover } from 'primeng/popover';
import { Table, TableLazyLoadEvent } from 'primeng/table';

import { AbstractService } from '../services/abstract.service';
import { AbstractNavigationListComponent } from './abstract-navigation-list-component';
import { ToastService } from '../../toast.service';
import { Helpers } from '../../../constants/helpers';

/**
 * Abstract base component for list operations
 * Provides common list functionality for all entity list components
 */
@Directive()
export abstract class AbstractListComponent<T> extends AbstractNavigationListComponent<T> {
	// ViewChild references
	@ViewChild('op') protected op: Popover | null = null;
	@ViewChild('datatable') protected table?: Table;

	// Dependency injection
	protected readonly toastService = inject(ToastService);
	protected readonly spinner = inject(NgxSpinnerService);
	protected readonly helpers = inject(Helpers);
	protected override readonly router = inject(Router);

	// Component state
	public model: T[] = [];
	public firstReload = true;
	public displaySidebar = false;

	// Search state
	public labels: { [k: string]: string } = {};
	public values: { [k: string]: string } = {};

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
		this.service.buildSearch();
		this.firstReload = true;
	}

	/**
	 * Handle Enter key press for search
	 */
	@HostListener('document:keyup.enter')
	protected onKeydownHandler(): void {
		if (this.op?.overlayVisible && this.table) {
			this.reload(this.table);
		}
	}

	/**
	 * Toggle sidebar visibility
	 */
	public toggleSidebar(): void {
		this.displaySidebar = !this.displaySidebar;
	}

	/**
	 * Load data from service (like snello-admin)
	 */
	public loaddata(firstReload: boolean, datatable?: any): void {
		this.preLoaddata();
		// Set firstReload before making the API call to avoid change detection issues
		this.firstReload = firstReload;

		this.service.getList().subscribe({
			next: (model) => {
				// Don't use setTimeout to avoid unnecessary delays
				this.model = model;
				this.postList();
			},
			error: (error) => {
				this.handleError(error);
			}
		});
	}

	/**
	 * Handle lazy loading for PrimeNG table (like snello-admin)
	 */
	public lazyLoad(event: LazyLoadEvent, datatable?: any): void {
		if (!this.firstReload && event.first !== undefined) {
			this.service._start = event.first;
		}

		if (event.rows !== undefined) {
			this.service._limit = event.rows;
		}

		this.preLoad(event, datatable);
		this.loaddata(this.firstReload, datatable);

		if (this.firstReload) {
			this.firstReload = false;
		}
	}

	/**
	 * Refresh table data
	 */
	public refresh(datatable: Table): void {
		if (datatable.lazy) {
			datatable.reset();
		} else {
			this.lazyLoad({}, datatable);
		}
	}

	/**
	 * Reload table data and reset pagination
	 */
	public reload(datatable: Table): void {
		if (this.service.search) {
			this.service._start = 0;
		}
		this.refresh(datatable);

		if (this.displaySidebar) {
			this.toggleSidebar();
		}
	}

	/**
	 * Reset search criteria and reload
	 */
	public reset(datatable: Table): void {
		this.service.buildSearch();
		this.refresh(datatable);

		if (this.displaySidebar) {
			this.toggleSidebar();
		}
	}

	/**
	 * Set default search criteria
	 */
	protected defaultCriteria(): void {
		this.service.buildSearch();
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

	// Lifecycle hooks - override in subclasses
	protected preLoaddata(): void {}
	protected preLoad(event: TableLazyLoadEvent, datatable?: any): void {
		if (event.sortField && event.sortOrder && this.service.search) {
			this.service.search.orderBy = event.sortField + (event.sortOrder > 0 ? ' ASC' : ' DESC');
		}
	}
	protected postList(): void {}
	protected postSave(): void {}
	protected postUpdate(): void {}
	protected postDelete(): void {}

	// Abstract methods that must be implemented by subclasses
	abstract override getId(): string | null;
}
