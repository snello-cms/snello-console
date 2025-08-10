import { API_VERSION } from './constants';

export function generateUrl(api: string, path: string): string {
	return `${api}${API_VERSION}${path}`;
}

export function generatePatterForInterceptor(): { urlPattern: RegExp; bearerPrefix: string } {
	// /^(.*)?$/i ____ with this pattern we use the interceptor globally
	// in keylcoak 19 we have to define interceptor for each endpoint that we have to call
	// but for now keylcoak 19 patter test is broken, so we use a global one
	return {
		urlPattern: /^(.*)?$/i,
		bearerPrefix: 'Bearer'
	};
}

export function makeId(length: number): string {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
}
