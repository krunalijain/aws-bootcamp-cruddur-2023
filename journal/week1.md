# Week 1 — App Containerization

## Table of Contents
- [Homework Required](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week1.md#homework-required)
- [Launched Gitpod and Implemented Notifications](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week1.md#1-launched-gitpod-and-implemented-notifications)
- [Troubleshooted Error : 404 Not Found [Unhandled Thrown Error]](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week1.md#troubleshooted-error--404-not-found-unhandled-thrown-error)
- [Installed DynamoDB on Gitpod](https://github.com/krunalijain/aws-bootcamp-cruddur-2023/blob/main/journal/week1.md#2-installed-dynamodb-on-gitpod)
## Homework Required
## Attended Live Session 
This live session was a leveled up compared to Week-0. Here we got to know about the working of **Guest OS, Host OS and the Containers**. We also **created a Docker file** in this instructional live video. Also ran some of the **Python scripts**. Experienced the guidance from the Docker experts : ***James Spurin*** and ***Edith Puclla***. Installed the Docker Extension in Gtipod. And understood the working of code in Dockerfile. 

## Tasks Completed
## #1 Launched Gitpod and Implemented Notifications.
We built an image via Gitpod. **Launched the micro blogging app - Cruddur on a localhost**. For this we created `frontend-react-js` file and a `backend-flask` file which were connected. There was a `docker-compose.yml` file which included both frontend and backend file's links. We need to **compose up** to activate the ports that helped us to run the Cruddur app. The `port 4567` was for the backend and the `port 3000` was for the frontend.

Then, we set the notifications feature in this cruddur app. While setting this notification I faced few errors which later on I managed to troubleshoot and some of the bootcampers helped me to find and solve the error.


### Troubleshooted Error : 404 Not Found [Unhandled Thrown Error]
There was a problem when I ran the port 3000 for the frontend thing and I could see the error message **404 Not Found**.

![](https://user-images.githubusercontent.com/115455157/221342650-fb88fdd6-fa2d-4138-b513-ee2df087fdaa.jpg)

This error was a hectic task for me to solve as it consumed lot of time to solve and understand. Though it was a silly mistake that I did - there's a file under the `frontend-react-js` -> `app.js` in this file I had skipped one code block 
```js
  {
    path: "/",
    element: <HomeFeedPage />
  },
 ``` 
 So this was the thing I had skipped and it lead me to **404 Not ofund** error. After solving the frontend looked like this :
 
 ![](https://user-images.githubusercontent.com/115455157/221343242-939ba8a9-acfe-424f-b29b-be03d53a5ed8.jpg)
 
 ## #2 Installed DynamoDB on Gitpod
 Installed and ran DynamoDB via Gitpod and **created a table "Musics"**. 
 Here I bymistankely had created the "Music" table in another directory and then later realized that it's the wrong directory. So again tried creating the same table in different directory but tha didn't work.
 
 ### Troubleshooted Error : Table already exists
 So I had to change the name of the table because it didn;t allow me to create a same name table in different directory. So I changed **"Music" to "Musics"**, haha.
 then I was good to go. Created a new table and listed items and it was all good.
 
 ## #3 Installed Postgres
 We also installed and ran Postgres on Gitpod. But I faced some issue while running he Postgres installing script.
 ### Troubleshooted Error : Invalid Compose Project
 So the error stated "Invalid Compose Project" and something like undefined vloume db has been used, after researching from the stackoverflow I found the soulution. The problem was in the code where we had to define volume before `networks` section and not in the end. Here's  the code from the `docker-compose.yml` file
 ```yaml
 volumes:
  db:
    driver: local
```
 Then later on to work with Postgres you need to have a client library to interact with a server, for this we ran few lines of code :
 ```yaml
   - name: postgres
    init: |
      curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc|sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/postgresql.gpg
      echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" |sudo tee  /etc/apt/sources.list.d/pgdg.list
      sudo apt update
      sudo apt install -y postgresql-client-13 libpq-dev
 ```
 But after this the `psql` command didn't work so we had to mannually connect to Postgres Database and then we were good to go. We ran few of the Postgres commands to check whether it's working. Here's the reference picture :
 
 ![](https://user-images.githubusercontent.com/115455157/221344556-36ecbed2-4289-4c9a-b5e9-a148dbe9e45c.jpg)
 
  ### Troubleshooted Error : Gitpod error while commiting
  
  ![](https://user-images.githubusercontent.com/115455157/221345464-6880eeac-d5a8-4deb-be2d-735d71fd84f3.jpg)
  
  I got this error maybe because I siumltaneously made changes in the repositories from the gitpod as well as from the github. So to overcome this I had to merge the branches. Because I guess there were two branches created unknowingly. so I ran `git pull` command then it gave me some hints to solve my issue. I proceeded with `git config pull.rebase false` to merge the branches then I did `git pull` and `git push` and it showed **"Everything is up to date"**.
  
  ## #4 Watched Chriag's price consideration Video for this week1
  It was good and helped to know that this Gitpod charges you on an horuly basis per month. If your workspace is open more than 50 hours in a month it will charge you. As 50 hours/month is in the free-teir. To avoid unwanted use we can also **stop the gitod workspace** when not in use. **Attended the Pricing Quiz** which was damn easy as I already had watched Chirag's video that covered all of the conent. 
  
**Pricing Video link :** https://www.youtube.com/watch?v=OAMHu1NiYoI&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=24 
  
## #5 Watched Ashish's security consideration video 
In this I got to know about Snyk, Clair, AWS Secrete manager that helps in managing the security and detecting the vulnerabilities in are conatiner/code. 
Also helped me to solve the Security Quiz.

**Security Video Link :** https://www.youtube.com/watch?v=OjZz4D0B-cA&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=25

## Homework Challenges
Did **Health-Check for frontend**, **pushed iamges to Docker Repositories** and **Launched Cruddur via EC2**.

Here is my article link for EC2 and Docker images (A complete step-by-step process) : https://krunali.hashnode.dev/launch-ec2-instance-with-docker-installed

And here is the HealthCheck POW : https://www.linkedin.com/posts/krunalijain_docker-aws-awscommunity-activity-7036664671843622912-jRqf?utm_source=share&utm_medium=member_desktop
 

 






