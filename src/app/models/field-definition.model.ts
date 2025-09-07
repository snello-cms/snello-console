import { Validator } from './validator.model';

export const MAP_INPUT_TO_FIELD: Map<string, any> = new Map([
	['string', ['input', 'text']],
	['number', ['input', 'number']],
	['decimal', ['input', 'decimal']],
	['password', ['input', 'password']],
	['email', ['input', 'email']],
	['text', ['textarea', null]],
	['tinymce', ['tinymce', null]],
	['monaco', ['monaco', null]],
	['boolean', ['checkbox', null]],
	['date', ['date', null]],
	['datetime', ['datetime', null]],
	['time', ['time', null]],
	['select', ['select', null]],
	['media', ['media', null]],
	['tags', ['tags', null]],
	['join', ['join', null]],
	['multijoin', ['multijoin', null]],
	['media', ['media', null]]
]);

export class FieldDefinition {
	uuid: string = '';
	metadata_uuid: string = '';
	metadata_name: string = '';
	table_key: boolean = false;
	label?: string;
	name?: string;
	input_type?: string;
	options?: string;
	type: string = '';
	value?: any;
	validations?: Validator[];

	// non usata
	input_disabled: boolean = false;
	function_def?: string;

	sql_type: string = '';
	sql_definition?: string;
	default_value?: string;
	pattern?: string;
	definition?: string;

	group_name?: string;
	tab_name?: string;

	join_table_name: string = '';
	join_table_key: string = '';
	join_table_select_fields: string = '';

	table_name?: string;
	table_key_value?: string;

	searchable: boolean = false;

	search_condition: string = '';
	search_field_name: string = '';
	show_in_list: boolean = false;

	// usato solo lato angular
	is_edit: boolean = false;
}
