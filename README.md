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

## install dependencies
```
sudo npm install --save
```
## Run the server

```
npm start

```

## Built With

* Node.js
* MySql


