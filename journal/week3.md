# Week 3 — Decentralized Authentication

## Required Homework
## #1 Live Session 
### AWS Cognito
In this live session, I first created a UserPool in AWS Cognito. 
**Steps to setup UserPool in AWS Cognito**
- Login to your AWS Console
- Check your region in which you want to use your service. I personally prefer `us-east-1` region as in that region most of the services works well.
- Search for **Cognito** service and you will find **UserPool** tab in your left side panel.
- After clicking on **UserPool** -> **Create UserPool**.
- You will be displayed with a **Authentication providers** page where I chose **Username** and **Email** for Cognito user pool sign-in options -> click **Next**
- Password Policy I kept it as **Cognito Default**.
- Under Multi-factor authentication -> I selected **No MFA** -> **Next**
- In User account recovery -> checkbox **Email only** -> **Next**
- Under Required attributes -> I selected **Name** and **preferred username** (Note: once you create a userpool then you cannot modify these required attributes so make sure to add correctly when creating) -> **Next**
- Then I chose **Send email with Cognito** for first time -> **Next**
- After that you will be asked to give your User Pool Name , I gave it as **crddur-user-pool** -> under Initial app client I kept it as **Public client** -> enter app client name **(eg: cruddur)** -> **Next**
- You will get a chance to verify all the filled details and then calick on **Create User Pool**, your usepool is being created.
