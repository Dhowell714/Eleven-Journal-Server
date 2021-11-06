const jwt = require("jsonwebtoken"); //Line 1: We are going to be interacting with the token assigned to each session (whenever a user logs in or signs up). This means that we need to import the JWT package, just as we did in our usercontroller. 
const { UserModel } = require("../models"); //Line 2: We also want to find out more information about a specific user. We need to communicate with our user model in our database. 

const validateJWT = async (req, res, next) => { //Line 4: An asynchronous fat arrow function called validateJWT is declared. This function takes in three (3) parameters: req, res, and next.
    if (req.method == "OPTIONS") { //Line 5: The function starts with a conditional statement checking the method of the request. Sometimes, the request comes in as an OPTIONS rather than the POST, GET, PUT, or DELETE. OPTIONS is the first part of the preflighted request. This is determine if the actual request is safe to send. 
        next(); //Line 6: If we do have a preflight request, we pass it the third parameter declared in the asynchronous function. This asynchronous function is a middleware function and it is a part of express. Req, res, and next are parameters that can only be accessed by express middleware functions. next() is a nested middleware function that, when called, passes control to the next middleware function.
    } else if ( //Line 7, 8, and 9: If we are dealing with a POST, GET, PUT, or DELETE request, we want to see if there is any data in authorization header of the incoming request AND if that string includes the word Bearer.
        req.headers.authorization &&
        req.headers.authorization.includes("Bearer")
    ) {
        const { authorization } = req.headers; //Line 11: Next, we use object deconstruction to pull the value of the authorization header and store it in a variable called authorization. We'll learn how to insert our token in our request in a later module.
        //console.log("authorization -->", authorization);
        const payload = authorization // Line 12 through 19: Let's start with a simple explanation and then dive into each piece a bit more. 
        /*
        Line 12, 13, and 19:

        This is a ternary. This ternary verifies the token if authorization contains a truthy value. If it does not contain a truthy value, this ternary returns a value of undefined which is then stored in a variable called payload.

        Line 13, 14, 15, 16, and 17:

If the token contains a truthy value, it does the following:

We call upon the JWT package and invoke the verify method. Let's take a look at this method.

jwt.verify(token, secretOrPublicKey, [options, callback])

The verify method decodes the token.

This method's first parameter is our token. This is the same variable we declared on line 11.

The second parameter is the JWT_SECRET we created in our .env file so the method can decrypt the token.

 

On lines 14, 15, and 16, we are using another ternary to do some more checking.

If we have token that includes the word "Bearer", we extrapolate and return just the token from the whole string ( authorization.split(" ")[1] ).

If the word "Bearer" was not included in the authorization header, then return just the token. 

Long story short, dependent on the token and the conditional statement, the value of payload will either be the token excluding the word "Bearer" OR undefined.

Line 21: Here is another conditional statement that check if for a truthy value in payload.

Line 22: If payload comes back as a truthy value, we use Sequelize's findOne method to look for a user in our UserModel where the ID of the user in database matches the ID stored in the token. It then stores the value of the located user in a variable called foundUser.

Line 24: Another nested conditional statement! This one checks if the value of foundUser is truthy.

Line 25: This is incredibly important so please read this several times.

If we managed to find a user in the database that matches the information from the token, we create a new property called user to express's request object.

The value of this new property is the information stored in foundUser. Recall that this includes the email and password of the user.

This is crucial because we will now have access to this information when this big middleware function gets invoked. We will see this in action in the next few modules.

Line 26: Since we are creating a middleware function, we have access to that third parameter we established earlier: next(). As said earlier, the next function simply exits us out of this function. Click here to learn more about using Router-level middleware with Express. -> https://expressjs.com/en/guide/using-middleware.html#middleware.router

Lines 27, 28, and 29: If our code was unable to locate a user in the database, it will return a response with a 400 status code and a message that says "Not Authorized".

 

Lines 30, 31, and 32: If payload came back as undefined, we return a response with a 401 status code and a message that says "Invalid token".

 

Lines 33, 34, and 35: If the authorization object in the headers object of the request is empty or does not include the word "Bearer", it will return a response with a 403 status code and a message that says "Forbidden".

*/
        ? jwt.verify(
            authorization.includes("Bearer")
            ? authorization.split(" ")[1]
            : authorization,
            process.env.JWT_SECRET
        )
        : undefined;

        console.log("payload -->", payload);
        if (payload) {
            let foundUser = await UserModel.findOne({ where: { id: payload.id } });
            //console.log("foundUser -->", foundUser);

            if (foundUser) {
                //console.log("request -->", req);
                req.user = foundUser;
                next();
            } else {
                res.status(400).send({ message: "Not Authorized" });
            }
        } else {
            res.status(401).send({ message: "Invalid token" });
        }
        } else {
        res.status(403).send({ message: "Forbidden" });
    }
};

module.exports = validateJWT;