-------------------------------------------
-- Types
-------------------------------------------

-------------------------------------------
-- Generated by: Database Migration
-- Developer: KeenDev team
-- Website: https://www.keendev.team
-- Github: https://github.com/keendev-team
-------------------------------------------

create type <%- migration.schemaName %>.<%- databaseItemsPrefix %>transaction_result as
(
	code char(8),
	balance decimal
);
