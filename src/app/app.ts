import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastModule } from 'primeng/toast';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet, NgxSpinnerModule, ToastModule],
	template: `
		<p-toast />
		<ngx-spinner></ngx-spinner>
		<router-outlet />
	`
})
export class App {}
