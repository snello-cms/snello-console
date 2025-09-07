import { LowerCasePipe } from '@angular/common';
import { Component, DoCheck, input, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { Search } from '../models/search.model';

@Component({
	template: `
		<div class="tags-wrapper">
			@for (operator of operators; track operator) {
				@if (operator !== 'orderBy') {
					@for (field of fields[operator]; track field) {
						@if (checkHiddenField(field)) {
							@if (filterCheck(operator, field)) {
								<div class="tag-item">
									<strong>
										{{
											labels()[field]
												? (labels()[field] | translate | lowercase)
												: (field | lowercase)
														.replace('_', ' ')
														.replace('_', ' ')
														.replace('_', ' ')
														.replace('_', ' ')
										}}

										@if (operator === 'obj') {
											=
										}
										@if (operator === 'like') {
											&#8776;
										}
										@if (operator === 'not') {
											&#8800;
										}
										@if (operator === 'from') {
											>=
										}
										@if (operator === 'to') {
											<=
										}
										@if (operator === 'nil') {
											:
										}
										@if (operator === 'notNil') {
											:
										}
									</strong>

									@if (operator !== 'nil' && operator !== 'notNil' && search()) {
										{{
											values()[search()[operator][field]]
												? (values()[search()[operator][field]] | translate | lowercase)
												: search()[operator][field]
										}}
									}
									@if (operator === 'nil') {
										non presente
									}
									@if (operator === 'notNil') {
										presente
									}
									@if (!notRemovable() && search()) {
										<button class="btn-close" (click)="search()[operator][field] = null">
											<i class="fa fa-times" aria-hidden="true"></i>
										</button>
									}

									@if (notRemovableFields().indexOf(operator + '.' + field) < 0 && !notRemovable()) {
										<button class="btn-close" (click)="remove(operator, field)">
											<i class="fa fa-times" aria-hidden="true"></i>
										</button>
									}
								</div>
							}
						}
					}
				}
			}
		</div>
	`,
	selector: 'app-search-tags',
	standalone: true,
	imports: [ButtonModule, TranslateModule, LowerCasePipe]
})
export class SearchTagsComponent implements DoCheck {
	search = input.required<Search<any>>();

	hiddenFields = input<string[]>([]);

	notRemovable = input<boolean>(false);
	notRemovableFields = input<string[]>([]);

	labels = input<{ [k: string]: string }>({});
	values = input<{ [k: string]: string }>({});

	cancel = output();

	operators: string[] = [];
	fields: { [k: string]: any } = {};

	ngDoCheck(): void {
		if (this.search()) {
			this.operators = Object.keys(this.search());
			for (const operator of this.operators) {
				if (this.search()[operator as keyof Search<any>]) {
					this.fields[operator] = Object.keys(this.search()[operator as keyof Search<any>]);
				}
			}
		}
	}

	public remove(operator: string, field: string): void {
		if (this.search()) {
			this.search()[operator as keyof Search<any>][field] = null;
		}
		this.cancel.emit();
	}

	public filterCheck(operator: string, field: string): boolean {
		if (this.search()) {
			if (
				this.search()[operator as keyof Search<any>][field] !== null &&
				this.search()[operator as keyof Search<any>][field] !== '' &&
				this.search()['nil'][field] !== false &&
				this.search()['notNil'][field] !== false
			) {
				return true;
			}
		}
		return false;
	}

	checkHiddenField(field: string): boolean {
		const foundHiddenField = this.hiddenFields().find((inF) => inF === field);
		return !foundHiddenField;
	}
}
