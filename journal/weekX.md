# Week X — Sync Tool for Static Website Hosting and CleanUp

This is the last week where I have worked on Cleaning the code and Static Website hosting- deploying the Cruddur Application on Production Environment. 

### Setup Static Building for our application
So firstly, I created a [`static-built`](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/bin/frontend/static-build) file for frontend. Downloaded a Build.zip file and uploaded that in S3 Bucket `iamdevopsgeek.cloud`. To download that I ran this command:
```
zip -r build.zip build/
```
Then downloaded this build file and deleted that folder from the gitpod and uploaded this zip file into naked S3 bucket - `iamdevopsgeek.cloud`.

Created a new file [`sync`](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/bin/frontend/sync) to sync all the local code changes with prod environment and [`sync.env.erb`](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/erb/sync.env.erb).In this sync envs don't forget to add this path `/tmp/changeset.json` in front of output changeset `SYNC_OUTPUT_CHANGESET_PATH=<%=  ENV['THEIA_WORKSPACE_ROOT'] %>`, orelse it will not sync and end up with an error. For this you need to keep a `tmp` folder in your root directory.
