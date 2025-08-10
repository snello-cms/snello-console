import { Injectable, signal } from '@angular/core';
import { Translation } from '../../models/translation.model';

export interface TranslationsState {
	errorMessages: Translation[];
}

const initialState: TranslationsState = {
	errorMessages: []
};

@Injectable({
	providedIn: 'root'
})
export class TranslationsStore {
	state = signal<TranslationsState>(initialState);

	setTranslations(errorMessages: Translation[]): void {
		this.state.update((value) => ({ ...value, errorMessages }));
	}
}
