# Week 10 — CloudFormation Part 1

## Table of Contents
- [Creation of CFN template](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week10.md#creation-of--cfn-template)
- [Install CFN Guard](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week10.md#:~:text=you%20need%20to-,install%20cfn%2Dguard,-cargo%20install%20cfn)
- [Created task-definition.guard](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week10.md#cluster-layer:~:text=Then%20we%20created%20task%2Ddefinition.guard%20in%20aws/cfn%20folder)
- [Genrate rules/guard file](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week10.md#:~:text=generate%20your%20rules%20or%20guard%20file)
- [Install CFN Lint](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week10.md#:~:text=cfn/template.yaml-,Install%20cfn%2Dlint.,-This%20basically%20works)
- [Created s3 bucket & Deployed temaplte in that bucket](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week10.md#:~:text=created%20s3%20bucket%20cfn%2Dlint%2D20)
- [Networking Layer](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week10.md#networking-layer)
- [Create VPC](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week10.md#create-vpc)
- [Create adn Attach IGW (Internet gateway)](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week10.md#create-adn-attach-igw-internet-gateway)
- [Create Route Table](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week10.md#create-route-table)
- [Create another Route Table that is related to IGW](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week10.md#create-another-route-table-that-is-related-to-igw)
- [Create Subnets](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week10.md#create-subnets)
- [CFN Parameters](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week10.md#cfn-parameters)
- [Modified Network Layer](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week10.md#modified-network-layer)
- [Cluster Layer](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week10.md#cluster-layer)
- [Install TOML](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week10.md#install-toml)
- [Points to remember](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week10.md#cluster-layer:~:text=of%20CloudFormation%20Templates.-,Points%20to%20remember,-Passed%20a%20Certificate)
- [Cluster Resources](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week10.md#cluster-resources)
- [Architectural Diagram](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week10.md#architectural-diagram)

## Creation of  CFN template
In the `aws` folder we created a `cfn` folder and created a `template.yaml` file. Where it Sets up a ECS empty Cluster.
```yaml
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
```bash
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

```bash
cargo install cfn-guard
```


**Then we created `task-definition.guard` in `aws/cfn` folder** 

```yaml
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
```bash
pip install cfn-lint
```

Then we created s3 bucket `cfn-lint-20` and deployed that template into s3 bucket.

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/ff4821e2-aeab-4b16-9731-59db2e1d9718)

## Networking Layer
We created a networking layer where we require VPC, IGW, Routing tables, Subnetes (3) for flexibility to have in 3 different Availablity Zones.
In VPC section, we have CIDR property- where we have given a CIDR IP address as `10.0.0.0/16`. So in here, `/16` is the size of the IP addresses available in that particular CIDR block. You can search it on [CIDR.xyz](CIDR.xyz) site to know **how many IPs are available in one particular IP size?** 
There are redundant links which will help us if one link fails then other will work in that case and it will prevent our apps downtime.

Once we deploy after creating VPC, it will automatically creates a Route Table with no resources and subnets in you VPC Service.

### Create VPC
```yaml
Resources:
  VPC:
    # https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-vpc.html
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: !Ref VpcCidrBlock
      EnableDnsHostnames: true
      EnableDnsSupport: true
      InstanceTenancy: default
      Tags:
        - Key: Name
          Value: !Sub "${AWS::StackName}VPC"
```

### Create adn Attach IGW (Internet gateway)
```yaml
Resources:
IGW:
    # https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-internetgateway.html
    Type: AWS::EC2::InternetGateway
    Properties:
      Tags:
        - Key: Name
          Value: !Sub "${AWS::StackName}IGW"
  AttachIGW:
    Type: AWS::EC2::VPCGatewayAttachment
    Properties:
      VpcId: !Ref VPC
      InternetGatewayId: !Ref IGW
```

### Create Route Table
```yml
RouteTable:
    # https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-routetable.html
    Type: AWS::EC2::RouteTable
    Properties:
      VpcId:  !Ref VPC
      Tags:
        - Key: Name
          Value: !Sub "${AWS::StackName}RT"
```

### Create another Route Table that is related to IGW
```yml
 RouteToIGW:
    # https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-route.html
    Type: AWS::EC2::Route
    DependsOn: AttachIGW
    Properties:
      RouteTableId: !Ref RouteTable
      GatewayId: !Ref IGW
      DestinationCidrBlock: 0.0.0.0/0
 ``` 
 
 ### Create Subnets
 Also created different Subnets (Public & Private) and have given referrence to those subnets and associated with Route tables.
 
 **Public Subnet 1**
 ```yml
 SubnetPub1:
    # https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-subnet.html
    Type: AWS::EC2::Subnet
    Properties:
      AvailabilityZone: !Ref Az1
      CidrBlock: !Select [0, !Ref SubnetCidrBlocks]
      EnableDns64: false
      MapPublicIpOnLaunch: true #public subnet
      VpcId: !Ref VPC
      Tags:
        - Key: Name
          Value: !Sub "${AWS::StackName}SubnetPub1"
 ```
 
 **Private Subnet 1**
 ```yml
  SubnetPriv1:
    # https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-subnet.html
    Type: AWS::EC2::Subnet
    Properties:
      AvailabilityZone: !Ref Az1
      CidrBlock: !Select [3, !Ref SubnetCidrBlocks]
      EnableDns64: false
      MapPublicIpOnLaunch: false #public subnet
      VpcId: !Ref VPC
      Tags:
        - Key: Name
          Value: !Sub "${AWS::StackName}SubnetPriv1"
 ```
 
 **Associated Subnet 1 with Route table**
 ```yml
 SubnetPub1RTAssociation:
    Type: AWS::EC2::SubnetRouteTableAssociation
    Properties:
      SubnetId: !Ref SubnetPub1
      RouteTableId: !Ref RouteTable
 ```
 
 **NOTE: Created 3 subnets by following the similar code pattern with different IPs**
 
### CFN Parameters
CFN will now allow you to hardcode the values in it's `template.yaml` file. So always make sure to set parameters. You can refer the [AWS Documentation of CFN Parameters](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/parameters-section-structure.html) to understand clearly and know what syntax is being followed.

After creating the subnets, VPCs, Route Tables we deployed Networking Layer and it uploaded in our CloudFormation Stack.
**Resources after deploying Networking Layer**

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/45794e5b-c09d-4bf2-bf74-e448972368c0)

### Modified Network Layer
We changed the name given to this CFN Networking Stack to `CrdNet` and re-deployed. The updated `template.yaml` is [here](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/aws/cfn/networking/template.yaml) with description added and subnets attached.

## Cluster Layer
This will help in suporting the fargate containers. We have added ALB which supports IPv4 only, IPv6 is being disabled. ALB security Gorups are being created. Then, there is HTTP Listeners, Backend & Frontend Target Groups. Refer this cluster [`template.yaml`](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/aws/cfn/cluster/template.yaml) 

And a `cluster` file was been created to deploy CFN Stack.
```bash
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

### Install TOML
```bash
gem install cfn-toml
```

TOML is a **Tom's Obvious, Minimal Language**. It's a configuration file which is easy to read and write, the format consists of Key-Value pair. So we have used this TOML config file (`config.toml`) for creation of CloudFormation Templates. 

**Points to remember**
- Passed a **Certificate ARN** in the `config.toml` file, which will be attached to ALB -> HTTPS 443 Listener. 
- In ALB , we need to pass SecurityGroup ID and not SecurityGroup Name.
- One ALB cannot be attached to multpiple subnets in same AZ.

### Cluster Resources 
- Application Load Balanacer (ALB) 
- IPV4 only 
- Internet facing  
- Certificate attached from Amazon Certification Manager (ACM) 
- ALB Security Group - HTTPS Listerner 
- Send naked domain to frontend Target Group  
- Send api. subdomain to backend Target Group 
- HTTP Listerner (redirects to HTTPS Listerner)  
- Backend Target Group 
- Frontend Target Group

## Architectural Diagram 
Here's my diagram tat depicts the work flow of Networking and Cluster stack in AWS CFN.

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/97bdd6e8-e829-4238-933b-ce8dba120acd)

The documentation of further stacks are been covered in week 11 journal.









