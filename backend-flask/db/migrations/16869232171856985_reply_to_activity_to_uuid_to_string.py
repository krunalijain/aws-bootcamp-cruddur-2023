from lib.db import db
import uuid

class ReplyToActivityToUuidToStringMigration:
    def migrate(self):
        query = """
        ALTER TABLE activities
        ALTER COLUMN reply_to_activity_uuid TYPE varchar(36) USING CAST(reply_to_activity_uuid AS varchar(36));
        """
        db.query_commit(query, {})

    def rollback(self):
        query = """
        ALTER TABLE activities
        ALTER COLUMN reply_to_activity_uuid TYPE integer USING CAST(reply_to_activity_uuid AS integer);
        """
        db.query_commit(query, {})

migration = ReplyToActivityToUuidToStringMigration()
