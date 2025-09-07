import { Directive } from '@angular/core';

/**
 * Abstract base component for navigation in view components
 */
@Directive()
export abstract class AbstractNavigationViewComponent<T> {
	public readonly path: string = '';

	constructor() {}
}
