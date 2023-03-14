from psycopg_pool import ConnectionPool
import os

connection_url = os.getenv("")
pool = ConnectionPool(connection_url)