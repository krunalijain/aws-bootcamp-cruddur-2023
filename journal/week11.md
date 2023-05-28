# Week 11 — CloudFormation Part 2

After the completion of Networking & Cluster Stak I move forward with implementing of RDS, Sevice, DynamoDB & CICD stacks in AWS CloudFormation.

As created for previous stacks, similarly, here also I created a `template.yaml` & `config.toml` for RDS DataBase Configuration. And a `db` deploy script which will deploy the CFN Stack. In here, I added my CONNECTION_URL in the parameter store and also set DB_PASSWORD as a git env var before running the script. 

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

Here's the `template.yaml` [code](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/aws/cfn/db/template.yaml)
