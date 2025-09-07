import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
// Note: Using native textarea instead of PrimeNG InputTextarea
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ButtonModule } from 'primeng/button';

import { AbstractEditComponent } from '../../core/commons/components/abstract-edit-component';
import { SidebarComponent } from '../../common/components/sidebar/sidebar.component';
import { AdminHomeTopbarComponent } from '../../common/components/admin-home-topbar/admin-home-topbar.component';
import { ToastService } from '../../core/toast.service';
import { FieldDefinition, MAP_INPUT_TO_FIELD } from '../../models/field-definition.model';
import { FieldDefinitionService } from '../../services/field-definition.service';
import { Metadata } from '../../models/metadata.model';
import { MetadataService } from '../../services/metadata.service';
import { map, switchMap, of } from 'rxjs';

@Component({
	selector: 'app-field-definition-edit',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		SelectModule,
		InputTextModule,
		ToggleSwitchModule,
		ButtonModule,
		SidebarComponent,
		AdminHomeTopbarComponent
	],
	templateUrl: './field-definition-edit.component.html'
})
export class FieldDefinitionEditComponent extends AbstractEditComponent<FieldDefinition> implements OnInit {
	protected override element: FieldDefinition = this.createInstance();
	metadatas: Metadata[] = [];
	metadatasSelect: { value: string; label: string }[] = [];
	fieldType: string = '';
	pageBack: string = '';
	uuidBack: string = '';
	public advanced = false;

	fieldTypes: { value: string; label: string }[] = [];

	mapFieldToType: Map<string, string> = new Map();
	mapMetadata: Map<string, Metadata> = new Map();

	tabs: { value: string; label: string }[] = [];
	groups: { value: string; label: string }[] = [];

	tabToGroups: Map<string, { value: string; label: string }[]> = new Map();
	searchConditionItems: { label: string; value: string }[] = [
		{ label: 'equals', value: '' },
		{ label: 'not equals', value: 'ne' },
		{ label: 'less than', value: 'lt' },
		{ label: 'greater than', value: 'gt' },
		{ label: 'less or equal', value: 'lte' },
		{ label: 'greater or equal', value: 'gte' },
		{ label: 'contains', value: 'contains' },
		{ label: 'contanins case insensitve', value: 'containss' }
	];

	componentDefaultValuesMapper: any = {
		string: 'containss',
		text: 'containss',
		number: '',
		decimal: '',
		password: '',
		email: '',
		select: '',
		date: '',
		datetime: '',
		time: '',
		boolean: '',
		tinymce: 'containss',
		monaco: 'containss',
		tags: 'containss',
		join: '',
		multijoin: 'containss',
		media: 'null'
	};

	constructor(
		router: Router,
		route: ActivatedRoute,
		service: FieldDefinitionService,
		protected override toastService: ToastService,
		private metadataService: MetadataService
	) {
		super(service, 'fielddefinition');
		for (const key of Array.from(MAP_INPUT_TO_FIELD.keys())) {
			this.fieldTypes.push({ value: key, label: key });
			this.mapFieldToType.set(MAP_INPUT_TO_FIELD.get(key)[0] + MAP_INPUT_TO_FIELD.get(key)[1], key);
		}
	}

	override getId(): string {
		return this.element?.uuid || '';
	}

	override ngOnInit(): void {
		this.metadatas = [];
		this.metadatasSelect = [];
		this.element = new FieldDefinition();

		if (this.route.snapshot.queryParamMap.has('pageBack')) {
			this.pageBack = this.route.snapshot.queryParams['pageBack'];
		}
		if (this.route.snapshot.queryParamMap.has('uuidBack')) {
			this.uuidBack = this.route.snapshot.queryParams['uuidBack'];
		}

		const id: string = this.route.snapshot.params['id'];
		this.metadataService
			.getList()
			.pipe(
				map((metadataList) => {
					this.valorizeMetadatas(metadataList);
					return metadataList;
				}),
				switchMap(() => {
					if (id) {
						return this.service.find(id);
					}
					return of(null);
				}),
				map((element) => {
					if (element) {
						this.element = element as FieldDefinition;
						this.postFind();
					} else {
						this.editMode = false;
						this.element = this.createInstance();
					}
				})
			)
			.subscribe({
				error: (error) => this.handleError('Error while loading data ' + (error || ''))
			});
	}

