# Company Review System

The project is aimed to create a company review system based on reviews given by the user about their employer.
This include some star based rating and some verbal reviews.

## Getting Started
For getting started , you need to install node.js and mysql server in your system.
Steps for installation in linux is given below.

### Prerequisites

## Install Node.js and NPM

```
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm

```
## install MySql
# Step1
```
sudo apt-get update
sudo apt-get install mysql-server
mysql_secure_installation

```
# Verify
```
systemctl status mysql.service

```
# output should be
```
● mysql.service - MySQL Community Server
   Loaded: loaded (/lib/systemd/system/mysql.service; enabled; vendor preset: en
   Active: active (running) since Wed 2016-11-23 21:21:25 UTC; 30min ago
 Main PID: 3754 (mysqld)
    Tasks: 28
   Memory: 142.3M
      CPU: 1.994s
   CGroup: /system.slice/mysql.service
           └─3754 /usr/sbin/mysqld

```


## setting up module
-> in the parent folder ,open the terminal and run   ``` npm install```  
   (make sure that package.json file is present in that folder)


-> create a database in mysql (name it company_review)


->in mysql_setup.js file in config folder ,change password and databse name to 
your mysql password and the database name you created respectively..

-> also in app.js file  from line 14-19 change the password and database as stated above.

-> in msql command line or in workbench (using the database you created)
run ``` source file_path/filename ```
(the file is database.sql in repo_local folder and file_path is the path of this file).
[ this will create the required table,procedure and triggers associated with the project .]

//..............................................................//
now, setup is complete...

in the terminal browse to repo_local folder and run | node app.js

now you can lookout for this project in[ localhost:3000/login ] in the browser.........


## Built With

* Node.js
* MySql


