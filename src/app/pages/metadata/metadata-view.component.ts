import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from 'primeng/tabs';

import { AbstractViewComponent } from '../../core/commons/components/abstract-view-component';
import { Metadata } from '../../models/metadata.model';
import { FieldDefinition } from '../../models/field-definition.model';
import { MetadataService } from '../../services/metadata.service';
import { FieldDefinitionService } from '../../services/field-definition.service';
import { AdminHomeTopbarComponent } from '../../common/components/admin-home-topbar/admin-home-topbar.component';
import { SidebarComponent } from '../../common/components/sidebar/sidebar.component';
import { ToastService } from '../../core/toast.service';
import { ConfirmationService } from 'primeng/api';

@Component({
	selector: 'app-metadata-view',
	standalone: true,
	imports: [
		CommonModule,
		ButtonModule,
		TableModule,
		Tabs,
		TabList,
		Tab,
		TabPanels,
		TabPanel,
		AdminHomeTopbarComponent,
		SidebarComponent
	],
	templateUrl: './metadata-view.component.html'
})
export class MetadataViewComponent extends AbstractViewComponent<Metadata> implements OnInit {
	public fieldDefinitions: FieldDefinition[] = [];
	public colspan = 3;

	protected override element: Metadata = this.createInstance();

	constructor(
		router: Router,
		route: ActivatedRoute,
		service: MetadataService,
		protected override toastService: ToastService,
		private confirmationService: ConfirmationService,
		private fieldDefinitionService: FieldDefinitionService
	) {
		super(service, 'metadata');
	}

	override ngOnInit(): void {
		this.element = this.createInstance();
		super.ngOnInit();
	}

	createInstance(): Metadata {
		return {
			uuid: '',
			table_name: '',
			select_fields: '',
			search_fields: '',
			description: '',
			alias_table: '',
			alias_condition: '',
			table_key: '',
			creation_query: '',
			order_by: '',
			table_key_type: '',
			table_key_addition: '',
			icon: '',
			tab_groups: '',
			created: false,
			already_exist: false,
			fields: [],
			conditions: []
		};
	}

	override getId(): string {
		return this.element?.uuid || '';
	}

	protected override postFind(): void {
		super.postFind();
		// Load field definitions for this metadata
		this.fieldDefinitionService.buildSearch();
		if (this.fieldDefinitionService.search) {
			(this.fieldDefinitionService.search as any).metadata_uuid = this.element.uuid;
		}

		this.fieldDefinitionService.getAllList().subscribe({
			next: (fieldDefinitions) => {
				this.fieldDefinitions = fieldDefinitions;
			},
			error: (error) => {
				this.toastService.addError('Error loading field definitions: ' + error);
			}
		});
	}

	override edit(): void {
		this.router.navigate(['/metadata/edit', this.getId()]);
	}

	public createTable(): void {
		(this.service as MetadataService).createTable(this.element!).subscribe({
			next: (element) => {
				this.element = element;
				this.toastService.addInfo('Table created: ' + element.table_name);
			},
			error: (error) => {
				this.toastService.addError('Error creating table: ' + error);
			}
		});
	}

	public truncateTable(): void {
		(this.service as MetadataService).truncateTable(this.element.uuid).subscribe({
			next: (element) => {
				this.element = element;
				this.toastService.addInfo('Table truncated: ' + element.table_name);
			},
			error: (error) => {
				this.toastService.addError('Error truncating table: ' + error);
			}
		});
	}

	public deleteTable(): void {
		(this.service as MetadataService).deleteTable(this.element.uuid).subscribe({
			next: (element) => {
				this.element = element;
				this.toastService.addInfo('Table deleted: ' + element.table_name);
			},
			error: (error) => {
				this.toastService.addError('Error deleting table: ' + error);
			}
		});
	}

	public confirmTruncateTable(): void {
		this.confirmationService.confirm({
			message: 'Do you really want to truncate this table?',
			header: 'Confirm Truncate',
			icon: 'pi pi-exclamation-triangle',
			accept: () => this.truncateTable()
		});
	}

	public confirmCreateTable(): void {
		this.confirmationService.confirm({
			message: 'Do you really want to create this table?',
			header: 'Confirm Create',
			icon: 'pi pi-question-circle',
			accept: () => this.createTable()
		});
	}

	public confirmDeleteTable(): void {
		this.confirmationService.confirm({
			message: 'Do you really want to delete this table?',
			header: 'Confirm Delete',
			icon: 'pi pi-exclamation-triangle',
			accept: () => this.deleteTable()
		});
	}

	public editField(fieldDefinition: FieldDefinition): void {
		this.router.navigate(['/fielddefinition/edit', fieldDefinition.uuid], {
			queryParams: {
				pageBack: '/metadata/view',
				uuidBack: this.element.uuid
			}
		});
	}

	public newFieldDefinition(): void {
		this.router.navigate(['/fielddefinition/new'], {
			queryParams: {
				metadata_uuid: this.element.uuid,
				pageBack: '/metadata/view',
				uuidBack: this.element.uuid
			}
		});
	}
}
