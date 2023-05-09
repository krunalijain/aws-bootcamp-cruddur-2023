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
- Then selected a Source Provider as GitHub. As our **source code Repository is in a GitHub**. 
  **What is Source Code Repo?** 
  All the code that is required to build the application at any given point in time, no matter at what stage it is even if it's in production that is everyone can see it VERSUS as a developer trying to develop it today. So this term is called as Source Code Repository. CI/CD piepline uses source code repository.
  
-   
  
