import { Condition } from './condition.model';
import { FieldDefinition } from './field-definition.model';

export class Metadata {
	uuid!: string;
	table_name!: string;
	select_fields!: string;
	search_fields!: string;
	description!: string;
	alias_table!: string;
	alias_condition!: string;
	table_key!: string;
	creation_query!: string;
	order_by!: string;

	table_key_type!: string;
	table_key_addition!: string;

	icon!: string;
	tab_groups!: string;
	created!: boolean;
	already_exist!: boolean;
	fields!: FieldDefinition[];
	conditions!: Condition[];
}
