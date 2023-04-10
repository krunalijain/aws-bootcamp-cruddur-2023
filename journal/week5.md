# Week 5 — DynamoDB and Serverless Caching

## Data Modelling
A data modelling technique called single table design stores all relevant data in a single database table. For the Direct Messaging System in our Cruddur application, we use DynamoDB. Four patterns of data access can be distinguished in this context:
`Pattern A` for displaying messages. A list of messages that are a part of a message group are visible to users. For displaying message groups, use `Pattern B`. Users can check the other people they have been communicating with by viewing a list of messaging groups. For composing a fresh message in a fresh message group, use `Pattern C`. For adding a new message to an existing message group, use `Pattern D`.

So, there are tree types of items to insert in our Dynamo DB Table:
```
my_message_group = {
    'pk': {'S': f"GRP#{my_user_uuid}"},
    'sk': {'S': last_message_at},
    'message_group_uuid': {'S': message_group_uuid},
    'message': {'S': message},
    'user_uuid': {'S': other_user_uuid},
    'user_display_name': {'S': other_user_display_name},
    'user_handle':  {'S': other_user_handle}
}

other_message_group = {
    'pk': {'S': f"GRP#{other_user_uuid}"},
    'sk': {'S': last_message_at},
    'message_group_uuid': {'S': message_group_uuid},
    'message': {'S': message},
    'user_uuid': {'S': my_user_uuid},
    'user_display_name': {'S': my_user_display_name},
    'user_handle':  {'S': my_user_handle}
}

message = {
    'pk':   {'S': f"MSG#{message_group_uuid}"},
    'sk':   {'S': created_at},
    'message': {'S': message},
    'message_uuid': {'S': message_uuid},
    'user_uuid': {'S': my_user_uuid},
    'user_display_name': {'S': my_user_display_name},
    'user_handle': {'S': my_user_handle}
}
```

## Working of Backend 
I had to restructure the BASH Scripts with 3 folders having the Utility Commands for PSQL `backend-flask/bin/db`;  DynamoDB `backend-flask/bin/db`; AWS RDS `backend-flask/bin/rds` and AWS Cognito `backend-flask/bin/cognito`. 
In order to create, configure, and administer AWS services like DynamoDB, add `boto3` to `backend-flask/requirements.txt`.
As noted in this change, add a command that will enable gitpod to automatically install Python libraries whenever a new workspace is launched.

**In Postgres Local Database**
Adding 3 users and 1 action to the seed data in `backend-flask/db/seed.sql`
```
-- this file was manually created
INSERT INTO public.users (display_name, email, handle, cognito_user_id)
VALUES
  ('YourName', 'yourmailid', 'youruserhandle' ,'MOCK'),
  ('Andrew Bayko','bayko@exampro.co' , 'bayko' ,'MOCK'),
  ('Londo Mollari','lmollari@centari.com' ,'londo' ,'MOCK');

INSERT INTO public.activities (user_uuid, message, expires_at)
VALUES
  (
    (SELECT uuid from public.users WHERE users.handle = 'beiciliang' LIMIT 1),
    'This was imported as seed data!',
    current_timestamp + interval '10 day'
  )
  ```
To list users' data saved in AWS Cognito, create the backend-flask/bin/cognito/list-users script.
```
#!/usr/bin/env python3

import boto3
import os
import json

userpool_id = os.getenv("AWS_COGNITO_USER_POOL_ID")
client = boto3.client('cognito-idp')
params = {
    'UserPoolId': userpool_id,
    'AttributesToGet': [
        'preferred_username',
        'sub'
    ]
}
response = client.list_users(**params)
users = response['Users']

print(json.dumps(users, sort_keys=True, indent=2, default=str))

dict_users = {}
for user in users:
    attrs = user['Attributes']
    sub = next((a for a in attrs if a["Name"] == 'sub'), None)
    handle = next(
        (a for a in attrs if a["Name"] == 'preferred_username'), None)
    dict_users[handle['Value']] = sub['Value']

print(dict_users)
```

To update users in the seed data with actual Cognito IDs, if any, create the `backend-flask/bin/db/update_cognito_user_ids` script.
```
#!/usr/bin/env python3

import boto3
import os
import sys

current_path = os.path.dirname(os.path.abspath(__file__))
parent_path = os.path.abspath(os.path.join(current_path, '..', '..'))
sys.path.append(parent_path)
from lib.db import db

def update_users_with_cognito_user_id(handle, sub):
    sql = """
    UPDATE public.users
    SET cognito_user_id = %(sub)s
    WHERE
      users.handle = %(handle)s;
  """
    db.query_commit(sql, {
        'handle': handle,
        'sub': sub
    })


def get_cognito_user_ids():
    userpool_id = os.getenv("AWS_COGNITO_USER_POOL_ID")
    client = boto3.client('cognito-idp')
    params = {
        'UserPoolId': userpool_id,
        'AttributesToGet': [
            'preferred_username',
            'sub'
        ]
    }
    response = client.list_users(**params)
    users = response['Users']
    dict_users = {}
    for user in users:
        attrs = user['Attributes']
        sub = next((a for a in attrs if a["Name"] == 'sub'), None)
        handle = next(
            (a for a in attrs if a["Name"] == 'preferred_username'), None)
        dict_users[handle['Value']] = sub['Value']
    return dict_users


users = get_cognito_user_ids()

for handle, sub in users.items():
    print('----', handle, sub)
    update_users_with_cognito_user_id(
        handle=handle,
        sub=sub
    )
```





