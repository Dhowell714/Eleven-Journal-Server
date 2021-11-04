const { UniqueConstraintError } = require("sequelize/lib/errors");
const router = require("express").Router(); //We have combined two lines of code. We import the Express framework and access the Router()  method, assigning it to a variable called router. Recall that we are setting this variable as a const because we don't want to be able to change the value of this variable. In our journalcontroller.js, we can see this same code split up over two lines, separating the import of the framework and the access of the method.
//const { UniqueConstraintError } = require("sequelize/types");
const { UserModel } = require("../models"); //We use object deconstructing to import the user model and store it in UserModel variable. It is convention to use Pascal casing (uppercase on both words) for a model class with Sequelize. You'll find this to be true in other programming languages as well.
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
router.post("/register", async (req, res) => {

    let { email, password } = req.body.user;
    try {
    const User = await UserModel.create({ //Line 8: We know our await holds the value of our promise data. In our case, the newly created user email and password sent to PGAdmin. We want the ability to readily call the data so it can be used or displayed (as you'll soon see in line 15), thus we assign it to a variable named .
        email,
        password: bcrypt.hashSync(password, 13),
    });

    let token = jwt.sign({id: User.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

    res.status(201).json({
        message: "User successfully registered", 
        user: User,
        sessionToken: token
        /*
        First, we create a variable called token. Once created, this will store the token.

Then, we call upon our jwt variable, which is referring to the jsonwebtoken dependency we installed earlier.
This dependency comes with a couple of methods. .sign() is the method we use to create the token. It takes at least 2 parameters: the payload and the signature. In addition, you can also supply some specific options or a callback.

Our first parameter is the payload or data we're sending. User.id is the primary key of the user table and is the number assigned to the user when created in the database. User refers to the variable we created on line 9 which captures the promise when we create a new user.

The second parameter is the signature, which is used to help encode and decode the token. You can make it anything you want, and we will make this private later. In our current code, our secret password is "i_am_secret".

Recall that we said you can add specific options or a callback to the token? In this case, we set an option to make the token expire. Here, we're taking (seconds * minutes * hours); in other words, 1 day. JavaScript is doing the actual math to get to this value.

We are expanding our response a bit more. We have added a key of sessionToken and pass it the value of the token. The server has now assigned a token to a specific user and the client, once we have one, will have that token to work with.
        */
    });
} catch (err) {
    if (err instanceof UniqueConstraintError) {
        res.status(409).json({
            message: "Email already in use",
        });
    } else {
    res.status(500).json({
        message: "Failed to register user",
    });
    }
    }
});
router.post("/login", async (req, res) => {
    let { email, password } = req.body.user;
    
    try {
    const loginUser = await UserModel.findOne({
        where: {
            email: email,
        },
    });
    if (loginUser) {

        let token = jwt.sign({id: loginUser.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
    res.status(200).json({
        user: loginUser,
        message: "User successfully logged in!",
        sessionToken: token
    });
} else {
    res.status(401).json({
        message: "Unauthorized. Login failed"
    });
}
    } catch (error) {
        res.status(500).json({
            message: "Failed to log user in"
        })
    }
});
/*
Line 4: We use the router object by using the router variable to get access into the Router() object methods.

post() is one of the methods in the object, and we call it here. This method allows us to complete an HTTP POST request. We pass two arguments into the .post method.
The first argument '/register' is the path. Similar to how we used the /test path to test out Postman previously.
The second argument is an asynchronous callback function. This is also sometimes called a “handler function”. This function gets called when the application receives a request to the specified route and HTTP method. The application “listens” for requests that match the specified route(s) and method(s), and when it detects a match, it calls the specified callback function. In our case, we wrote the syntax for this callback function to be an anonymous fat-arrow function that takes in both the request and response parameters.

Line 6: Here we are doing two (2) things:

We use the  variable we created on line 2 to access the model that we created a few lessons back (model folder > users.js). This will grant us access to the  model properties and to Sequelize methods.
is a Sequelize method that allows us to create an instance of the  model and send it off to the database, as long as the data types match the model.
Lines 7 and 8:

 We send the data we want our user to consist of in our create() method. Currently, our user data (user@email.com and password) is hardcoded. This is not a good practice since we want, at some point, for users to input THEIR email and password information.  On top of that, when we attempt to send more than one request, our code will throw us an error because our database will allow only ONE instance of a user to have this email address. We set this up in our UserModel model. Take a moment to identify the line of code that indicates this. * Pssst, it's the unique property that we set to true.
The left-hand side of this object has to match our user model, while the right-hand side is how our request has to look when we send it. 

Line 13: In our response, rather than res.send(), we will invoke two methods: .status() and .json() method.
.status() :

This allows us to add a status code to a response. This will be a helpful tool in the future when we start working with error handling.

In our case, we have successfully created an item. This is the perfect time to use a 201 status code (201: Created)

MDN has a great documentation (https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) describing the situations where specific status codes get used.
.json() :
This will, of course, package our response as json (JavaScript Object Notation (https://www.w3schools.com/whatis/whatis_json.asp)). 

You may find yourself asking: "What is the difference between res.send() and res.json()?"

There is not much different about the two methods. The two are practically identical. They can both pass objects and arrays. res.json even calls .send at the end of its action. The only difference is the fact that res.json() will convert non objects (such as null and undefined) into valid JSON while res.send() cannot.

Line 14: On top of a 201 status code, it is always best to add a message to our response with more information.

Line 15: The same data that that was added to the database and stored in the User variable (see line 8) is now being sent to the client and stored in a user property. user is the key, User is the value

Lines 6 and 16: The addition we have made here is to wrap our code in a try...catch (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) statement. Try...catch statements are a part of JavaScript that allows a section of code to be attempted.

Lines 16, 17, and 18:  Similar to a promise rejection, if the code fails, it will throw an exception which we can capture and use that to convey a message to the client via our response. This time, we want it to send a 500 status code and a message that says "Failed to register user". This will make it clear to the client that something failed.

Line 31: When users log in to their account, we need two (2) things from them. Their email and password. We use object deconstruction to pull the email and password from the request. 

Line 33: The findOne() method is a Sequelize method that does exactly what it says: it tries to find one element from the matching model within the database that we tell it to look for. This is called Data Retrieval. Check out the Sequelize docs here -> http://docs.sequelizejs.com/manual/tutorial/models-usage.html . In our case, we are looking at our UserModel. We use the await keyword in order to run this code asynchronous.

Line 34: We can filter what we want to locate from our database with a where clause. where is an object within Sequelize that tells the database to look for something matching its properties. 

Line 35: In our case, we want to find a user that has a property of email whose value matches the value we send through our request (user@email.com). We are looking in the email column in the user table for one thing that matches the value passed from the client. 

Line 33 and 44: We wrap our functionality in a try...catch statement. The try...catch statement allows our code to attempt to execute a block of code in the try portion. If that throws an exception and fails, it will run the code in the catch block.

Line 34: After waiting (await) for the data to come back, we store the retrieved data in a variable called loginUser. 

Line 40: If we are successful, we set the response status code to 200 and add an object to our response. A 200 status code is used to display success in general whereas a 201 status code indicates a success for an item creation. 

Line 41 and 42: We send the loginUser object as well as a message back to the client in the response.

Line 45 and 46: If an exception is thrown, a.k.a our code fails, the response is given the status code of 500 and we send a message back to the client indicating an error has taken place. 
*/

module.exports = router; //We export the module for usage outside of the file.