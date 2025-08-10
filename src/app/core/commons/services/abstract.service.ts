import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Search } from '../models/search.model';
import moment from 'moment/moment';

/**
 * Abstract base service for CRUD operations
 * Provides common functionality for all entity services
 */
export abstract class AbstractService<T> {
	protected readonly httpClient = inject(HttpClient);

	// State management
	protected readonly listSizeSubject = new BehaviorSubject<number>(0);
	public readonly listSize$ = this.listSizeSubject.asObservable();

	protected readonly progressSubject = new BehaviorSubject<number>(0);
	public readonly progress$ = this.progressSubject.asObservable();

	// Search state
	public search: Search<T> | null = null;

	constructor(protected readonly url: string) {
		this.initialize();
	}

	/**
	 * Initialize service state
	 */
	protected initialize(): void {
		this.buildSearch();
		this.init();
	}

	/**
	 * Override for additional initialization
	 */
	protected init(): void {}

	/**
	 * Get paginated list of entities
	 */
	public getList(): Observable<T[]> {
		const params = this.buildHttpParams(this.search);

		return this.httpClient.get<T[]>(this.url, { params }).pipe(
			map((entities) => {
				this.postList(entities);
				return entities;
			}),
			catchError(this.handleError.bind(this))
		);
	}

	/**
	 * Get autocomplete list (limited to 20 items)
	 */
	public getAutoCompleteList(): Observable<T[]> {
		if (this.search) {
			this.search.pageSize = 20;
		}

		const params = this.buildHttpParams(this.search);

		return this.httpClient.get<T[]>(this.url, { params }).pipe(catchError(this.handleError.bind(this)));
	}

	/**
	 * Get all entities without pagination
	 */
	public getAllList(search?: Search<T>): Observable<T[]> {
		const searchParams = search || this.search;
		if (searchParams) {
			searchParams.pageSize = 0;
			searchParams.startRow = 0;
		}

		const params = this.buildHttpParams(searchParams);

		return this.httpClient.get<T[]>(this.url, { params }).pipe(
			map((entities) => {
				this.postList(entities);
				return entities;
			}),
			catchError(this.handleError.bind(this))
		);
	}

	/**
	 * Get total count of entities
	 */
	public getListSize(): number {
		return this.listSizeSubject.value;
	}

	/**
	 * Get total count from server
	 */
	public size(): Observable<number> {
		if (this.search) {
			this.search.startRow = 0;
			this.search.pageSize = 1;
		}

		const params = this.buildHttpParams(this.search);

		return this.httpClient
			.get<number>(`${this.url}/listSize`, { params })
			.pipe(catchError(this.handleError.bind(this)));
	}

	/**
	 * Find entity by ID
	 */
	public find(id: string): Observable<T> {
		return this.httpClient
			.get<T>(`${this.url}/${id}`)
			.pipe(map(this.handleFindResponse.bind(this)), catchError(this.handleError.bind(this)));
	}

	/**
	 * Create new entity
	 */
	public persist(element: T | null): Observable<T> {
		return this.httpClient.post<T>(this.url, element).pipe(catchError(this.handleError.bind(this)));
	}

	/**
	 * Update existing entity
	 */
	public update(element: T | null): Observable<T> {
		const id = this.getId(element);
		return this.httpClient.put<T>(`${this.url}/${id}`, element).pipe(catchError(this.handleError.bind(this)));
	}

	/**
	 * Delete entity by ID
	 */
	public delete(id: string | null): Observable<void> {
		return this.httpClient.delete<void>(`${this.url}/${id}`).pipe(catchError(this.handleError.bind(this)));
	}

	/**
	 * Upload file with progress tracking
	 */
	public upload(uuid: string, file: File, externalType?: string): Observable<any> {
		const formData = new FormData();
		formData.append('filename', file.name);
		formData.append('file', file);
		formData.append('mime_type', file.type);
		formData.append('external_uuid', uuid);

		if (externalType) {
			formData.append('external_type', externalType);
		}

		return this.httpClient.post(this.url, formData).pipe(catchError(this.handleError.bind(this)));
	}

	/**
	 * Build HTTP parameters from search object
	 */
	protected buildHttpParams(search: Search<T> | null): HttpParams {
		let params = new HttpParams();
		if (search) {
			params = this.applyRestrictions(params, search);
		}
		return params;
	}

	/**
	 * Apply search restrictions to HTTP parameters
	 */
	protected applyRestrictions(params: HttpParams, search: any, prefix = ''): HttpParams {
		const paramPrefix = prefix ? `${prefix}.` : '';

		for (const key in search) {
			if (search[key] !== null && search[key] !== undefined) {
				if (!(search[key] instanceof Object) || search[key] instanceof Date) {
					const value = this.toQueryParam(paramPrefix + key, search[key]);
					params = params.set(paramPrefix + key, value);
				} else {
					params = this.applyRestrictions(params, search[key], paramPrefix + key);
				}
			}
		}
		return params;
	}

	/**
	 * Convert value to query parameter format
	 */
	protected toQueryParam(field: string, value: any): string {
		if (value instanceof Date) {
			return moment(value).utc(true).format('YYYY-MM-DD HH:mm:ss');
		}
		return String(value);
	}

	/**
	 * Handle find response
	 */
	protected handleFindResponse(entity: T): T {
		this.postFind(entity);
		return entity;
	}

	/**
	 * Handle errors
	 */
	protected handleError(error: any): Observable<never> {
		console.error('Service error:', error);
		throw error;
	}

	/**
	 * Create new instance of type T
	 */
	protected newInstance<T>(type: new () => T): T {
		return new type();
	}

	/**
	 * Check if all inner objects are empty
	 */
	protected allInnerObjectsAreEmpty(obj: any): boolean {
		return Object.values(obj)
			.filter((val) => typeof val === 'object' && val !== null && !Array.isArray(val))
			.every((innerObj) =>
				Object.values(innerObj!).every((value) => value === null || value === undefined || value === '')
			);
	}

	// Abstract methods that must be implemented by subclasses
	abstract getId(element: T | null): string;
	abstract buildSearch(): void;

	// Optional lifecycle hooks
	protected postFind(entity: T): void {}
	protected postList(entities: T[]): void {}
}
