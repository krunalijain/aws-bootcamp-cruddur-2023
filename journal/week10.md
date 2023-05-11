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

```
