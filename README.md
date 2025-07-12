# snello-console
Snello Console is the porting in latest version of Angular (20.x) of Snello Admin.


<img width="1352" height="389" alt="Screenshot 2025-07-11 alle 21 10 10" src="https://github.com/user-attachments/assets/747fc84d-f516-445e-b6c4-96e425670406" />

## metadata

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
