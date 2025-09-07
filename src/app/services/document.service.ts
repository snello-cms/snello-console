import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AbstractService } from '../core/commons/services/abstract.service';
import { ConfigurationService } from './configuration.service';
import { DOCUMENT_API_PATH } from '../constants/constants';
import { DocumentModel } from '../models/document.model';

@Injectable({
	providedIn: 'root'
})
export class DocumentService extends AbstractService<DocumentModel> {
	constructor(private configurationService: ConfigurationService) {
		super(configurationService.getValueObservable(DOCUMENT_API_PATH));
	}

	getId(element: DocumentModel | null): string {
		return element?.uuid || '';
	}

	buildSearch(): void {
		this.search = {
			table_name_contains: '',
			table_key_contains: '',
			uuid: '',
			_limit: 10
		};
	}

	uploadFile(document: DocumentModel, body: FormData): Observable<any> {
		if (document.uuid) {
			return this.httpClient
				.put<FormData>(`${this.url}/${document.uuid}`, body)
				.pipe(catchError(this.handleError.bind(this)));
		} else {
			return this.httpClient.post<FormData>(this.url, body).pipe(catchError(this.handleError.bind(this)));
		}
	}

	simplDownload(uuid: string): Observable<Blob> {
		return this.httpClient.get(`${this.url}/${uuid}/download`, { responseType: 'blob' as const });
	}

	downloadPath(uuid: string): string {
		return `${this.url}/${uuid}/download`;
	}

	download(uuid: string): Observable<Blob | null> {
		return this.simplDownload(uuid).pipe(
			map((res) => {
				if (res.size === 0) {
					return null;
				}
				return new Blob([res], { type: 'application/octet-stream' });
			}),
			catchError(this.handleError.bind(this))
		);
	}
}
