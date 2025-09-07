import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import moment from 'moment/moment';
import { Search } from '../models/search.model';

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
	public search: any = null;
	// URL state
	public url: string = '';
	// Pagination state (like snello-admin)
	public _limit = 10;
	public _start = 0;

	constructor(protected readonly urlValue: Observable<string> | string) {
		if (typeof urlValue === 'string') {
			this.url = urlValue;
		} else {
			urlValue.subscribe((value) => {
				this.url = value;
			});
		}
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
		return this.getListSearch(this.search, this._start, this._limit);
	}

	/**
	 * Get list with search parameters (like snello-admin)
	 */
	public getListSearch(search: any, start: number, limit: number): Observable<T[]> {
		let params = new HttpParams();
		params = params.set('_start', this.toQueryParam('_start', start));
		params = params.set('_limit', this.toQueryParam('_limit', limit));
		params = this.applyRestrictions(params, search);

		return this.httpClient
			.get<T[]>(this.url, {
				observe: 'response',
				params: params
			})
			.pipe(
				map((res) => {
					const listSize = res.headers.get('x-total-count');
					if (listSize) {
						this.listSizeSubject.next(+listSize);
					}
					const entities: T[] = res.body || [];
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
		return this.getListSearch(this.search, 0, 20);
	}

	/**
	 * Get all entities without pagination
	 */
	public getAllList(search?: any): Observable<T[]> {
		const searchParams = search || JSON.parse(JSON.stringify(this.search));
		searchParams._limit = 100000;

		let params = new HttpParams();
		params = this.applyRestrictions(params, searchParams);

		return this.httpClient
			.get<T[]>(this.url, {
				observe: 'response',
				params: params
			})
			.pipe(
				map((res) => {
					const entities: T[] = res.body || [];
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
		let params = new HttpParams();
		this._start = 0;
		this._limit = 10;
		params = this.applyRestrictions(params, this.search);

		return this.httpClient
			.get(`${this.url}/listSize`, {
				observe: 'response',
				params: params
			})
			.pipe(
				map((res: any) => {
					return res.headers.get('size') != null ? +res.headers.get('size') : 0;
				}),
				catchError(this.handleError.bind(this))
			);
	}

	/**
	 * Find entity by ID
	 */
	public find(id: string): Observable<T> {
		const fullUrl = `${this.url}/${id}`;
		return this.httpClient
			.get<T>(fullUrl)
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
	 * Apply search restrictions to HTTP parameters (like snello-admin)
	 */
	protected applyRestrictions(params: HttpParams, search: any): HttpParams {
		for (const key in search) {
			if (search[key] !== null && search[key] !== undefined) {
				if (!(search[key] instanceof Object)) {
					params = params.set(key, this.toQueryParam(key, search[key]));
				} else if (search[key] instanceof Date) {
					params = params.set(key, this.toQueryParam(key, search[key]));
				}
			}
		}
		return params;
	}

	/**
	 * Convert value to query parameter format (like snello-admin)
	 */
	protected toQueryParam(field: string, value: any): string {
		if (value instanceof Date) {
			return (value as Date).toLocaleString('it-IT', { hour12: false });
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
