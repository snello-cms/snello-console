# snello-console
Snello Console is the porting in latest version of Angular (20.x) of Snello Admin.


<img width="1352" height="389" alt="Screenshot 2025-07-11 alle 21 10 10" src="https://github.com/user-attachments/assets/747fc84d-f516-445e-b6c4-96e425670406" />

## Metadata

```
Metadata {

    public String uuid;
    public String table_name;
    public String icon;
    public String select_fields;
    public String search_fields;
    public String description;
    public String order_by;

    // if the table is pre existent
    public String alias_table;
    public String alias_condition;

    // the table exists and snello only read 
    public boolean already_exist;
    // the owner of table is SNELLO
    public boolean created;
    
    public String table_key;
    public String table_key_type;
    public String table_key_addition;
    // if we want customize the creation table 
    public String creation_query;

    // to manage the editor fields
    // tab1:group0,group1;tab2:
    public String tab_groups;

}
```

## FieldDefinition


```
FieldDefinition {

    public String uuid;
    public String metadata_uuid;
    public String metadata_name;

    public String name;
    public String label;
    // input|button|select|date|radiobutton|checkbox
    public String type;
    // html password, text, number, radio, checkbox, color, date, datetime-local, email, month, number, range, search, tel, time, url, week
    public String input_type;
    // stringa seperata da ","
    public String options;
    // SERVE X RAGGRUPPARE NELLA PAGINA DI EDITING
    public String group_name;
    // SERVE X IL RAGGRUPPAMENTO A WIZARD
    public String tab_name;
    //DOPO VEDREMO COME FARLO
    public String validations;

    public boolean table_key;
    public boolean input_disabled;
    public String function_def;

    public String join_table_name;
    public String join_table_key;
    public String join_table_select_fields;


    public String sql_type;
    public String sql_definition;
    public String default_value;
    public String pattern;

    //definisce se è il campo cercabile nella lista
    public boolean searchable;
    //    static final String EQU = "=";
    //    static final String NE = "_ne";
    //    static final String LT = "_lt";
    //    static final String GT = "_gt";
    //    static final String LTE = "_lte";
    //    static final String GTE = "_gte";
    //    static final String CNT = "_contains";
    //    static final String NCNT = "_ncontains";
    public String search_condition;
    // composizione del name + la codiione scelta
    // -> es: search on "name": (EQU) name, (LIKE) name_contains,(NOT LIKE) name_ncontains,
    // -> es: search on  "age": (EQU) age, (<) age_lt,(>) age_gt, (<=) age_lte, (>=) age_gte
    public String search_field_name;

    //definisce se il campo deve essere visto nella lista
    public boolean show_in_list;

}
```
