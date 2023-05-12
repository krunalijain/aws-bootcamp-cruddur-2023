# Week 10 — CloudFormation Part 1

## Creation of  CFN template
In the `aws` folder we created a `cfn` folder and created a `template.yaml` file. Where it Sets up a ECS empty Cluster.
```
AWSTemplateFormatVersion: 2010-09-09
Description: |
  Setup ECS Cluster
Resources:
  ECSCluster: #LogicalName
    Type: 'AWS::ECS::Cluster'
    Properties:
      ClusterName: MyCluster1
      CapacityProviders:
        - FARGATE
#Parameters:
#Mappings:
#Outputs:
#Metadata:
```

Then we created a `cluster-deploy` bash script in `bin/cfn` folder which will deploy these tasks into that empty template (ECS Cluster).
```
#! /usr/bin/env bash
set -e # stop the execution of the script if it fails

CFN_PATH="/workspace/aws-bootcamp-cruddur-2023/aws/cfn/cluster/template.yaml"
CONFIG_PATH="/workspace/aws-bootcamp-cruddur-2023/aws/cfn/cluster/config.toml"
echo $CFN_PATH

cfn-lint $CFN_PATH

BUCKET=$(cfn-toml key deploy.bucket -t $CONFIG_PATH)
REGION=$(cfn-toml key deploy.region -t $CONFIG_PATH)
STACK_NAME=$(cfn-toml key deploy.stack_name -t $CONFIG_PATH)
PARAMETERS=$(cfn-toml params v2 -t $CONFIG_PATH)

aws cloudformation deploy \
  --stack-name $STACK_NAME \
  --s3-bucket $BUCKET \
  --s3-prefix cluster \
  --region $REGION \
  --template-file "$CFN_PATH" \
  --no-execute-changeset \
  --tags group=cruddur-cluster \
  --parameter-overrides $PARAMETERS \
  --capabilities CAPABILITY_NAMED_IAM
```

There are some guard rules or taskdefinitions for ECS Cluster. This is called as **Policy-as-Code**. The purpose of this is that, they help us to configure the resources in a pattern/way that we want to. If, the resources are being configured against the policy then it will prompt or let us know that this is not the rule for this resource to be configured. So that's how it works.

**Before you create these rules/policies, you need to install `cfn-guard`**

```
cargo install cfn-guard
```


**Then we created `task-definition.guard` in `aws/cfn` folder** 

```
aws_ecs_cluster_configuration {
  rules = [
    {
      rule = "task_definition_encryption"
      description = "Ensure task definitions are encrypted"
      level = "error"
      action {
        type = "disallow"
        message = "Task definitions in the Amazon ECS cluster must be encrypted"
      }
      match {
        type = "ecs_task_definition"
        expression = "encrypt == false"
      }
    },
    {
      rule = "network_mode"
      description = "Ensure Fargate tasks use awsvpc network mode"
      level = "error"
      action {
        type = "disallow"
        message = "Fargate tasks in the Amazon ECS cluster must use awsvpc network mode"
      }
      match {
        type = "ecs_task_definition"
        expression = "network_mode != 'awsvpc'"
      }
    },
    {
      rule = "execution_role"
      description = "Ensure Fargate tasks have an execution role"
      level = "error"
      action {
        type = "disallow"
        message = "Fargate tasks in the Amazon ECS cluster must have an execution role"
      }
      match {
        type = "ecs_task_definition"
        expression = "execution_role == null"
      }
    },
  ]
}
```

To **generate your rules or guard file** you need to run this command with specifying the template path.
```
cfn-guard rulegen --template /workspace/aws-bootcamp-cruddur-2023/aws/cfn/template.yaml
```
**Install `cfn-lint`.** This basically works as validation tool for Cloudformation templates.
```
pip install cfn-lint
```

Then we created s3 bucket `cfn-lint-20` and deployed that template into s3 bucket.

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/ff4821e2-aeab-4b16-9731-59db2e1d9718)

## Networking Layer
We created a networking layer where we require VPC, IGW, Routing tables, Subnetes (3) for flexibility to have in 3 different Availablity Zones.
In VPC section,we have CIDR property- where we have given a CIDR IP address as `10.0.0.0/16`. SO in here, `/16` is the size of the IP addresses available in that particular CIDR block. You can search it on ![CIDR.xyz][CIDR.xyz] site - how many IPs are available in one particular IP size?  






