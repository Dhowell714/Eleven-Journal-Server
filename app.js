require("dotenv").config();
const Express = require("express"); //Line one: requiring the use of the "express" npm package installed in dependencies
const app = Express(); //Create an instance of "express". This is actually firing off top level "Express()" function, which was exported by the Express module. This allows the ability to create an Express app.
const dbConnection = require("./db"); //creates a db variable that imports the db file
const controllers = require("./controllers");//We import the controllers as a bundle through the object that we just exported in the index.js and store it in a variable called controllers. 
app.use(require('./middleware/headers'));
app.use(Express.json());

app.use("/journal", controllers.journalController);
app.use("/user", controllers.userController); //We call upon the use() method from the Express framework and create a route to access any future functions in our usercontroller.js. The string, '/user', is setting up the endpoint our URL will need to include to access a controller. We use dot notation to step into the bundle of controllers we imported on line 5 to grab the value from the userController key in the controllers/index.js file.
//app.use(require("./middleware/validate-jwt"));
/*
Line 12: We imported the validateJWT middleware, which will check to see if the incoming request has a token. Anything beneath the validateJWT will require a token to access, thus becoming protected. Anything above it will not require a token, remaining unprotected. Therefore, the user routes is not protected, while the journal route is protected.

With this set-up, the userController route is exposed while the journalController route is protected.

This option is best when you have a controller or multiple controllers where all of the routes need to be restricted. 

But if we look back at out functionality checklist, we notice that there are a few routes in the journalcontroller we will want exposed to all users. So this isn't the right option for us.
*/

dbConnection.authenticate() // We use the db variable to access the sequelize instance and its methods from the db file and it calls upon the authenticate() method. This is an asynchronous method that runs a "SELECT 1+1 AS result" query. This method returns a promise
    .then(() => dbConnection.sync()) // We use a promise resolver to access the returned promise and call upon the sync() method. This method will ensure that we sync all defined models to the database. 
    .then(() => { //We use a promise resolver to access the returned promise from the sync() method and fire off the function that shows if we are connected.
        app.listen(3001, () => {
            console.log(`[Server]: App is listening on 3001.`);
        });
    })
    .catch((err) => { //We use a promise rejection that fires off an error if there are any errors.
        console.log(`[Server]: Server crashed. Error = ${err}`);
    });

//app.listen(3000, () => { //app.listen will use express to start a UNIX socket and listen for connections on the given path. The parameter (3000) indicates that the path will be "localhost:3000".
//    console.log(`[Server]: App is listening on 3000.`); //This callback function allows us to see what port the server is running on.
//});
/*
Analysis
Line 7:

Express has functionality built into it, that allows it to be able to process requests that come into our server. And in order to use the req.body middleware, we need to use a middleware function called express.json().  Express needs to JSON-ify  the request to be able to parse and interpret the body of data being sent through the request.
This app.use statement MUST go above any routes. Any routes above this statement will not be able to use the express.json() function, so they will break.
Here's a recommended article to get a starter understanding of how express.json() is working with req.body. Warning: this will lead you down a rabbit hole of understanding.
https://expressjs.com/en/api.html#express.json
For our purposes, it's important to know this:

tells the application that we want  to be used as we process this request.
*/