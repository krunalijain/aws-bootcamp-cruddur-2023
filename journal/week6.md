# Week 6 — Deploying Containers

In this week, I started with understanding about NAT - it take IP addresses and maps toexternal one. It allows a way to talk safely out of Internet. For instance : Private IP to Public IP. 

Created a test file for RDS connection and added in `bin/db/test`

```
#!/usr/bin/env python3

import psycopg
import os
import sys

connection_url = os.getenv("CONNECTION_URL")

conn = None
try:
  print('attempting connection')
  conn = psycopg.connect(connection_url)
  print("Connection successful!")
except psycopg.Error as e:
  print("Unable to connect to the database:", e)
finally:
  conn.close()
  ```
  
  Also created cloudwatch groups for `cruddur` cluster
  ```
  aws logs create-log-group --log-group-name cruddur
aws logs put-retention-policy --log-group-name cruddur --retention-in-days 1
```

And decided to have three repositories :
1. Base image for Python 
2. One for Flask
3. and the third for React

To log in into ECR run this command in terminal

```
aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com"
```
**ECR URL mapping - set URL for Python**
```
export ECR_PYTHON_URL="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/cruddur-python"
echo $ECR_PYTHON_URL
```
Pull Image
```
docker pull python:3.10-slim-buster
```
Tag Image
```
docker tag python:3.10-slim-buster $ECR_PYTHON_URL:3.10-slim-buster
```

Push Image
```
docker push $ECR_PYTHON_URL:3.10-slim-buster
```

Then I edited `Dockerfile` with ECR URL and also did Health-Check

**Creating Repo for Flask**
Create Repo
```
aws ecr create-repository \
  --repository-name backend-flask \
  --image-tag-mutability MUTABLE
  ```
  
  Set URL
  ```
  export ECR_BACKEND_FLASK_URL="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/backend-flask"
echo $ECR_BACKEND_FLASK_URL
```

Build Image
```
docker build -t backend-flask .
```

Tag Image
```
docker tag backend-flask:latest $ECR_BACKEND_FLASK_URL:latest
```

Push Image
```
docker push $ECR_BACKEND_FLASK_URL:latest
```

This was for Backend and then created for Frontend as well

**For Frontend**
created Repo
```
aws ecr create-repository \
  --repository-name frontend-react-js \
  --image-tag-mutability MUTABLE
  ```
  
  Set URL 
  ```
  export ECR_FRONTEND_REACT_URL="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/frontend-react-js"
echo $ECR_FRONTEND_REACT_URL
```

Build Image for Frontend 
```
docker build \
--build-arg REACT_APP_BACKEND_URL="https://4567-$GITPOD_WORKSPACE_ID.$GITPOD_WORKSPACE_CLUSTER_HOST" \
--build-arg REACT_APP_AWS_PROJECT_REGION="$AWS_DEFAULT_REGION" \
--build-arg REACT_APP_AWS_COGNITO_REGION="$AWS_DEFAULT_REGION" \
--build-arg REACT_APP_AWS_USER_POOLS_ID="ca-central-1_CQ4wDfnwc" \
--build-arg REACT_APP_CLIENT_ID="5b6ro31g97urk767adrbrdj1g5" \
-t frontend-react-js \
-f Dockerfile.prod \
.
```
**Note: If this build script doesn't works like this then ad a period infront of `docker build . \`. This will state that you have to build the image in the present directory on which you ae running the command.**

Tag Image 
```
docker tag frontend-react-js:latest $ECR_FRONTEND_REACT_URL:latest
```

Push Image
```
docker push $ECR_FRONTEND_REACT_URL:latest
```

**To Register task Definitions**
For Backend
```
aws ecs register-task-definition --cli-input-json file://aws/task-definitions/backend-flask.json
```
For Frontend
```
aws ecs register-task-definition --cli-input-json file://aws/task-definitions/frontend-react-js.json
```

Created Role Policies for these services and created a Task Role and attached that to Policies for CloudWatch and X-RAY




  
  
