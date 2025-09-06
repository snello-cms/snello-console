export interface AdminItem {
	id: string;
	icon: string;
	section: string;
	name: string;
	summary: string;
	roles: string;
}

export const ADMIN_ITEMS: AdminItem[] = [
	{
		id: 'list',
		icon: 'fa fa-book',
		section: 'metadata',
		name: 'Metadati',
		summary: 'Metadata management on tables',
		roles: 'Admin, metadatas_edit, metadatas_view'
	},
	{
		id: 'list',
		icon: 'fa fa-cogs',
		section: 'fielddefinition',
		name: 'Field Definitions',
		summary: 'Field definition management to populate forms',
		roles: 'Admin, fielddefinitions_edit, fielddefinitions_view'
	},
	{
		id: 'list',
		icon: 'fa fa-hand-spock-o',
		section: 'condition',
		name: 'Condition',
		summary: 'Management of table filter conditions',
		roles: 'Admin, conditions_edit, conditions_view'
	},
	{
		id: 'list',
		icon: 'fa fa-files-o',
		section: 'document',
		name: 'Document',
		summary: 'Documents management',
		roles: 'Admin, documents_edit, documents_view'
	},
	{
		id: 'list',
		icon: 'fa fa-list',
		section: 'selectqueries',
		name: 'SelectQuery',
		summary: 'Select Queries Management',
		roles: 'Admin, selectqueries_edit, selectqueries_view'
	},
	{
		id: 'list',
		icon: 'fa fa-link',
		section: 'links',
		name: 'Links',
		summary: 'Links Management',
		roles: 'Admin, links_edit, links_view'
	}
];

export const APP_VERSION = '3.0.0';
