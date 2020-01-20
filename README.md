# SHOPS IN REGION

Shops in Region is a web applictation which helps users discover shops with respect distance from the application user.

## Application Features
* -Create new user and add him to ShopsInRegion database on MongoDB Atlas
* -It encryptes the inputed password with bcrypte in order to keep the information secure
* -Sign into created account with an email and password
* -Once authenticated, the application sorts and then displays shops from the nearest to furthest from the user
* -A user can dislike a shop and it will disappear for 10 seconds. To See the shop again, 'Nearby Shops' in the nav bar should be clicked. This is temperal but it is also temporarily updated in the database.
* -A user can like a shop and it will disappear from the 'Nearby Shops' list and appear in the 'Preffered Shops' list which is also sorted.
* -And ofcourse, a user can logout once finished.

## Getting Started
Download and install Node JS from nodejs.org. You will also need a text editor like Visual Studio Code. If you have these things, proceed with cloning the repository.
### Prerequisites
Upon cloning the repository and installing nodejs, execute this command in the folder's root to install the node packages
```
npm install --save
```
To run the server on port 5000 execute this command. Please note that if port 5000 is already in use, go to the .env file in the application and shange the PORT number
```
npm run dev
```
Finally go to this url to run your application in the browser
```
localhost:5000/
```
## Built With

* [Node JS](http://www.nodejs.org) - Node JS as the runtime environment for javascript
* [Express JS](https://expressjs.com) - Express framework to to tame the power of node js
* [Handlebars JS](https://handlebarsjs.com) - Used as the front end, handlebars engine to generate html
* [Mongo DB Atlas](https://https://cloud.mongodb.com) - Free service used as an online server for our Mongo db database
* [ip api](http://www.ipapi.co) - Was used to get the user's IP geographical location

The application is styled in CSS and Bootstrap

## Conclusion
The application should work perfectly as long as you have an internet connection. Improvements can always be made, the following are a list of features not yet added to the application
* Passport for authentication
* Express sessions to handle sessions
* Finally, user options like delete account or change password

