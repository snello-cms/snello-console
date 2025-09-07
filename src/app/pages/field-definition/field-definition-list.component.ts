import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ConfirmationService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { AbstractListComponent } from '../../core/commons/components/abstract-list-component';
import { SidebarComponent } from '../../common/components/sidebar/sidebar.component';
import { AdminHomeTopbarComponent } from '../../common/components/admin-home-topbar/admin-home-topbar.component';
import { ToastService } from '../../core/toast.service';
import { FieldDefinition } from '../../models/field-definition.model';
import { FieldDefinitionService } from '../../services/field-definition.service';
import { MetadataService } from '../../services/metadata.service';

@Component({
	selector: 'app-field-definition-list',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		SelectModule,
		TableModule,
		ButtonModule,
		InputTextModule,
		ConfirmDialogModule,
		SidebarComponent,
		AdminHomeTopbarComponent
	],
	templateUrl: './field-definition-list.component.html'
})
export class FieldDefinitionListComponent extends AbstractListComponent<FieldDefinition> implements OnInit {
	public metadatasItems: { label: string | null; value: string }[] = [];
	public metadatas: Map<string, boolean> = new Map<string, boolean>();

	constructor(
		service: FieldDefinitionService,
		protected override router: Router,
		private confirmationService: ConfirmationService,
		protected override toastService: ToastService,
		private metadataService: MetadataService
	) {
		super(service, 'fielddefinition');
		this.metadataService.buildSearch();
		this.metadataService.getAllList().subscribe((metadatas) => {
			this.metadatasItems.push({ label: null, value: '...' });
			for (let p = 0; p < metadatas.length; p++) {
				this.metadatas.set(metadatas[p].uuid, metadatas[p].created);
				this.metadatasItems.push({
					label: metadatas[p].table_name,
					value: metadatas[p].uuid
				});
			}
		});
	}

	override ngOnInit() {
		this.service.buildSearch();
		this.firstReload = true;
	}
	// Convert event type to parent's expected LazyLoadEvent
	override lazyLoad(event: any, datatable?: any): void {
		const lazyEvent: any = {
			first: event.first,
			rows: event.rows || undefined,
			sortField: Array.isArray(event.sortField) ? event.sortField[0] : event.sortField || undefined,
			sortOrder: event.sortOrder || undefined,
			multiSortMeta: event.multiSortMeta || undefined,
			filters: event.filters,
			globalFilter: event.globalFilter
		};
		super.lazyLoad(lazyEvent, datatable);
	}

	override getId(): string | null {
		return this.element ? (this.element as any).uuid : null;
	}

	public new(): void {
		this.router.navigate(['/fielddefinition/new']);
	}

	public isEditable(fieldDefinition: FieldDefinition): boolean {
		if (!this.metadatas.has(fieldDefinition.metadata_uuid)) {
			return true;
		}
		return !this.metadatas.get(fieldDefinition.metadata_uuid)!;
	}
}
