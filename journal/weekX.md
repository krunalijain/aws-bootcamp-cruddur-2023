# Week X — Sync Tool for Static Website Hosting and CleanUp

This is the last week where I have worked on Cleaning the code and Static Website hosting- deploying the Cruddur Application on Production Environment. 

### Setup Static Building for our application
So firstly, I created a [`static-built`](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/bin/frontend/static-build) file for frontend. Downloaded a Build.zip file and uploaded that in S3 Bucket `iamdevopsgeek.cloud`. To download that I ran this command:
```
zip -r build.zip build/
```
Then downloaded this build file and deleted that folder from the gitpod and uploaded this zip file into naked S3 bucket - `iamdevopsgeek.cloud`.

Created a new file [`sync`](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/bin/frontend/sync) to sync all the local code changes with prod environment and [`sync.env.erb`](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/erb/sync.env.erb).In this sync envs don't forget to add this path `/tmp/changeset.json` in front of output changeset `SYNC_OUTPUT_CHANGESET_PATH=<%=  ENV['THEIA_WORKSPACE_ROOT'] %>`, orelse it will not sync and end up with an error. For this you need to keep a `tmp` folder in your root directory.

### Added Sync Tool
Created a [`generate.env`](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/bin/frontend/generate-env) script for frontend to generate the env variables for syncing tool. Then, installed `dotenv` and ran the `sync` script.
```
gem install dotenv
```
### Sync Stack
Created a `github/workflow` folders in root directory and a file in it [`sync.yaml.example`](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/github/workflows/sync.yaml.example) and [`Gemfile`](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/Gemfile) & [`Rakefile`](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/Rakefile) in root directory.

For Sync stak: created `config.toml`, `template.yaml` & [`sync`](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/bin/cfn/sync) bash script to deploy the template into CFN. 

**Used OIDC in this, what is OIDC?**
OIDC stands for **OpenID Connect**. OpenID Connect is an interoperable authentication protocol based on the OAuth 2.0 framework of specifications (IETF RFC 6749 and 6750). It simplifies the way to verify the identity of users based on the authentication performed by an Authorization Server and to obtain user profile information in an interoperable and REST-like manner. [Ref](https://openid.net/developers/how-connect-works/) 

**OIDC in AWS CFN**
Creates or updates an IAM entity to describe an identity provider (IdP) that supports OpenID Connect (OIDC). The OIDC provider that you create with this operation can be used as a principal in a role's trust policy. Such a policy establishes a trust relationship between AWS and the OIDC provider.
[Ref](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-oidcprovider.html)

Updated Bundle
```
bundle update --bundle
```

Then ran `sync` deploying script for CFN. 
Attached Inline Policy to `CrdSyncRole`
```
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "VisualEditor0",
			"Effect": "Allow",
			"Action": [
				"s3:PutObject",
				"s3:GetObject",
				"s3:ListBucket",
				"s3:DeleteObject"
			],
			"Resource": [
				"arn:aws:s3:::iamdevopsgeek.cloud/*",
				"arn:aws:s3:::iamdevopsgeek.cloud"
			]
		}
	]
}
```

### Reconnect DB & Post Confirmation Lambda
Ran `build`, `push` & `register` script for backend and did Force Deployment. If it doesn't works then try re-deploying the Service Stack in CFN. 
Then changed RDS Endpoint URL in gitpod envs & parameter store for backend CONNECTION_URL. Edited Security Group of RDS -> added another Inbound Rule
`Type= Postgres; Source= MyIP`. 
Then I was supposed to update my rds sg rule. For this is a script [`update-sg-rule`](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/bin/rds/update-sg-rule). Make sure you have already ran this command to export Gitpod IP
```
export GITPOD_IP=$(curl ifconfig.me) 
```
Then you will be able to connect to Prod Databse 
```
./bin/db/connect prod
```
Then ran migration file for pro environment by this command 
```
CONNECTION_URL=$PROD_CONNECTION_URL ./bin/db/migrate
```
Edit the `cruddur-post-confirmation` lambda function's env vars -> `CONNECTION_URL` (RDS updated endpoint URL)
Then you should be able to log in prod url and if face any issues then - check cognito user's ID whether matches in code or can try dleeting the cognito user & creating a new cognito user (signup).

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/3922aa45-e778-4a2e-bbff-5856ad9d86cc)

### Cruds Not visible - Fixed
On prod url I was not able to view cruds on my cruddur application's home page. To fix that I edited `aws/cfn/service/template.yaml` 
```
EnvFrontendUrl:
    Type: String
    Default: "https://iamdevopsgeek.cloud"
  EnvBackendUrl:
    Type: String
    Default: "https://api.iamdevopsgeek.cloud"
```
So, instead of `Default: "*"` -> change i tot -> `Default: "https://api.iamdevopsgeek.cloud"` . And that fixed my issue of cruds not visible. I had also added [`bin/backend/connect-service`](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/b4733c6716d711c673757605d830cda556e9f39e/bin/backend/connect-service) file.

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/8b85d78b-00bf-446f-893a-635492186fa8)

