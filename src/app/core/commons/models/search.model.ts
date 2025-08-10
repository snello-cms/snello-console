/**
 * Generic search model for filtering and pagination
 * Provides common search functionality for all entities
 */
export class Search<T> {
	// Search criteria
	public from: T;
	public to: T;
	public like: T;
	public obj: T;
	public not: T;
	public nil: T;
	public notNil: T;

	// Pagination
	public startRow = 0;
	public pageSize = 10;
	public orderBy: string | null = null;

	// Additional properties
	[key: string]: any;

	/**
	 * Create new search instance with default values
	 */
	constructor(TCreator: { new (): T }) {
		this.from = new TCreator();
		this.to = new TCreator();
		this.like = new TCreator();
		this.obj = new TCreator();
		this.not = new TCreator();
		this.nil = new TCreator();
		this.notNil = new TCreator();
	}

	/**
	 * Reset search criteria to default values
	 */
	public reset(TCreator: { new (): T }): void {
		this.from = new TCreator();
		this.to = new TCreator();
		this.like = new TCreator();
		this.obj = new TCreator();
		this.not = new TCreator();
		this.nil = new TCreator();
		this.notNil = new TCreator();
		this.startRow = 0;
		this.pageSize = 10;
		this.orderBy = null;
	}

	/**
	 * Set pagination parameters
	 */
	public setPagination(startRow: number, pageSize: number): void {
		this.startRow = startRow;
		this.pageSize = pageSize;
	}

	/**
	 * Set sorting order
	 */
	public setOrderBy(field: string, ascending = true): void {
		this.orderBy = `${field} ${ascending ? 'ASC' : 'DESC'}`;
	}
}