	valorizeMetadatas(metadataList: Metadata[]) {
		this.metadatas = metadataList;
		for (let i = 0; i < this.metadatas.length; i++) {
			if (!this.metadatas[i].created) {
				this.metadatasSelect.push({ value: this.metadatas[i].uuid, label: this.metadatas[i].table_name });
				this.mapMetadata.set(this.metadatas[i].uuid, this.metadatas[i]);
			}
		}
	}

	protected override preSave(): boolean {
		this.pre();
		if (this.element.searchable) {
			this.element.search_field_name =
				this.element.search_condition === ''
					? this.element.name || ''
					: (this.element.name || '') + '_' + this.element.search_condition;
		}
		return super.preSave();
	}

	protected override preUpdate(): boolean {
		this.pre();
		if (this.element.searchable) {
			this.element.search_field_name =
				this.element.search_condition === ''
					? this.element.name || ''
					: (this.element.name || '') + '_' + this.element.search_condition;
		}
		return super.preUpdate();
	}

	private pre(): void {
		const fieldDefTypes = MAP_INPUT_TO_FIELD.get(this.fieldType);
		const meta = this.mapMetadata.get(this.element.metadata_uuid);
		this.element.metadata_name = meta ? meta.table_name : '';
		this.element.type = fieldDefTypes[0];
		this.element.input_type = fieldDefTypes[1];
		delete (this.element as any).value;
		delete (this.element as any).is_edit;
	}

	createInstance(): FieldDefinition {
		return new FieldDefinition();
	}

	protected override postFind(): void {
		if (!this.element.input_type) {
			this.element.input_type = null as any;
		}
		this.fieldType = this.mapFieldToType.get(this.element.type + this.element.input_type) || '';
		super.postFind();
	}

	changedMetadata(event: any) {
		this.element.tab_name = undefined;
		this.element.group_name = undefined;
		this.tabs = [];
		this.groups = [];
		const meta = this.mapMetadata.get(event.value);
		if (!meta || !meta.tab_groups) {
			return;
		}
		if (meta.tab_groups.includes(';')) {
			const tabsAndGroups = meta.tab_groups.split(';');
			for (const singleTabAndGroups of tabsAndGroups) {
				this.splitTabsAndGroups(singleTabAndGroups);
			}
		}
		if (!meta.tab_groups.includes(';') && meta.tab_groups.includes(',')) {
			const grouped = meta.tab_groups.split(',');
			for (const group of grouped) {
				this.groups.push({ label: group, value: group });
			}
		}
	}

	changedTab(event: any) {
		this.element.group_name = undefined;
		this.groups = this.tabToGroups.get(event.value) || [];
	}

	private splitTabsAndGroups(singleTabAndGroups: string) {
		const splittedTabGroups = singleTabAndGroups.split(':');
		if (!this.tabs) {
			this.tabs = [];
		}
		this.tabs.push({ label: splittedTabGroups[0], value: splittedTabGroups[0] });
		if (splittedTabGroups.length > 1) {
			const groups = splittedTabGroups[1].split(',');
			const selectItemArray: { value: string; label: string }[] = [];
			for (const group of groups) {
				selectItemArray.push({ label: group, value: group });
			}
			this.tabToGroups.set(splittedTabGroups[0], selectItemArray);
		}
	}

	next(uuid: string) {
		this.editMode = false;
		this.preSave();
		this.service.persist(this.element).subscribe({
			next: (element) => {
				this.toastService.addInfo('Saved');
				this.element = element;
				this.element = this.createInstance();
				this.element.metadata_uuid = uuid;
				this.fieldType = '';
			},
			error: (error) => this.handleError('Save error: ' + error)
		});
	}

	changedFieldType(event: any) {
		this.element.search_condition = this.componentDefaultValuesMapper[event.value];
	}
}
