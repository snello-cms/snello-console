import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ADMIN_ITEMS, AdminItem } from '../../../constants/admin-items';
import { PermitDirective } from '../../../core/directives/permit.directive';

@Component({
	selector: 'adminhome-topbar',
	standalone: true,
	imports: [CommonModule, RouterModule, PermitDirective],
	templateUrl: './admin-home-topbar.component.html'
})
export class AdminHomeTopbarComponent {
	items: AdminItem[] = ADMIN_ITEMS;
}
