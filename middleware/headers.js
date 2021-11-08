module.exports = function(req, res, next) {
    res.header('access-control-allow-origin', '*');
    res.header('access-control-allow-methods', 'GET, POST, PUT, DELETE');
    res.header('access-control-allow-headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    next();
};

/*
module.exports allows us to export this module to be used in another file.
req refers to the request from the client, specifically focusing on any headers present on the request object. res refers to the response and will be used to present which types of headers are allowed by the server. next will be covered more in a moment.
We call res.header so that the server will respond with what kind of headers are allowed in the request.
We use the specific access-control-allow-origin header to tell the server the specific origin locations that are allowed to communicate with the server. The *  is known as a wild-card. It means that everything is allowed. In this setting, it's saying that requests originating from any location are allowed to communicate with the database.
These are the HTTP methods that the server will allow being used. Postman allows you to send 15 different HTTP requests; our server will only accept these four.
These are specific header types that the server will accept from the client. Remember from our earlier testing we sent a Content-Type header to the server. Without this header, our request would not have worked. You can find more information on this and other headers on MDN, and we will talk about them more in the future as well.
next sends the request along to its next destination. This could be the API endpoint or another middleware function designed to do something else. Let's talk a little bit more about next.

next() tells the middleware to continue its process. With the above example, next() takes the request object and passes it on the endpoint on the server. Not including the next() would cause the application to break, as the server doesn't know what to do after sending the header. We could also use next() to provide additional headers if we want further restrictions on our server.
*/