# Week 3 — Decentralized Authentication

# Required Homework
# #1 Live Session 
## AWS Cognito
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
- You will get a chance to verify all the filled details and then click on **Create User Pool**, your usepool is being created.

## Gitpod Code Working 
I installed AWS Amplify as it is development platform and provides you set of pre-built UI components and Libraries. 
```
npm i aws-amplify --save
```
After installing this I found `"aws-amplify": "^5.0.16",` in my frontend-react-js directory's `package.json` file.

**Note: make sure you are running these commands in your `frontend-react-js` directory.**

### Configure Amplify
I added this code in `app.js` of frontend-react-js directory.
```
import { Amplify } from 'aws-amplify';

Amplify.configure({
  "AWS_PROJECT_REGION": process.env.REACT_AWS_PROJECT_REGION,
  "aws_cognito_identity_pool_id": process.env.REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID,
  "aws_cognito_region": process.env.REACT_APP_AWS_COGNITO_REGION,
  "aws_user_pools_id": process.env.REACT_APP_AWS_USER_POOLS_ID,
  "aws_user_pools_web_client_id": process.env.REACT_APP_CLIENT_ID,
  "oauth": {},
  Auth: {
    // We are not using an Identity Pool
    // identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID, // REQUIRED - Amazon Cognito Identity Pool ID
    region: process.env.REACT_AWS_PROJECT_REGION,           // REQUIRED - Amazon Cognito Region
    userPoolId: process.env.REACT_APP_AWS_USER_POOLS_ID,         // OPTIONAL - Amazon Cognito User Pool ID
    userPoolWebClientId: process.env.REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID,   // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
  }
});
```

In the above code set these below env vars in `docker-compose.yml`.
```
REACT_APP_AWS_PROJECT_REGION= ""
REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID= ""
REACT_APP_AWS_COGNITO_REGION= ""
REACT_APP_AWS_USER_POOLS_ID= ""
REACT_APP_CLIENT_ID= ""
```
