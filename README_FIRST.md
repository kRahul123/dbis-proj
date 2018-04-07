# THIS IS DBMS PROJECT 
# TOPIC - COMPANY REVIEW SYSTEM

this project is done using node js


to run ..... install node js in your system

# installing node--

->linux user

 sudo apt-get install nodejs
 sudo apt-get install npm 

->windows user
download and install from https://nodejs.org/en/download/

# setting up module
-> in the parent folder ,open the terminal and run | npm install;  (make sure that package.json file is present in that folder)


-> create a database in mysql (name it company_review)


->in mysql_setup.js file in config folder ,change password and databse name to 
your mysql password and the database name you created respectively..

-> also in app.js file  from line 14-19 change the password and database as stated above.

-> in msql command line or in workbench (using the database you created)
run | source file_path/filename;
(the file is database.sql in repo_local folder and file_path is the path of this file).
[ this will create the required table,procedure and triggers associated with the project .]

//..............................................................//
now, setup is complete...

in the terminal browse to repo_local folder and run | node app.js

now you can lookout for this project in[ localhost:3000/login ] in the browser.........





