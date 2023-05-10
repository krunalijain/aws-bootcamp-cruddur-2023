# Week 9 — CI/CD with CodePipeline, CodeBuild and CodeDeploy

This week is all about bringing are work to automation.The CI/CD using Amazon CodePipeline and CodeBuild. There are various other options for CI/CD like: 
- AWS Co-Pilot : It's a great service to use for creating pipelines BUT, it's very easy and that is why we didn't choose this as our organizer wants us to have some good challenging experience with pipelines.
- CDK Pipelines : This requires some level of constructs. Henc, rejected for this project.
- GitHub Actions : As this is an outsider and we want to have everything in our AWS.
- **AWS CodePiepline** : This is a CI/CD service which is being provided by the AWS itself and by this we can manage resources under CFN. So we chose this pipeline.

## Why CodePipeline?
Everytime we make code changes and needs to run docker compose up or build images manually, so to automate these things we use CodePipeline.

## Create Code Pipeline:
- We gave our pipeline name `cruddur-backend-fargate`as it was for backend-flask container which has Fargate in use.
- Artifacts store: A place to store stuff like outputs from different parts of stages of pipelines, to carry forward to other parts of piepline.
- Then selected a **Source Provider as GitHub**. As our **source code Repository is in a GitHub**. 
  **What is Source Code Repo?** 
  All the code that is required to build the application at any given point in time, no matter at what stage it is even if it's in production that is everyone can see it VERSUS as a developer trying to develop it today. So this term is called as Source Code Repository. CI/CD piepline uses source code repository.
  
-  Selecting Source Code as GitHub -> will connect your AWS CodePipeline to GitHub repository and if any changes done, then it will trigger pipeline executions.
-  Create **New (prod) Branch** in GitHub (steps are given below)
- Select **Deploy Provider** as ECS and create a pipeline.

## Create New (prod) Branch in GitHub
So when we deploy our code, we will have to do a `git pull` into `prod` branch and merge it. This will trigger the CI/CD pipeline and that's how this will automate the rest of the tasks.

### 1) Go to your Repository -> click on Pull requests

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/c898eb00-f0df-428e-b8b2-6eb76f018af0)


### 2) Click on New Pull request

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/b2548bb7-3dd8-4f30-a19b-0a9b35f39107)


### 3) Select Base Branch as Prod (The one which you have created new and wants the changes to be pulled in)

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/0f7cbf4d-5ea9-4338-84c1-f3e393300741)


### 4) Select Comapre: branch as Main (The one from whcih changes needs to be pushed from) and Create Pull request

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/a01ace75-11c5-4773-b213-73873f87e4d6)

Then click on **create pull request** and **confirm merge.** 

## Add extra stage (build)
Added a **(bake)** stage in between **Source** and **Deploy** 

Edit `bake stage`, add an action group.

-> Action name: `build`. 

Note: In AWS you can not give names according to your choice, they are name specific and pre-built names are there to use. If you name according to your choice then the pipeline might fail.

-> Action provider: `AWS CodeBuild`

-> Region: `us-east-1` (give your own region)

-> Input Artifacts: `SourceArtifact`

-> Project name: `cruddur-backend-flask-bake-image`(for this we first need to have our project existing in codebuild).


## buildspec.yml file for CodeBuild
```
# Buildspec runs in the build stage of your pipeline.
version: 0.2
phases:
  install:
    runtime-versions:
      docker: 20
    commands:
      - echo "cd into $CODEBUILD_SRC_DIR/backend"
      - cd $CODEBUILD_SRC_DIR/backend-flask
      - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $IMAGE_URL
  build:
    commands:
      - echo Build started on `date`
      - echo Building the Docker image...          
      - docker build -t backend-flask .
      - "docker tag $REPO_NAME $IMAGE_URL/$REPO_NAME"
  post_build:
    commands:
      - echo Build completed on `date`
      - echo Pushing the Docker image..
      - docker push $IMAGE_URL/$REPO_NAME
      - cd $CODEBUILD_SRC_DIR
      - echo "imagedefinitions.json > [{\"name\":\"$CONTAINER_NAME\",\"imageUri\":\"$IMAGE_URL/$REPO_NAME\"}]" > imagedefinitions.json
      - printf "[{\"name\":\"$CONTAINER_NAME\",\"imageUri\":\"$IMAGE_URL/$REPO_NAME\"}]" > imagedefinitions.json

env:
  variables:
    AWS_ACCOUNT_ID: <youraccountID>
    AWS_DEFAULT_REGION: <yourregion>
    CONTAINER_NAME: backend-flask
    IMAGE_URL: <youraccountID>.dkr.ecr.us-east-1.amazonaws.com
    REPO_NAME: backend-flask:latest
artifacts:
  files:
    - imagedefinitions.json
```

Add this `buildspec.yml` in CodeBuild. So that it will adapt all the new changes.

## JSON Policy in IAM for CodeBuild
I got this error when did codebuild

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/05d8da33-fd6f-453c-97fc-2cf8d5a317a0)

It mainly requires `getAuthorizationToken` permission. So I went to IAM Roles -> Select role that has been created for CodeBuild -> Add as an Inline Policy.
```
{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "VisualEditor0",
        "Effect": "Allow",
        "Action": [
          "ecr:BatchCheckLayerAvailability",
          "ecr:CompleteLayerUpload",
          "ecr:GetAuthorizationToken",
          "ecr:InitiateLayerUpload",
          "ecr:PutImage",
          "ecr:UploadLayerPart",
          "ecr:BatchGetImage",
          "ecr:GetDownloadUrlForLayer"
        ],
        "Resource": "*"
      }
    ]
  }
  ```
  Added this JSON policy in IAM Role of CodeBuild.
 ![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/2910e720-caeb-433f-832e-ad06d2e3c72a)
 
 ## Build Succeful
 My CodeBuild was succeful.
 
 ![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/6e02f005-15f0-4838-bfc5-e273a3a54dee)
 
 
Then I rebuild the pipeline and I got success status for `Source`, `Build`, and `Deploy`. I got a success status after 10mins in `Deploy Stage`, as it takes time to spin up ECS, ALB tasks, and other tasks to load.

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/f649d069-51ae-4481-b442-9e28a14573dd)

So that was it in this week-9 all about building CI/CD CodePipeline and make it successfully working. 













  
