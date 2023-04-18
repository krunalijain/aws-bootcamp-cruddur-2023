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







