import { Directive } from '@angular/core';

/**
 * Abstract base component for navigation in edit components
 */
@Directive()
export abstract class AbstractNavigationEditComponent<T> {
	public readonly path: string = '';

	constructor() {}
}
