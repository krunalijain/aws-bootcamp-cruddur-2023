# Week 4 — Postgres and RDS
I learned about RDS- PSQL database this week. I first connected psql via CLI. Created tables and inserted data into the table by running some of the bash scripts. Created the same connection in both the environments Dev and Prod.

So firstly, I installed the Postgres container which is in my `docker-compose.yml` file.

```
 db:
    image: postgres:13-alpine
    restart: always
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - '5432:5432'
    volumes: 
      - db:/var/lib/postgresql/data

volumes:
  db:
    driver: local
```

Then I connect psql in my terminal by running `psql -U postgres -localhost` and it asks for password then I am connected to Postgres in terminal.
