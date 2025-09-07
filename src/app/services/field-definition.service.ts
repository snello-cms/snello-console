import { Injectable } from '@angular/core';

import { AbstractService } from '../core/commons/services/abstract.service';
import { FieldDefinition } from '../models/field-definition.model';
import { ConfigurationService } from './configuration.service';
import { FIELD_DEFINITION_API_PATH } from '../constants/constants';

@Injectable({
	providedIn: 'root'
})
export class FieldDefinitionService extends AbstractService<FieldDefinition> {
	constructor(private configurationService: ConfigurationService) {
		super(configurationService.getValueObservable(FIELD_DEFINITION_API_PATH));
	}

	/**
	 * Get entity ID
	 */
	getId(element: FieldDefinition | null): string {
		return element?.uuid || '';
	}

	/**
	 * Build search criteria
	 */
	buildSearch(): void {
		this.search = {
			metadata_uuid: '',
			name_contains: '',
			_limit: 10
		};
	}
}
