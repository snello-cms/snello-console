import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CONFIG_PATH } from '../constants/constants';

@Injectable({
	providedIn: 'root'
})
export class ConfigurationService {
	private configuration: any;

	constructor(private http: HttpClient) {}

	getConfigs(): Promise<any> {
		return this.http
			.get(CONFIG_PATH)
			.pipe(
				tap((config) => {
					this.configuration = config;
				})
			)
			.toPromise();
	}

	getConfiguration(): Observable<any> {
		if (this.configuration) {
			return of(this.configuration);
		} else {
			return this.http.get(CONFIG_PATH);
		}
	}

	getValue(key: string): string {
		return this.configuration ? this.configuration[key] : '';
	}

	getValueObservable(key: string): Observable<string> {
		return this.getConfiguration().pipe(map((config) => config[key] || ''));
	}
}
