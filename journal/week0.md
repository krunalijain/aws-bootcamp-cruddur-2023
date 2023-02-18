# Week 0 — Billing and Architecture

## Synopsis 
This journal consists of the tasks completed in week-0 of AWS Free Bootcamp 2023 organized by Andrew Brown and his Team. In this week, we started with setting up the accounts (aws, gitpod, gihub) that are required before the start of ‘Cruddur Project’. 

## Pre-Requisites  
Before beginning with Week-0 we should have these following accounts : 
- Personal AWS account. 
- Gitpod account.  
- Lucid Charts account. 
- GitHub account. 

## Week-0 Live Session 
So, there was a Live Session conducted by the AWS Bootcamp organizer Andrew Brown with the guest lecturers – Shala Warner, Chris Williams and Margaret Veltierra. They are the experts of AWS cloud also known as Cloud Heroes. It was really an amazing Live session where all the lecturers were interacting with each other, was kind of ‘real-time feel’ session.  
***What did we Learn in this Live Session ?***
This was mainly focused on ***Billing and Architecture***
- We learnt how to understand the client’s requirements,  how to segregate tasks and gather the requirements for the project. 
- Different architectures – monolithic and microservice architecture. 
- Introduction to AWS console, Gitpod console, GitHub repositories.  
- Understanding about Conceptual, Logical and Physical Diagrams. 
- Got to knot about TOGAF Architecture.
- C4 models. 
- How to create diagrams in Lucid Charts. 
- Hands on example for Napkin Diagram. 

## Tasks Completed in Week-0
**1. Created IAM User, Role and MFA**

![](https://user-images.githubusercontent.com/115455157/219755386-d580ce7e-0c2a-4f67-bed6-4d1901565de4.jpg)

So, it is very easy to create a IAM User and set MFA (Multi Factor Authentication) to it. I followed the below given steps to create this :
- Login as a **root user** into AWS account.
- Search for **IAM service** and go to **Users**.
- **Create a new User** by giving the appropriate **(Admin)** permissions.
After that to set MFA you can go to particular **User -> Security Credentials -> Enable MFA**.
- Fill the required details and **Scan QR code** from the authentication app in your mobile. (Here you **need to install authentication application in your mobile** to connect it with your IAM User).
- **Enter two MFA Codes** when asked and your MFA is set.

***Creating IAM Role***
- From IAM click on **Roles -> Create role**.
- Choose **Entity Type** as per your project, I personally chose **AWS Services for EC2 Use case.**
- Added permission policy as **Security Audit**.
- Then give **role name** and **Tags** and click on **Create role**. 

**Error Faced after creating IAM user, role**
It does not gives you access to create billing from IAM User account.

**How to solve?** 
When it displays the error message in that only you can find how to to troubleshoot that error. In this case you have to allow permission for billing configuration access from your root account.
**Enable manage concole access** from security credentials of that IAM User.

**2.Installeed AWS CLI in Gtpod.**

![](https://user-images.githubusercontent.com/115455157/219768061-d7540fca-b311-410c-a98b-97b543f1183f.jpg)

By follwoing Andrews's **"Required homework"** video it became so easy specially for beginner level students to undersatnd and install and set AWS CLI on Gitpod. Here's that video : https://www.youtube.com/watch?v=OdUnNuKylHg&list=PLBfufR7vyJJ7k25byhRXJldB5AiwgNnWv&index=14 

There were some most used commands like ```aws configure``` : to set AWS credentials; ```aws sts get-caller-identity``` : for viewing the AWS Account Identity and so on...

**Problem faced while this AWS CLI Setup ?** 
As Gitpod doesn't saves everything unless you commit the code(I think) or save that permanently in Gitpod. So when I took break after installing and setting up my AWS CLI and all the account credentials and when got back to contiue I found there AWS CLI is not installed. 
**Solution** Either you have to re-install AWS CLI by following these commands : ```cd /workspace
      curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
      unzip awscliv2.zip
      sudo ./aws/install
      cd $THEIA_WORKSPACE_ROOT```
         OR you can Save it permanently into Gitpod.(steps shown in Andrew's video : the above mentioned link)
         
**3. Set Billing alarm and Budget via CLI**

Here we created a folder named ```aws/json``` in which ```budget.json``` is a json file that creates a budget via CLI and another one is ```budget-notifications-with-subscribers.json``` which helps to notify on email if we exceed the threshold that has been set previously. 

![](https://user-images.githubusercontent.com/115455157/219837333-de1a6320-6751-4fdd-86d2-f3af706d9eaf.jpg)

Then there's another file named ```alarm-config.json``` this file contains json code that sets billing alarm.

![](https://user-images.githubusercontent.com/115455157/219837975-8811ba20-0e2b-453e-a6eb-95096af494c5.jpg)

After creating these three files in ```aws/json``` folder commit them to your git repository.

**4. Re-created Cruddur Logical Diagram.**

This helped me to explore a bit of Lucid Charts.

![](https://user-images.githubusercontent.com/115455157/219839638-f585a8a8-3693-46d4-b798-7d3403aa9b4b.jpg)

This is just a snapshot for quick reference. I am also providing my Lucid Chart link for better 'proof of work' : 
https://lucid.app/lucidchart/6a899c2f-4373-4fa2-bf36-21b1b69faea4/edit?viewport_loc=-386%2C113%2C2400%2C1004%2C0_0&invitationId=inv_70fb3aef-1ef5-413c-a692-9f682cd01aeb

**5. Created a Napkin Design**

This is my Napkin Design depicting that the ***User(me)*** will upload my application/website in the ***cloud(AWS Cloud Shape)*** where it will pass the ***Authentication*** and segregate via ***Load Balancer*** as a ***frontend*** which is connected to ***AppSync*** and provide the interface for real-time AND as a ***backend*** which is connected to the ***DataBase*** for storing the information that is also connected with the Appsync. 
This is a rough diagram (that's how a Napkin design should be like) designed as per my knowledge. 

![](https://user-images.githubusercontent.com/115455157/219842138-453cfa13-4f65-4be6-bb00-d1464f8bee8b.jpeg)

**6. Attended Pricing and Security Quiz.**
It was very informaative watching **Chirag Nayyar's** pre-recorded video about the Pricing Considerations and **Ashish Rajan's** pre-recorded video about Security Considerations. Those videos really help me understand the basics related to Pricing and Security and to clear the Quiz. Below are the links added of their videos. 

**Chirag's Pricing Video :** https://youtu.be/OVw3RrlP-sI
**Ashish's Security Video :** https://youtu.be/4EMWBYVggQI









