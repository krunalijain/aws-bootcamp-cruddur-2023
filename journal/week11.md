# Week 11 — CloudFormation Part 2

## Table of Contents
- [RDS (postgres) Stack](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week11.md#rds-postgres-stack)
- [Template File Key Points](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week11.md#template-file-key-points)
- [Service Stack (Backend)](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week11.md#service-stack-backend)
- [Service Stack Troubleshooting](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week11.md#service-stack-troubleshooting)
  - [SC service is already used](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week11.md#1-sc-service-is-already-used)
  - [Error lines in `template.yaml` files](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week11.md#2-error-lines-in-templateyaml-files)
  - [Health-Checks were Failing](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week11.md#3-health-checks-were-failing)
- [URL health-check status via CFN](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week11.md#url-health-check-status-via-cfn)
- [SAM CFN for DynamoDB Stack & Lambda](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week11.md#sam-cfn-for-dynamodb-stack--lambda)
- [Install SAM](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week11.md#install-sam)
- [CI/CD Stack](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week11.md#cicd-stack)
- [Frontend Stack (Static Web Hosting)](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week11.md#frontend-stack-static-web-hosting)
- [Error Faced - CNMAE Not Attached](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week11.md#error-faced---cnmae-not-attached)
- [All Stacks Deployed in CloudFormation](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week11.md#all-stacks-deployed-in-cloudformation)
- [CFN Architecture](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week11.md#cfn-architecture)
  
After the completion of Networking & Cluster Stak I move forward with implementing of RDS(Postgres), Sevice, DynamoDB & CICD stacks in AWS CloudFormation.

As created for previous stacks, similarly, here also I created a `template.yaml` & `config.toml` for RDS DataBase Configuration. And a `db` deploy script which will deploy the CFN Stack. 

## RDS (postgres) Stack

`config.toml`
```bash
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

## Service Stack Troubleshooting 
### #1 SC service is already used
When I tried to deploy and execute change set of my Service Stack, I got an error *Create Service Error: SC service is already used by service discovery namespace*. 

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/db316198-cdba-449a-b4e3-b9fcdaa61789)

### Solution 
To solve this I had to change the namespaces and match them in other stack files also.
`cluster/template.yaml`

```yaml
ServiceConnectDefaults:
        Namespace: cruddurCFN
```

`service/template.yaml`

```yaml
ServiceConnectConfiguration:
        Enabled: true
        Namespace: cruddurCFN
```
And then I successfully deployed service stack.

### #2 Error lines in `template.yaml` files 
After completing these stacks, I was facing some errors in `template.yaml` files of every stack but, they weren't affecting my CFN deploy. 

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/7defe280-71f7-4ca0-b494-b1422e8c1192)

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/d4d58921-b0dd-45fd-885e-cacfe92419d0)

To fix these error lines in template files I edited my `.vscode` -> `settings.json` file.
Then my code was error free and clean. **How you can find that `settings.json` file?** 

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/0a1b8902-2016-4472-b075-98d868b032d0)

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/b22173f5-c63d-450b-aedf-8830d0e8f330)

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/76bdab42-b999-484e-84bc-9a2595b901b8)

Add this updated code:

```json
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

### #3 Health-Checks were Failing 

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/e88464cd-6afa-4395-b88e-a957b39ec384)

### Solution
1. Set the `CrdClusterSrvSG` port to `4567` , Which is connected to ECS Backend service

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/8a4532f8-764f-4b3a-8d89-c68acc83e4b5)

2. Security gorup `CrdClusterALBSg` ports -> HTTP(80) and HTTPS(443) from anywhere source.

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/a5e8f892-3cea-491f-bf08-b04fa0fb1afd)

3. Target Group -> Backend service's Health-check port to `4567`

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/8b1abfd4-f727-451c-9556-f19250c228ee)

**Finally got health-check status as successful**

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/436f579a-1995-4fbc-923d-bf7d3dba115a)

### URL health-check status via CFN

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/faad276b-3b5f-43ac-be15-0480a8c33c58)

____________________________________________________________________________________________________________________________________________________________________

## SAM CFN for DynamoDB Stack & Lambda

SAM (Serverless Application Model) is a subset of CloudFormation. It just macros that allows you to implement stuff easily in CFN
Refer this link to know more about [AWS SAM DynamoDB](https://docs.aws.amazon.com/lambda/latest/dg/kinesis-tutorial-spec.html) 

### Install SAM
```bash
 wget https://github.com/aws/aws-sam-cli/releases/latest/download/aws-sam-cli-linux-x86_64.zip
      unzip aws-sam-cli-linux-x86_64.zip -d sam-installation
      sudo ./sam-installation/install
```
This will install all the SAM packages and I ran below command to remove them from commiting to my GitHub Repo.
```bash
rm -rf ./sam-installation/
```

Created three different bash scripts for [`ddb/build`](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/ddb/build), [`ddb/package`](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/ddb/package) and [`ddb/deploy`](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/ddb/deploy)

This is the [`ddb/template.yaml`](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/ddb/template.yaml) and [`/function/lambda_function.py`](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/ddb/function/lambda_function.py) for DDB CFN Stack.

____________________________________________________________________________________________________________________________________________________________________

## CI/CD Stack
Similar to the previous stacks, I created three files for CI/CD CFN: `config.toml`, `template.yaml` & `cicd` (deploy script). But, here I have also created a nested folder that contains `codebuild.yaml` script. Also created S3 bucket manually to store the artifacts. Created an empty folder in my root directory `tmp` which will be used when we cpmpile a package template and all that stuff will be stored in this `tmp` folder. So basically, I have wildacarded the `tmp` folder in my `.gitignore` 

____________________________________________________________________________________________________________________________________________________________________

## Frontend Stack (Static Web Hosting)
For this I did similar way - 3 files - `config.toml`, `template.yaml` & `frontend` (for deploying). 
Also added Certitficate ARN.

### Error Faced - CNMAE Not Attached

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/96838160-ab62-4821-b140-370f0c01301f)

### Solution
I misconfigured the file, in place of aliases I hadn't given my domain name. So that was the issue. Also delted the extra record type for domain (A). 

____________________________________________________________________________________________________________________________________________________________________

## All Stacks Deployed in CloudFormation

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/a16e4661-59f5-4028-94ce-16578c379831)

One more thing to remember: If you try deleting these stacks.. so here there is a nested stack which is been attched with the CICD stack. So to delete that you will first have to delete the CICD stack and then only you can delete the Nested stack.

## CFN Architecture
As I didn't have enough access to create my diagram on Lucid Charts, so I have created it on [draw.io](https://app.diagrams.net/) site. As there were limited features so I had to add images of few AWS Shapes but, I hope it depicts it's working correcting. Refer [this link](https://drive.google.com/file/d/1fhV6lNBbyj_nat0AHYB_CnF3olObhmeA/view?usp=sharing) to view my diagram **OR** you can also check it in my GitHub's repo in [Journal folder](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/CFN%20Architecture%20-Page-1.jpg) 


![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/ac04e588-3308-485b-a2ea-d3eb8e48724a)















