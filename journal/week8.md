# Week 8 — Serverless Image Processing
## Live Session Key Points: The Fundamentals of Cloud Development Kit
1. CDK is somewhat similar to CloudFormation, but is better than CloudFormation in terms of automation.
2. There are L1, L2 and L3 kind of things in CDK. Where L1 is considered as a basic level and L2 is more efficient one.
3. We can use multiple Languages in CDK - Python, Typescript, YAML and many other.
4. CDK is an open source IAC tool that takes outside people's opinion in building their tool. 
5. Is CDK good for Serverless ? -> YES!!! CDK works smoothly with serverless applications without stucking comparitavely.
6. Prerequisites for CDK : any of your favourite Language (python) and some AWS resources that you gonna use.

**What did we do ?**
- Create resources for an S3 bucket
- A lambda function that will pass our image
- Some interactions with API and webhook.

Installed cdk
```
npm install aws-cdk -g
```

Initialized CDK for TypeScript
```
cdk init app --language typescript
```

Imported Amazon S3 lib, Lambda
```ts
import * as S3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
```
## Serverless Pipeline Implemented
Created S3 Bucket
```typescript
 createBucket(bucketName: string): s3.IBucket {
    const bucket = new s3.Bucket(this, 'UploadsBucket', {
      bucketName: bucketName,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
    return bucket;
  }
```

**Bootstrapping Your Account** -> Process of provisioning resources of AWS CDK, before you can deploy CDK apps. Resources like S3 bucket for storing files, IAM roles grants Permissions needed for the deployments. 
```
cdk bootstrap "aws://ACCOUNT_ID/REGION_NAME"
```

Deployed CDK S3 bucket to AWS CloudFormation
```
cdk deploy
```

Then I created a nw folder `process-images` in `aws/lambdas` directory as we will be adding lambda functions in here. Created a n event via GUI.
and made scripts for `test.js` file.
```
const {getClient, getOriginalImage, processImage, uploadProcessedImage} = require('./s3-image-processing.js')

async function main(){
  client = getClient()
  const srcBucket = 'cruddur-thumbs'
  const srcKey = 'avatar/original/data.jpg'
  const dstBucket = 'cruddur-thumbs'
  const dstKey = 'avatar/processed/data.png'
  const width = 256
  const height = 256

  const originalImage = await getOriginalImage(client,srcBucket,srcKey)
  console.log(originalImage)
  const processedImage = await processImage(originalImage,width,height)
  await uploadProcessedImage(dstBucket,dstKey,processedImage)
}

main()
```
Initialized npm in `process-images` path
```
npmm init -y
```

Installed `sharpjs` package
```
npm i sharp
```
Installed `aws-sdk` for S3
```
npm i @aws-sdk/client-s3
```
For working of Lambda Function we need to remove sharp, so we created a `bin/serverless/build` script for that
```
#! /usr/bin/bash

ABS_PATH=$(readlink -f "$0")
SERVERLESS_PATH=$(dirname $ABS_PATH)
BIN_PATH=$(dirname $SERVERLESS_PATH)
PROJECT_PATH=$(dirname $BIN_PATH)
SERVERLESS_PROJECT_PATH="$PROJECT_PATH/thumbing-serverless-cdk"

cd $SERVERLESS_PROJECT_PATH

npm install
rm -rf node_modules/sharp
SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install --arch=x64 --platform=linux --libc=glibc sharp
```

Created a S3 Trigger in Lambda Function 

