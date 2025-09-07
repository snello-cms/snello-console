import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { AbstractListComponent } from '../../core/commons/components/abstract-list-component';
import { Metadata } from '../../models/metadata.model';
import { MetadataService } from '../../services/metadata.service';
import { AdminHomeTopbarComponent } from '../../common/components/admin-home-topbar/admin-home-topbar.component';
import { SidebarComponent } from '../../common/components/sidebar/sidebar.component';
import { ToastService } from '../../core/toast.service';

@Component({
	selector: 'app-metadata-list',
	standalone: true,
	imports: [
		CommonModule,
		AsyncPipe,
		FormsModule,
		TableModule,
		ButtonModule,
		InputTextModule,
		ConfirmDialogModule,
		AdminHomeTopbarComponent,
		SidebarComponent
	],
	templateUrl: './metadata-list.component.html'
})
export class MetadataListComponent extends AbstractListComponent<Metadata> implements OnInit {
	public filters: Partial<Metadata> = {};

	constructor(
		service: MetadataService,
		protected override router: Router,
		private confirmationService: ConfirmationService,
		protected override toastService: ToastService
	) {
		super(service, 'metadata');
	}

	override ngOnInit() {
		this.service.buildSearch();
		this.firstReload = true;
	}

	override getId(): string | null {
		return this.element ? (this.element as any).uuid : null;
	}

	override lazyLoad(event: TableLazyLoadEvent, datatable?: any): void {
		// Convert TableLazyLoadEvent to LazyLoadEvent for parent class
		const lazyEvent: LazyLoadEvent = {
			first: event.first,
			rows: event.rows || undefined,
			sortField: Array.isArray(event.sortField) ? event.sortField[0] : event.sortField || undefined,
			sortOrder: event.sortOrder || undefined,
			multiSortMeta: event.multiSortMeta || undefined,
			filters: event.filters as { [s: string]: import('primeng/api').FilterMetadata } | undefined,
			globalFilter: event.globalFilter
		};
		super.lazyLoad(lazyEvent, datatable);
	}

	public new(): void {
		this.router.navigate(['/metadata/new']);
	}

	public addField(metadata: Metadata): void {
		// TODO: Implement field definition functionality
		// For now, show a message that this feature is not yet implemented
		this.toastService.addInfo('Field definition functionality is not yet implemented in snello-console');

		// Original navigation (commented out until field definition components are implemented):
		// this.router.navigate(['/fielddefinition/new'], {
		// 	queryParams: { metadata_uuid: metadata.uuid }
		// });
	}

	public createTable(metadata: Metadata): void {
		(this.service as MetadataService).createTable(metadata).subscribe({
			next: (element) => {
				this.reloadListData(metadata, element);
				this.toastService.addInfo('Table created: ' + (element?.table_name || metadata.table_name));
			},
			error: (error) => {
				console.error('createTable error:', error);
				this.handleError(error);
			}
		});
	}

	public truncateTable(metadata: Metadata): void {
		(this.service as MetadataService).truncateTable(metadata.uuid).subscribe({
			next: (element) => {
				this.reloadListData(metadata, element);
				this.toastService.addInfo('Table truncated: ' + (element?.table_name || metadata.table_name));
			},
			error: (error) => {
				console.error('truncateTable error:', error);
				this.handleError(error);
			}
		});
	}

	public deleteTable(metadata: Metadata): void {
		(this.service as MetadataService).deleteTable(metadata.uuid).subscribe({
			next: (element) => {
				this.reloadListData(metadata, element);
				this.toastService.addInfo('Table deleted: ' + (element?.table_name || metadata.table_name));
			},
			error: (error) => {
				console.error('deleteTable error:', error);
				this.handleError(error);
			}
		});
	}

	public confirmTruncateTable(metadata: Metadata): void {
		this.clearMsgs();
		this.confirmationService.confirm({
			message: 'Do you really want to truncate this table?',
			header: 'Confirm Truncate',
			icon: 'pi pi-exclamation-triangle',
			accept: () => {
				this.truncateTable(metadata);
			}
		});
	}

	public confirmCreateTable(metadata: Metadata): void {
		this.clearMsgs();
		this.confirmationService.confirm({
			message: 'Do you really want to create this table?',
			header: 'Confirm Create',
			icon: 'pi pi-question-circle',
			accept: () => {
				this.createTable(metadata);
			}
		});
	}

	public confirmDeleteTable(metadata: Metadata): void {
		this.clearMsgs();
		this.confirmationService.confirm({
			message: 'Do you really want to delete this table?',
			header: 'Confirm Delete',
			icon: 'pi pi-exclamation-triangle',
			accept: () => {
				this.deleteTable(metadata);
			}
		});
	}

	public clearMsgs(): void {
		// Clear any existing toast messages
		// This method is called before showing confirmation dialogs
		// to ensure clean UI state
	}

	// Debug method to check button visibility conditions
	public debugButtonConditions(rowData: Metadata): void {}

	private reloadListData(metadata: Metadata, element: Metadata): void {
		metadata.created = element.created;
		metadata.already_exist = element.already_exist;
		metadata.table_name = element.table_name;
		metadata.description = element.description;
		metadata.table_key = element.table_key;
		metadata.alias_table = element.alias_table;
		metadata.order_by = element.order_by;
	}

	// Remove overridden methods - let the abstract class handle navigation
}
