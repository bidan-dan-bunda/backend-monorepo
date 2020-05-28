
#! /bin/bash

read -p "DB Name: " DATABASE_NAME
read -p "DB User: " DBUSER
read -s -p "DB Password: " DBPASSWORD

echo ""

mysql -Nse "show tables where Tables_in_${DATABASE_NAME} not like 'reg_%'" -D $DATABASE_NAME -u$DBUSER -p$DBPASSWORD | while read table; do echo "SET FOREIGN_KEY_CHECKS = 0;truncate table \`$table\`;SET FOREIGN_KEY_CHECKS = 1;"; done | mysql $DATABASE_NAME -u$DBUSER -p$DBPASSWORD

exit 0