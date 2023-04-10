# Week 4 — Postgres and RDS
I learned about RDS- PSQL database this week. I first connected psql via CLI. Created tables and inserted data into the table by running some of the bash scripts. Created the same connection in both the environments Dev and Prod.

So firstly, I installed the Postgres container which is in my `docker-compose.yml` file.

```
 db:
    image: postgres:13-alpine
    restart: always
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=<enteryourpassword>
    ports:
      - '5432:5432'
    volumes: 
      - db:/var/lib/postgresql/data

volumes:
  db:
    driver: local
```

Then I connect psql in my terminal by running `psql -U postgres -localhost` and it ask for password then I am connected to Postgres in terminal.
As I mentioned above we have certain bash scripts to create tables, drop tables, insert data into tables. Before this I had set env vars in Gitpod for the Connection Url and Prod Connection Url. 

### `./bin/db-connect` to connect to the psql 
```
#! /usr/bin/bash
if [ "$1" = "prod" ]; then
  echo "Running in production mode"
  URL=$PROD_CONNECTION_URL
else
  URL=$CONNECTION_URL
fi

psql $URL
```

### `./bin/db-create` to create a new table 'cruddur'
```
#!  /usr/bin/bash

CYAN='\033[1;36m'
NO_COLOR='\033[0m'
LABEL="db-create"
printf "${CYAN}== ${LABEL}${NO_COLOR}\n"

NO_DB_CONNECTION_URL=$(sed 's/\/cruddur//g' <<< "$CONNECTION_URL")
psql $NO_DB_CONNECTION_URL -c "create database cruddur;"
```

### `./bin/db-drop` to drop if the table is existing
```
#!  /usr/bin/bash

CYAN='\033[1;36m'
NO_COLOR='\033[0m'
LABEL="db-drop"
printf "${CYAN}== ${LABEL}${NO_COLOR}\n"

NO_DB_CONNECTION_URL=$(sed 's/\/cruddur//g' <<< "$CONNECTION_URL")
psql $NO_DB_CONNECTION_URL -c "drop database cruddur;"
```

### `./bin/db-schem-load` to load the schema , which means to give the contents and set its' constraints.
```
#! /usr/bin/bash

CYAN='\033[1;36m'
NO_COLOR='\033[0m'
LABEL="db-schema-load"
printf "${CYAN}== ${LABEL}${NO_COLOR}\n"

schema_path="$(realpath .)/db/schema.sql"
echo $schema_path

if [ "$1" = "prod" ]; then
  echo "Running in production mode"
  URL=$PROD_CONNECTION_URL
else
  URL=$CONNECTION_URL
fi

psql $URL cruddur < $schema_path
```

### `./bin/db-seed` to insert the data into schema loaded
```
#! /usr/bin/bash

CYAN='\033[1;36m'
NO_COLOR='\033[0m'
LABEL="db-seed"
printf "${CYAN}== ${LABEL}${NO_COLOR}\n"

seed_path="$(realpath .)/db/seed.sql"
echo $seed_path

if [ "$1" = "prod" ]; then
  echo "Running in production mode"
  URL=$PROD_CONNECTION_URL
else
  URL=$CONNECTION_URL
fi

psql $URL cruddur < $seed_path

```

And to connect to PROD environment, you can suffix the command with PROD. `./bin/db-connect prod`

## RDS Instance
I also created a Database instance in Amazon RDS Service. But as it costs us, so I had stoppped that temprorarily and was running only when required. I took the end point of that instance for the connection URL; security group ID and security group rules ID and added those in my `rds-update-sg-rules` shell script. Also had set the Inbound rules as Postgres : port 5432 to Custom : (My Gitpod IP).

There's a Provisioning done for RDS (You need to wait for arounf 10 mins to get it activated)
```
aws rds create-db-instance \
  --db-instance-identifier cruddur-db-instance \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version  14.6 \
  --master-username root \
  --master-user-password huEE33z2Qvl383 \
  --allocated-storage 20 \
  --availability-zone ca-central-1a \
  --backup-retention-period 0 \
  --port 5432 \
  --no-multi-az \
  --db-name cruddur \
  --storage-type gp2 \
  --publicly-accessible \
  --storage-encrypted \
  --enable-performance-insights \
  --performance-insights-retention-period 7 \
  --no-deletion-protection
```

These all tasks helped us to get the IP from which we were creating database/ inserting data. And we used `psycopg3` driver

## AWS Lambda
**Post Confirmation Lambda** : Here I added some code to get logs recorded in as I sign in to the cruddur app. Created a Lambda Function by using psycopg3 lib. 
https://pypi.org/project/psycopg2-binary/#files

Lambda function
```
import json
import psycopg2

def lambda_handler(event, context):
    user = event['request']['userAttributes']
    try:
        conn = psycopg2.connect(
            host=(os.getenv('PG_HOSTNAME')),
            database=(os.getenv('PG_DATABASE')),
            user=(os.getenv('PG_USERNAME')),
            password=(os.getenv('PG_SECRET'))
        )
        cur = conn.cursor()
        cur.execute("INSERT INTO users (display_name, handle, cognito_user_id) VALUES(%s, %s, %s)", (user['name'], user['email'], user['sub']))
        conn.commit() 

    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
        
    finally:
        if conn is not None:
            cur.close()
            conn.close()
            print('Database connection closed.')

    return event
    ```
    



