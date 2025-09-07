import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AbstractService } from '../core/commons/services/abstract.service';
import { Metadata } from '../models/metadata.model';
import { FieldDefinition } from '../models/field-definition.model';
import { ConfigurationService } from './configuration.service';
import { METADATA_API_PATH } from '../constants/constants';

@Injectable({
	providedIn: 'root'
})
export class MetadataService extends AbstractService<Metadata> {
	private nameToMetadata: Map<string, Metadata> = new Map();

	constructor(private configurationService: ConfigurationService) {
		super(configurationService.getValueObservable(METADATA_API_PATH));
		// Debug: Log the URL when it's available
		configurationService.getValueObservable(METADATA_API_PATH).subscribe((url) => {});
	}

	/**
	 * Get entity ID
	 */
	getId(element: Metadata | null): string {
		return element?.uuid || '';
	}

	/**
	 * Build search criteria
	 */
	buildSearch(): void {
		this.search = {
			table_name_contains: '',
			uuid: '',
			_limit: 10
		};
	}

	/**
	 * Generate field definition with values
	 */
	generateFieldDefinition(
		arrayFromServer: FieldDefinition[],
		valuesMap: Map<string, any>,
		visualization: string
	): FieldDefinition[] {
		for (let i = 0; i < arrayFromServer.length; i++) {
			arrayFromServer[i].value = valuesMap.get(arrayFromServer[i].name || '');
		}
		return arrayFromServer;
	}

	/**
	 * View metadata
	 */
	viewMetadata(name: string, id: string): Observable<FieldDefinition[]> {
		// TODO: Implement based on API endpoint
		return of([]);
	}

	/**
	 * Create new metadata
	 */
	newMetadata(name: string): Observable<FieldDefinition[]> {
		// TODO: Implement based on API endpoint
		return of([]);
	}

	/**
	 * Get metadata by name
	 */
	getMetadataFromName(name: string): Metadata | undefined {
		return this.nameToMetadata.get(name);
	}

	/**
	 * Create table in database
	 */
	createTable(metadata: Metadata): Observable<Metadata> {
		return this.httpClient
			.get<Metadata>(`${this.url}/${metadata.uuid}/create`)
			.pipe(catchError(this.handleError.bind(this)));
	}

	/**
	 * Delete table from database
	 */
	deleteTable(uuid: string): Observable<Metadata> {
		return this.httpClient
			.get<Metadata>(`${this.url}/${uuid}/delete`)
			.pipe(catchError(this.handleError.bind(this)));
	}

	/**
	 * Truncate table in database
	 */
	truncateTable(uuid: string): Observable<Metadata> {
		return this.httpClient
			.get<Metadata>(`${this.url}/${uuid}/truncate`)
			.pipe(catchError(this.handleError.bind(this)));
	}

	/**
	 * Post processing after list is loaded
	 */
	protected override postList(metadataList: Metadata[]): void {
		super.postList(metadataList);
		// Build name to metadata map for quick lookup
		for (const metadata of metadataList) {
			this.nameToMetadata.set(metadata.table_name, metadata);
		}
	}
}