### Error 401 (unable to post crud) Fixed
So, I was not able to post crud on my Prod URL application, was getting 401 error. 
![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/b2039fe0-18d8-4ef4-bd10-8f4c01f84c3e)

**To solve this -**
I had to add the authorization in [`frontend-react-js/src/components/ActivityForm.js`](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/2e84e27eb530f74be1ac9ba86ddae90d986f70db/frontend-react-js/src/components/ActivityForm.js) file and then access_token was passing and I was able to post a crud from Prod URL.
```
import { checkAuth, getAccessToken } from '../lib/CheckAuth';
```

```
 const onsubmit = async (event) => {
    event.preventDefault();
    try {
      await getAccessToken()
      const access_token = localStorage.getItem("access_token")
      console.log('activityform', access_token)
      const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/activities`
      console.log('onsubmit payload', message)
      const res = await fetch(backend_url, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
```

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/9f872820-71fa-4de8-bd16-37f89f7ad969)

### Refactored JWT decorator & flask routes, fixed CI/CD configuration
Edited `ReplyFrom.js` -> `app.py` & `cognito-jwt-token.py` and was able to close reply window after clicking outside of the window - fixed this feature. Fixed CI/CD `buildspec.yaml` path in `config.toml` file. 
**NOTE:** As we need to specify the `buildspec.yaml` file's path while configuring, if it is in another directory. You can only NOT spwcify it when it's in the same directory.
*Reference:* [How BuildSpec works](https://docs.aws.amazon.com/codebuild/latest/userguide/concepts.html#concepts-how-it-works) & [Build specification reference for CodeBuild](https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html#build-spec-ref-name-storage) .

### Implemented Replies working & Error handling features
**Reply Feature Working** 

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/993bd366-22ef-4a66-81d3-642bdf183267)

**Error Handling Feature**

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/5ab97d46-7333-4fde-8dcb-8420cba9b210)

**Cruds working from Alt account**

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/af5acc15-5263-4843-8a7d-c65b9d9264b3)

Then we fixed **Date & Timezone**, **added back button & some more UI changes** and **fixed migrations** as well for Prod Environment.

### Cleanup Part
Created a **machine user** for dynamoDB access. Though we have admin access but, it was not accepting. Possibilities are that the same credentials might have gone out of date and were not useful?! Maybe, because of this reason there was a need to create this Machine user and update the `access_key` & `secrete_access_key` in parameter store. As we are using DynamoDB in backend and to get required permissions for dynamodb, this machineuser was been created.

**DynamoDBFullAccessPolicy**
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "dynamodb:PutItem",
                "dynamodb:GetItem",
                "dynamodb:Scan",
                "dynamodb:Query",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem",
                "dynamodb:BatchWriteItem"
            ],
            "Resource": "*",
            "Effect": "Allow"
        }
    ]
}
```

After all the changes I did a New Pull request and waited until I get a successful built CI/CD piepline.

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/b007ed3c-2bd9-448a-92d0-4c82877208fc)

And then before syncing my Local env to Prod env, I edited and fixed some code (can refer my git repo's commit) and ran 
```
./bin/frontned/static-build
```

and then fixed sync's path in `erb/sync.env.erb` file. You need to add `/changeset.json` at the end of `SYNC_OUTPUT_CHANGESET_PATH=<%=  ENV['THEIA_WORKSPACE_ROOT'] %>/tmp`, then ran
```
./bin/frontend/sync
```
And then wait for CloudFront -> Frontend Distribution's -> Invalidations to get in success state.

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/017c413c-f6e9-41d8-a4a2-02f2624e9e4b)

### Messages Fixed on Local Environment
I was facing issue on my Local Environment- Messaging was not working.

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/0d6f2f73-b29b-4155-8556-bb0f5da34c3c)

**Resolved this by** removing `AWS_ENDPOINT_URL` from `backend-flask.env` file.

Then I was able to see data in DynamoDB Table.

![](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/assets/115455157/3fe73750-91c0-4b4e-ac9a-c0f03505162c)

### Note
But due to some network issues on my end, everytime while working on Prod-Env I have to keep switching my internet connection from WiFi -> Mobile Hotspot and then only I am able to see any Cruds or Post Cruds. And it works only for 1 second ad then again I am supposed to switch my network for working of the application. 

### Solution for app on Production
Need to edit `CONNECTION_URL` in `backend-flask.env` from Local environment to Prod environment.





















