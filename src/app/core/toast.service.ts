import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

/**
 * Toast notification service
 * Provides centralized toast message management
 */
@Injectable({
	providedIn: 'root'
})
export class ToastService {
	private readonly messageService = inject(MessageService);
	private readonly translateService = inject(TranslateService);

	/**
	 * Show error toast message
	 */
	public addError(message: string): void {
		this.messageService.add({
			severity: 'error',
			summary: this.translateService.instant('common.ERROR'),
			detail: message,
			life: 5000
		});
	}

	/**
	 * Show success toast message
	 */
	public addSuccess(message: string): void {
		this.messageService.add({
			severity: 'success',
			summary: this.translateService.instant('common.SUCCESS'),
			detail: message,
			life: 3000
		});
	}

	/**
	 * Show warning toast message
	 */
	public addWarning(message: string): void {
		this.messageService.add({
			severity: 'warning',
			summary: this.translateService.instant('common.WARNING'),
			detail: message,
			life: 4000
		});
	}

	/**
	 * Show info toast message
	 */
	public addInfo(message: string): void {
		this.messageService.add({
			severity: 'info',
			summary: this.translateService.instant('common.INFO'),
			detail: message,
			life: 3000
		});
	}

	/**
	 * Clear all toast messages
	 */
	public clear(): void {
		this.messageService.clear();
	}
}
