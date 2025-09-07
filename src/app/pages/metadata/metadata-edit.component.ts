import { Component, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { AbstractEditComponent } from '../../core/commons/components/abstract-edit-component';
import { Metadata } from '../../models/metadata.model';
import { MetadataService } from '../../services/metadata.service';
import { FONT_AWESOME_ICONS, SelectItem } from '../../constants/metadata.constants';
import { AdminHomeTopbarComponent } from '../../common/components/admin-home-topbar/admin-home-topbar.component';
import { SidebarComponent } from '../../common/components/sidebar/sidebar.component';
import { ToastService } from '../../core/toast.service';

@Component({
	selector: 'app-metadata-edit',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ButtonModule,
		InputTextModule,
		SelectModule,
		ToggleSwitchModule,
		AdminHomeTopbarComponent,
		SidebarComponent
	],
	templateUrl: './metadata-edit.component.html'
})
export class MetadataEditComponent extends AbstractEditComponent<Metadata> implements OnInit {
	public newtable = signal(true);
	public advanced = signal(false);

	protected override element: Metadata = this.createInstance();

	public tableTypeSelect: SelectItem[] = [
		{ value: 'uuid', label: 'uuid' },
		{ value: 'slug', label: 'slug' },
		{ value: 'autoincrement', label: 'auto increment' }
	];

	public iconItems: SelectItem[] = FONT_AWESOME_ICONS;

	constructor(
		router: Router,
		route: ActivatedRoute,
		service: MetadataService,
		protected override toastService: ToastService,
		private cdr: ChangeDetectorRef
	) {
		super(service, 'metadata');
	}

	override ngOnInit(): void {
		this.route.params.subscribe((params) => {
			const id = params['id'];

			if (id && id !== 'new') {
				this.editMode = true;
				this.loadElement(id);
			} else {
				this.editMode = false;
				this.element = this.createInstance();
				this.initializeNewElement();

				// Trigger change detection for new elements
				setTimeout(() => {
					this.cdr.detectChanges();
				}, 0);
			}
		});
	}

	private initializeNewElement(): void {
		this.element.table_key = 'uuid';
		this.element.table_key_type = 'uuid';
		this.element.icon = FONT_AWESOME_ICONS[0].value;
		this.element.already_exist = false;
	}

	protected override loadElement(id: string): void {
		this.service.find(id).subscribe({
			next: (element) => {
				this.element = element;
				this.postFind();

				// Trigger change detection to update the UI
				// Use setTimeout to ensure it runs after the current execution cycle
				setTimeout(() => {
					this.cdr.detectChanges();
				}, 0);
			},
			error: (error) => {
				console.error('Error loading element:', error);
				this.handleError(error);
			}
		});
	}

	protected override postFind(): void {
		if (this.element.uuid) {
			// Set newtable based on already_exist flag
			// If already_exist is true, then it's NOT a new table
			this.newtable.set(!this.element.already_exist);

			// Trigger change detection after updating signals
			setTimeout(() => {
				this.cdr.detectChanges();
			}, 0);
		}
	}

	createInstance(): Metadata {
		return new Metadata();
	}

	override getId(): string {
		return this.element.uuid || '';
	}

	getIconLabel(iconValue: string): string {
		const icon = this.iconItems.find((item) => item.value === iconValue);
		return icon ? icon.label : iconValue;
	}

	protected override preSave(): boolean {
		this.element.already_exist = !this.newtable();
		// Only set fields that are actually used in the form
		// Don't initialize fields and conditions arrays - they should be undefined
		return true;
	}

	protected override preUpdate(): boolean {
		this.element.already_exist = !this.newtable();
		// Only set fields that are actually used in the form
		// Don't initialize fields and conditions arrays - they should be undefined
		return true;
	}

	protected navigateAfterSaveOrUpdate(): void {
		if (this.path) {
			this.router.navigate(['/metadata/view', this.element.uuid]);
		} else {
			this.router.navigate(['/metadata']);
		}
	}

	protected override postSave(): void {
		this.toastService.addInfo('Metadata saved successfully');
	}

	protected override postUpdate(): void {
		this.toastService.addInfo('Metadata updated successfully');
	}

	override navigateToList(): void {
		this.router.navigate(['/metadata']);
	}

	protected override navigateAfterSave(): void {
		this.navigateAfterSaveOrUpdate();
	}

	protected override navigateAfterUpdate(): void {
		this.navigateAfterSaveOrUpdate();
	}

	public confirmDelete(): void {
		// Implementation for delete confirmation
		if (confirm('Are you sure you want to delete this metadata?')) {
			this.service.delete(this.getId()).subscribe({
				next: () => {
					this.toastService.addInfo('Metadata deleted successfully');
					this.navigateToList();
				},
				error: (error) => {
					this.toastService.addError('Error deleting metadata: ' + error);
				}
			});
		}
	}
}
