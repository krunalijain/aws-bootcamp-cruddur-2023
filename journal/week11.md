# Week 11 — CloudFormation Part 2

After the completion of Networking & Cluster Stak I move forward with implementing of RDS(Postgres), Sevice, DynamoDB & CICD stacks in AWS CloudFormation.

As created for previous stacks, similarly, here also I created a `template.yaml` & `config.toml` for RDS DataBase Configuration. And a `db` deploy script which will deploy the CFN Stack. 

## RDS (postgres) Stack

`config.toml`
```
[deploy]
bucket = 'cfn-artifacts-20'
region = 'us-east-1'
stack_name = 'CrdDb'

[parameters]
NetworkingStack = 'CrdNet'
ClusterStack = 'CrdCluster'
MasterUsername = 'cruddurroot'
```

Here's the `template.yaml` [code](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/aws/cfn/db/template.yaml).

### Template File Key Points
- I have set the Parameters that can be referred later in the Resources. 
- There's a **Deletion Policy** & **Update Policy** -> which will take a **Snapshot** when you Delete & do an Update.
- Set **Delete Protection: False**, orelse you won't be able to delete it if required in future. 
- Here, I have set **BackupRetentionPeriod: 0** as it's for learning and exploring purpose but, in real life scenarios we shouldn't be setting it to `0` as we don't want our data to loose.
- Used Db Instance Class as `db.t4g.micro` as it has `arm` - has fewer instruction sets(codes) which makes work more efficient. 
- Engine set to postgres
- Set **MasterUsername**. Make sure never set the Default MasterUsename. That is been used to acquire access to your DataBase.
- I added my CONNECTION_URL endpoint in the Parameter store.
- Also set DB_PASSWORD as a gitpod env var before running the script.

## Service Stack (Backend)
Created a [`config.toml`](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/aws/cfn/service/config.toml), [`template.yaml`](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/aws/cfn/service/template.yaml) and [`service`](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/bin/cfn/service) bash script for stack deploying in CFN. It consists of:   

**Task Definition**

Environment Variables Used :
- OTEL_SERVICE_NAME
- OTEL_EXPORTER_OTLP_ENDPOINT
- AWS_COGNITO_USER_POOL_ID
- AWS_COGNITO_USER_POOL_CLIENT_ID
- FRONTEND_URL
- BACKEND_URL
- AWS_DEFAULT_REGION

 Secrets :
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- CONNECTION_URL
- ROLLBAR_ACCESS_TOKEN
- OTEL_EXPORTER_OTLP_HEADERS

**Fargate Service**
-  HealthCheckGracePeriodSeconds: 0
-  ALB & Target Group 
-  Security Group
-  Subnets
-  NameSpace

**Execution Role**
- IAM role
- Policies attched in here.

**Task Role**
- Hekath-Check
- Policies

**Outputs**
- Service Name

### Service Stack Troubleshooting
When I tried to deploy and execute change set of my Service Stack, I got an error **CCreate Service Error: SC service is already used by service discovery namespace**. 

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/db316198-cdba-449a-b4e3-b9fcdaa61789)

### Solution 
To solve this I had to change the namespaces and match them in other stack files also.
`cluster/template.yaml`

```
ServiceConnectDefaults:
        Namespace: cruddurCFN
```

`service/template.yaml`

```
ServiceConnectConfiguration:
        Enabled: true
        Namespace: cruddurCFN
```
And then I successfully deployed service stack.

### Error lines in `template.yaml` files 
After completing these stacks, I was facing some errors in `template.yaml` files of every stack but, they weren't affecting my CFN deploy. 

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/7defe280-71f7-4ca0-b494-b1422e8c1192)

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/d4d58921-b0dd-45fd-885e-cacfe92419d0)

To fix these error lines in template files I edited my `.vscode` -> `settings.json` file.
Then my code was error free and clean. **How you can find that `settings.json` file?** 

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/0a1b8902-2016-4472-b075-98d868b032d0)

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/b22173f5-c63d-450b-aedf-8830d0e8f330)

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/76bdab42-b999-484e-84bc-9a2595b901b8)

Add this updated code:

```
{
  "yaml.customTags": [
    "!Equals sequence",
    "!FindInMap sequence",
    "!GetAtt",
    "!GetAZs",
    "!ImportValue",
    "!Join sequence",
    "!Ref",
    "!Select sequence",
    "!Split sequence",
    "!Sub"
  ],
  "yaml.schemas": {
    
    "/workspace/aws-bootcamp-cruddur-2023/aws/cfn/service/template.yaml": "template.yaml"
  }
}
```

____________________________________________________________________________________________________________________________________________________________________














