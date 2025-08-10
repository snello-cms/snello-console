import { inject } from '@angular/core';
import { TranslationsStore } from '../services/stores/transaltions.store';

/**
 * Utility helpers class
 * Provides common helper functions for error handling and translations
 */
export class Helpers {
	private readonly translationsStore = inject(TranslationsStore);

	/**
	 * Generate user-friendly error message from error object
	 */
	public generateErrorMessage(error: any): string {
		// Check for dedicated error message in translations
		const dedicatedMessage = this.findDedicatedErrorMessage(error);
		if (dedicatedMessage) {
			return dedicatedMessage;
		}

		// Extract message from error object
		return this.extractErrorMessage(error);
	}

	/**
	 * Find dedicated error message in translations
	 */
	private findDedicatedErrorMessage(error: any): string | null {
		if (!error?.error?.id) {
			return null;
		}

		const translations = this.translationsStore.state().errorMessages;
		const dedicatedMsg = translations.find((msg) => msg.id === error.error.id);

		return dedicatedMsg?.message || null;
	}

	/**
	 * Extract error message from various error object formats
	 */
	private extractErrorMessage(error: any): string {
		// Handle string errors
		if (typeof error === 'string') {
			return error;
		}

		// Handle error objects with nested error properties
		if (error?.error?.message) {
			return error.error.message;
		}

		if (error?.error?.msg) {
			return error.error.msg;
		}

		// Handle direct error objects
		if (error?.message) {
			return error.message;
		}

		// Fallback message
		return 'An unexpected error occurred';
	}
}
