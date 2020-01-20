#SHOPS IN REGION

Shops in Region is a web applictation which helps users discover shops with respect to their location. 
Once and account is created and the user logs into their account, the application serves them shops in 
order of nearest to furthest from their actual location. A user can also like shops or remove liked shops 
from the preffered shops list. Furthermore, a user can dislike shops and they will disappear from all 
lists for a short while. This change is also affected in the database which is Mongo DB Atlas hence the 
changes are not just applied in memory. The backend is all Node JS and Handlebars JS handles the front, 
styled in CSS and bootstrap

## Getting Started
Download and install Node JS from nodejs.org. Secondly use 'npm install --save' in your termminal to 
install the required packages in the project environment.

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
