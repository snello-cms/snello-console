import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';

import { AbstractEditComponent } from '../../core/commons/components/abstract-edit-component';
import { AdminHomeTopbarComponent } from '../../common/components/admin-home-topbar/admin-home-topbar.component';
import { SidebarComponent } from '../../common/components/sidebar/sidebar.component';
import { ToastService } from '../../core/toast.service';
import { DocumentModel } from '../../models/document.model';
import { DocumentService } from '../../services/document.service';

@Component({
	selector: 'app-document-edit',
	standalone: true,
	imports: [CommonModule, FormsModule, ButtonModule, FileUploadModule, AdminHomeTopbarComponent, SidebarComponent],
	templateUrl: './document-edit.component.html'
})
export class DocumentEditComponent extends AbstractEditComponent<DocumentModel> implements OnInit {
	public uploading = false;
	public uploadedFile: string | undefined;
	public progress = 0;
	public processed = false;

	public displayProgressBar = false;

	@ViewChild('fileUploader', { static: false }) fileUploader: FileUpload | null = null;

	protected override element: DocumentModel = this.createInstance();

	constructor(
		router: Router,
		route: ActivatedRoute,
		private documentService: DocumentService,
		protected override toastService: ToastService,
		private cdr: ChangeDetectorRef
	) {
		super(documentService, 'document');
	}

	createInstance(): DocumentModel {
		return new DocumentModel();
	}

	override ngOnInit(): void {
		this.element = new DocumentModel();
		super.ngOnInit();
	}

	override getId(): string {
		return this.element.uuid || '';
	}

	uploadFiles(): void {
		this.displayProgressBar = true;

		if (!this.fileUploader) {
			this.displayProgressBar = false;
			return;
		}

		if (this.fileUploader && this.fileUploader.files && this.fileUploader.files.length > 0) {
			const formData = new FormData();
			const file = this.fileUploader.files[0];

			formData.append('filename', file.name);
			formData.append('table_name', this.element.table_name || '');
			formData.append('table_key', this.element.table_key || '');
			formData.append('mimeType', file.type || 'application/octet-stream');
			formData.append('file', file);

			this.documentService.uploadFile(this.element, formData).subscribe({
				next: () => {
					this.toastService.addInfo('File uploaded successfully');
					this.displayProgressBar = false;

					if (this.element.uuid) {
						this.navigateAfterUpdate();
					} else {
						this.navigateToList();
					}
				},
				error: (error) => {
					this.toastService.addError('Upload error: ' + error);
					this.displayProgressBar = false;
				}
			});
		} else {
			this.displayProgressBar = false;
		}
	}
}