![](https://user-images.githubusercontent.com/115455157/233837040-2cfbac42-c076-4dae-a1fb-8fa28efca6e3.jpg)

Created S3 bucket with the name `assets.iamdevopsgeek.cloud` as `iamdevopsgeek.cloud` is my domain name. The Bucket has `avatars` as the object. In avatars we have two folders `original` and `processed`. And thy contains a `data.jpg` (Image)

![](https://user-images.githubusercontent.com/115455157/233837217-1bb18f6b-ffb4-489d-8ce2-322c6071ae14.jpg)

## Implemented User Profile
In this we restructured the bash files `serverless` and also created separate folders for `Original` and `Processed` avatars or images. We also created `banners` folder where I have inserted `banner.jpg` image for the cover. 

Edited **CloudFront** behaviours 

![](https://user-images.githubusercontent.com/115455157/234907251-89f2b134-96a5-4f65-b4b2-0045c2bb3267.png)

- Caching Optimized - Recommended for S3 (Cache Policy)
- CORS Custom Origin (Origin Request Policy)
- Simple CORS (Response Headers Policy)

Go to **CloudFront** -> **Distributions** -> In that Distribution, select that and go to **Edit Origin** -> Copy this Bucket policcy and paste it in your S3 Bucket Policy.

![](https://user-images.githubusercontent.com/115455157/234908843-f18067f6-3129-4fb6-8ac4-14e6a6b48ec0.jpg)

# Troubleshooting 
**1)** My `cdk deploy` was showing this error **"NoSuchBucket"**

![](https://user-images.githubusercontent.com/115455157/234910401-b76b3085-075c-485b-b884-f0ce2ce3a6be.png)

So, the solution was that I was giving wrong bucket name . When we had to create a bucket in s3 at that time I created it `assests.iamdevopsgeek.cloud` whereas, I was supposed to give name as `assets.iamdevopsgeek.cloud` . So this `assets` spelling caused this error. 

**2)** Then when i runned the 3000 port and was trying to load, it showed e **React must be in scope using JSX** error.

![](https://user-images.githubusercontent.com/115455157/234911454-533e881b-a199-4269-8518-4f6b581d5e6c.png)

**Solution:** I imported `react` module in every file that showed up this error.

**3)** TypeError: Cannot read properties of Undefined (reading 'display_name')

![](https://user-images.githubusercontent.com/115455157/234912339-0602d0fc-3353-4b66-b168-8fd0ca9abfaa.png)

**Solution:** I had hard-coded user handle in `Desktopnavigation.js` file. Instead of `@andrewbrown` I replaced it with `@krunalijain`

**4)** My `backend` conatiner was not working, it showed `AttributeError: 'Flask' object has no attribute 'before_first_request'. Did you mean 'got_first_request'?`

**Solution:** So, here one of the bootamper helped me solve this error. Instead of `@app.before_first_request` i replaced it with -> `with app.app_context():`. As Flask 2.3 doesn't supports `before_first_request`.

**Profile Page after Implementation**
![](https://user-images.githubusercontent.com/115455157/234914490-931aad9d-fb40-4f93-8a16-0405dcc6e599.png)

_______________________________________________________________________________________________________________________________________________________________________

## Implement Migrations Backend Endoint and Profile Form
Created this script so that we can move our file of `front-react-js` folder anywhere, and we don't have to change the path.
```json
{
  "compilerOptions": {
    "baseUrl": "src"
  },
  "include": ["src"]
}
```
**Migrate Script**
It retrieves the timestamp of the last successful migration run from the database, and then executes any pending migrations that have not been applied since that timestamp.

```
#!/usr/bin/env python3

import os
import sys
import glob
import re
import time
import importlib

current_path = os.path.dirname(os.path.abspath(__file__))
parent_path = os.path.abspath(os.path.join(current_path, '..', '..','backend-flask'))
sys.path.append(parent_path)
from lib.db import db

def get_last_successful_run():
  sql = """
    SELECT last_successful_run
    FROM public.schema_information
    LIMIT 1
  """
  return int(db.query_value(sql,{},verbose=False))

def set_last_successful_run(value):
  sql = """
  UPDATE schema_information
  SET last_successful_run = %(last_successful_run)s
  WHERE id = 1
  """
  db.query_commit(sql,{'last_successful_run': value},verbose=False)
  return value

last_successful_run = get_last_successful_run()

migrations_path = os.path.abspath(os.path.join(current_path, '..', '..','backend-flask','db','migrations'))
sys.path.append(migrations_path)
migration_files = glob.glob(f"{migrations_path}/*")


for migration_file in migration_files:
  filename = os.path.basename(migration_file)
  module_name = os.path.splitext(filename)[0]
  match = re.match(r'^\d+', filename)
  if match:
    file_time = int(match.group())
    if last_successful_run <= file_time:
      mod = importlib.import_module(module_name)
      print('=== running migration: ',module_name)
      mod.migration.migrate()
      timestamp = str(time.time()).replace(".","")
      last_successful_run = set_last_successful_run(timestamp)

```

**Rollback Script**
It retrieves the last successful run time from the database, compares it with the timestamps of migration files, and if there are migrations that occurred after the last successful run, it rolls back those migrations one by one.

```
#!/usr/bin/env python3

import os
import sys
import glob
import re
import time
import importlib

current_path = os.path.dirname(os.path.abspath(__file__))
parent_path = os.path.abspath(os.path.join(current_path, '..', '..','backend-flask'))
sys.path.append(parent_path)
from lib.db import db

def get_last_successful_run():
  sql = """
    SELECT last_successful_run
    FROM public.schema_information
    LIMIT 1
  """
  return int(db.query_value(sql,{},verbose=False))

def set_last_successful_run(value):
  sql = """
  UPDATE schema_information
  SET last_successful_run = %(last_successful_run)s
  WHERE id = 1
  """
  db.query_commit(sql,{'last_successful_run': value})
  return value

last_successful_run = get_last_successful_run()

migrations_path = os.path.abspath(os.path.join(current_path, '..', '..','backend-flask','db','migrations'))
sys.path.append(migrations_path)
migration_files = glob.glob(f"{migrations_path}/*")


last_migration_file = None
for migration_file in migration_files:
  if last_migration_file == None:
    filename = os.path.basename(migration_file)
    module_name = os.path.splitext(filename)[0]
    match = re.match(r'^\d+', filename)
    if match:
      file_time = int(match.group())
      print("==<><>")
      print(last_successful_run, file_time)
      print(last_successful_run > file_time)
      if last_successful_run > file_time:
        last_migration_file = module_name
        mod = importlib.import_module(module_name)
        print('=== rolling back: ',module_name)
        mod.migration.rollback()
        set_last_successful_run(file_time)
```

Created a Table `public.schema_information`

```
CREATE TABLE IF NOT EXISTS public.schema_information (
  id integer UNIQUE,
  last_successful_run text
);
INSERT INTO public.schema_information (id, last_successful_run)
VALUES(1, '0')
ON CONFLICT (id) DO NOTHING;
```
This will insert data only once.

## Lambda CruddurApiGatewayAuthorization Test
I was facing issue with Authorization Test, the logs were not generating. Later in office hours Andrew(organizer) suggested to attach lambda to OPTIONS in Integrations section.

![](https://user-images.githubusercontent.com/115455157/236808623-2052ca0f-05b0-4c77-8ece-24b6eb39ecfd.jpg)

## CORS
To prevent CORS, one of the bootcamper (Shehzad Ali) suggested me to detach Lambda from OPTIONS in Authorization section, so that it will block it prior only and won't allow to affect Lambda Function.

![](https://user-images.githubusercontent.com/115455157/236809122-7d189c8a-4cfc-4259-a17c-f8d26ce78bb6.jpg)

Because of this I didn't had to struggle much with CORS. 

I had also got presignedurl easily. Actually there was a silly mistake in `ProfileForm.js` - instead of `presignedurl`, I had written it as `setPresignedurl` in one code block. So may be that was one of the thing that was causing error.

## S3 Bucket and Objects
At first I didn't get my cognito_user_uuid Object in my `assets.iamdevopsgeek.cloud` bucket.
I had to change the paths of the bucket objects uploading, in `/thumbing-serverless-cdk/.env.example` 
```
THUMBING_S3_FOLDER_INPUT=""
THUMBING_S3_FOLDER_OUTPUT="avatars"
```
By keeping the above envs, I could upload object passed with cognito_user_uuid in the right folder that is - `assets.iamdevopsgeek.cloud/avatars/`.

**Created a `ProfileAvatar.js` for rendering avatar profile image.**
```
import './ProfileAvatar.css';

export default function ProfileAvatar(props) {
  const backgroundImage = `url("https://assets.iamdevopsgeek.cloud/avatars/${props.id}.jpg")`;
  const styles = {
    backgroundImage: backgroundImage,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div 
      className="profile-avatar"
      style={styles}
    ></div>
  );
}
```
## Sharp Module Not Found

![](https://user-images.githubusercontent.com/115455157/236811376-bfbf2d24-cf26-48d7-a019-6a5e2b741395.jpg)

I got this error when I was uploading image. Steps I took to solve this:
-> `npm i sharp`
-> `npm i @aws-sdk/client-s3`
-> cdk deploy


## The final UI after uploading profile iamge 
![](https://user-images.githubusercontent.com/115455157/236810740-7f448ba9-1d15-4a6b-a3b5-f9ee407546ac.jpg)


























