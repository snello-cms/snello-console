# snello-console
Snello Console is the porting in latest version of Angular (20.x) of Snello Admin.


<img width="1352" height="389" alt="Screenshot 2025-07-11 alle 21 10 10" src="https://github.com/user-attachments/assets/747fc84d-f516-445e-b6c4-96e425670406" />

## metadata

```
Metadata {

    public String uuid;
    public String table_name;
    public String select_fields;
    public String search_fields;
    public String description;
    //serve per tabelle preesistenti
    public String alias_table;
    public String alias_condition;


    public String table_key;
    public String table_key_type;
    public String table_key_addition;
    public String creation_query;

    public String order_by;

    // tab1:group0,group1;tab2:
    public String tab_groups;

    public String icon;


    // la tabella esiste e non deve essere gestita da SNELLO
    public boolean already_exist;
    //la tabella VA CREATA E GESTISTA DA SNELLO
    public boolean created;
}
```
