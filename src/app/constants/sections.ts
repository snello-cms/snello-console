import { PageModel } from '../core/commons/models/page.model';

export const SECTION_LIST: PageModel[] = [
	{
		label: 'Homepage',
		icon: 'fa fa-home',
		routerLink: '/',
		parentRoute: 'homepage',
		active: false,
		homepage: true,
		allowed: true
	},
	{
		label: 'Cronologia',
		icon: '',
		history: true,
		acl: 'ANY_ACL',
		items: [
			{
				label: 'Nessun risultato',
				empty: true,
				acl: 'ANY_ACL'
			}
		]
	},
	{
		label: 'Proprietà',
		key: 'PROPERTIES',
		icon: 'fa fa-cog',
		routerLink: '/properties',
		parentRoute: 'properties',
		active: false,
		homepage: false
	},
	{
		label: 'Configurazioni LDAP',
		key: 'LDAP_CONFIGURATIONS',
		icon: 'fa fa-cogs',
		routerLink: '/ldap-configurations/list',
		parentRoute: 'ldap-configurations',
		active: false,
		homepage: false
	},
	{
		label: 'Ticket',
		key: 'TICKETS',
		icon: 'fa fa-file-pen',
		routerLink: '/tickets/list',
		parentRoute: 'tickets',
		active: false,
		homepage: false
	},
	{
		label: 'Utenti',
		key: 'USERS',
		icon: 'fa fa-users',
		routerLink: '/users/list',
		parentRoute: 'users',
		active: false,
		homepage: false
	},
	{
		label: 'Operazioni Utente',
		routerLink: '/user-operations/list',
		icon: 'fa fa-user',
		parentRoute: 'user-operations',
		active: false,
		homepage: false
	}
];
