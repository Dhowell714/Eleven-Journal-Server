const Express = require("express"); //We import the express framework and store it in the variable "Express". This instance becomes our gateway to using Express methods.
const router = Express.Router(); //We create a new bill called router. Since the Express variable gives us access into the express framework, we can access express properties and methods by calling express.methodName(). Therefore, when we call the "Express.Router()", we use the "Express" variable to access the "Router()" method. "Router()" method will return a router object. More info here -> https://expressjs.com/en/4x/api.html#router

router.get('/practice', (req, res) => { //We use router object by using the router variable to get access into the "Router()" object methods. "get()" is one method in the object, and it is called here. This method allows us to complete an HTTP GET request. 2 arguments are passed into the ".get" method. The first argument, '/practice', is the path. Similar to how we used the '/test' path to test out Postman previously. The second argument is an anonymous callback function. This is also sometimes called a "handler function". This function will be called when the app recieves a request to the specified route and HTTP method. The app "listens" for requests that match the specified route(s) and method(s), and when it detects a match, it calls the specified callback function.
    res.send('Hey!! This is a practice route!') //Inside our callback function, we call "res.send()". "send()" is an express method that can be called on the "res" or response object. Our response parameter is just a simple string.
});
router.get('/about', (req, res) => {
    res.send('This is the about route!')
});

module.exports = router;//We export the module for usage outside of the file.