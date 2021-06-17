# Dynamo DB basics

Dynamo DB is a schema-less database that requires a table name & primary key. The table's primary key is made up of one or two attributes that uniquely identifydata & sort data within each partition

## To create a Dynamo DB table

Inorder to create a dynamo db table, you need 2 mandatory things

- Table name
- Primary Key

Default settings of a dynamo db table include

- No secondary indexes
- Provisioned capacity set to 5 reads & 5 writes
- Basic alarms with 80% threshold using SNS topic "dynamodb"
- Encryption at REST with default encryption type

## Rules for creating an item (record) in Dynamo DB table

- Every item MUST have a primary key
- Every new item's primary key MUST be unique



