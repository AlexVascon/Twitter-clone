
# Twitter clone

Just finished Ironhack bootcamp. I'm building a full stack social media app to practise and improve my knowledge in web technologies by attempting to mimick twitter.




## Tech Stack

**Client:** React

**Server:** Node, Express, MongoDB



  
## Installation

Install twitter clone with npm in the client and server package.

```bash
cd twitter-clone/server
  npm install 
cd twitter-clone/client
  npm install 
```
    
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file
in both client and server. My plan is to eventually deploy the app to show off functionality. If you decide to fork and run the project you need an email account for nodemailer and a cloudinary account for image uploads. Set those details in the fields below.

client .env
```javascript
REACT_APP_API_URL=
```
server .env
```javascript
PORT=
ORIGIN=
DB_NAME=
MONGODB_URI=
CLOUDINARY_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=
TOKEN_SECRET=
EMAIL_USER=
EMAIL_PASS=
SITE_URL=
```

  
## Running Tests

To run tests, run the following command

```bash
  npm run test
```

  
## Lessons Learned

Learning mongodb documentation to improve performance and decrease load time.
Seperating calls and data extraction to only when needed.

This is an ongoing process.

  
## Acknowledgements

dummy profile and cover images in screenshot are from [Vecteezy](https://www.vecteezy.com/) 

 - [Images creator ](https://www.vecteezy.com/vector-art/2309788-people-avatar-collection-set)
 - [Background 1](https://www.vecteezy.com/vector-art/260881-abstract-background)
 - [Backgroun2 2](https://www.vecteezy.com/vector-art/262029-abstract-background)
 - [background 3](https://www.vecteezy.com/vector-art/2412259-flat-abstract-blue-background)


  
## Usage

 - Signup - with a valid email and password containing uppercase, number, and special character. An email will be sent with a verification code for the next step.  
 - Login - two step process, first email, then password. Redirect to profile on succesful Login.
 - Logout - follow arrow to feed, press avatar and menu will display logout

 I dont use twitter so I made an account and based navigation on mobile experience. Still working to add all features.


  
## Screenshots

![App Screenshot](https://res.cloudinary.com/dfnkggguq/image/upload/v1634662048/twitter-clone/Screenshot_2021-10-19_at_15.43.48_yzn2y5.png)
![App Screenshot](https://res.cloudinary.com/dfnkggguq/image/upload/v1634662260/twitter-clone/Screenshot_2021-10-19_at_18.48.47_wqdt41.png)
![App Screenshot](https://res.cloudinary.com/dfnkggguq/image/upload/v1634662272/twitter-clone/Screenshot_2021-10-19_at_18.50.09_r5kkmq.png)
![App Screenshot](https://res.cloudinary.com/dfnkggguq/image/upload/v1634662292/twitter-clone/Screenshot_2021-10-19_at_18.50.23_as0pnw.png)
![App Screenshot](https://res.cloudinary.com/dfnkggguq/image/upload/v1634662302/twitter-clone/Screenshot_2021-10-19_at_18.50.38_ybfptw.png)

  