from lib.db import db
import uuid

class ReplyToActivityToUuidToStringMigration:
    def migrate(self):
        query = """
        ALTER TABLE activities DROP COLUMN reply_to_activity_uuid;
        ALTER TABLE activities ADD COLUMN reply_to_activity_uuid uuid;
        """
        db.query_commit(query, {})

    def rollback(self):
        query = """
        ALTER TABLE activities DROP COLUMN reply_to_activity_uuid;
        ALTER TABLE activities ADD COLUMN reply_to_activity_uuid integer;
        """
        db.query_commit(query, {})

migration = ReplyToActivityToUuidToStringMigration()
