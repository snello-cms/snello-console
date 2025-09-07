import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { AbstractListComponent } from '../../core/commons/components/abstract-list-component';
import { AdminHomeTopbarComponent } from '../../common/components/admin-home-topbar/admin-home-topbar.component';
import { SidebarComponent } from '../../common/components/sidebar/sidebar.component';
import { ToastService } from '../../core/toast.service';
import { DocumentModel } from '../../models/document.model';
import { DocumentService } from '../../services/document.service';

@Component({
	selector: 'app-document-list',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		TableModule,
		ButtonModule,
		InputTextModule,
		ConfirmDialogModule,
		AdminHomeTopbarComponent,
		SidebarComponent
	],
	templateUrl: './document-list.component.html'
})
export class DocumentListComponent extends AbstractListComponent<DocumentModel> implements OnInit {
	public filters: Partial<DocumentModel> = {};

	constructor(
		service: DocumentService,
		protected override router: Router,
		private confirmationService: ConfirmationService,
		protected override toastService: ToastService
	) {
		super(service, 'document');
	}

	override ngOnInit() {
		this.service.buildSearch();
		this.firstReload = true;
	}

	override getId(): string | null {
		return this.element ? (this.element as any).uuid : null;
	}

	override lazyLoad(event: TableLazyLoadEvent, datatable?: any): void {
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
		this.router.navigate(['/document/new']);
	}

	public download(uuid: string): void {
		(this.service as DocumentService).simplDownload(uuid).subscribe((response) => {
			const newBlob = new Blob([response], { type: 'application/octet-stream' });
			const downloadURL = URL.createObjectURL(newBlob);
			window.open(downloadURL);
		});
	}

	public downloadPath(uuid: string): string {
		return (this.service as DocumentService).downloadPath(uuid);
	}

	public confirmDelete(element: DocumentModel): void {
		this.confirmationService.confirm({
			message: 'Do you really want to delete this document?',
			header: 'Confirm Delete',
			icon: 'pi pi-exclamation-triangle',
			accept: () => {
				this.service.delete(element.uuid || '').subscribe({
					next: () => {
						this.toastService.addInfo('Document deleted successfully');
						this.loaddata(false);
					},
					error: (error) => this.handleError(error)
				});
			}
		});
	}
}
