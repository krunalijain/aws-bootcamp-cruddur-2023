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

### Recoonect DB & Post Confirmation Lambda
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



