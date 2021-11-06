const Express = require("express"); //We import the express framework and store it in the variable "Express". This instance becomes our gateway to using Express methods.
const router = Express.Router(); //We create a new bill called router. Since the Express variable gives us access into the express framework, we can access express properties and methods by calling express.methodName(). Therefore, when we call the "Express.Router()", we use the "Express" variable to access the "Router()" method. "Router()" method will return a router object. More info here -> https://expressjs.com/en/4x/api.html#router
let validateJWT = require("../middleware/validate-jwt");
const { JournalModel } = require("../models");
// Line 3: We imported the validate-jwt middleware and assign it to a variable called validateJWT.
router.get('/practice', validateJWT, (req, res) => { //We use router object by using the router variable to get access into the "Router()" object methods. "get()" is one method in the object, and it is called here. This method allows us to complete an HTTP GET request. 2 arguments are passed into the ".get" method. The first argument, '/practice', is the path. Similar to how we used the '/test' path to test out Postman previously. The second argument is an anonymous callback function. This is also sometimes called a "handler function". This function will be called when the app recieves a request to the specified route and HTTP method. The app "listens" for requests that match the specified route(s) and method(s), and when it detects a match, it calls the specified callback function.
    res.send('Hey!! This is a practice route!') //Inside our callback function, we call "res.send()". "send()" is an express method that can be called on the "res" or response object. Our response parameter is just a simple string.
});

/*
=====================
    Journal Create
=====================
*/
router.post("/create", validateJWT, async (req, res) => {
    const { title, date, entry } = req.body.journal;
    const { id } = req.user;
    const journalEntry = {
        title,
        date,
        entry,
        owner: id
    }
    try {
        const newJournal = await JournalModel.create(journalEntry);
        res.status(200).json(newJournal);
    } catch (err) {
        res.status(500).json({ error: err });
    }
    //JournalModel.create(journalEntry)

}),

/*
==========================
    Get all Journals
==========================
*/
router.get("/", async (req, res) => {
    try {
        const entries = await JournalModel.findAll();
        res.status(200).json(entries);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});
/*
===========================
    Get Journals by User
===========================
*/
router.get("/mine", validateJWT, async (req, res) => {
    const { id } = req.user;
    try {
        const userJournals = await JournalModel.findAll({
            where: {
                owner: id
            }
        });
        res.status(200).json(userJournals);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

/*
==========================
    Get Journals by Title
==========================
*/
router.get("/:title", async (req, res) => {
    const { title } = req.params;
    try {
        const results = await JournalModel.findAll({
            where: { title: title }
        });
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});
/*
=======================
    Update a Journal
=======================
*/
router.put("/update/:entryId", validateJWT, async (req, res) => {
    const { title, date, entry } = req.body.journal;
    const journalId = req.params.entryId;
    const userId = req.user.id;

    const query = {
        where: {
            id: journalId,
            owner: userId
        }
    };

    const updatedJournal = {
        title: title,
        date: date,
        entry: entry
    };

    try {
        const update = await JournalModel.update(updatedJournal, query);
        res.status(200).json({update});
    } catch (err) {
        res.status(500).json({ error: err });
    }
});
/*
========================
    Delete a Journal
========================    
*/
router.delete("/delete/:id", validateJWT, async (req, res) => {
    const ownerId = req.user.id;
    const journalId = req.params.id;

    try {
        const query = {
            where: {
                id: journalId,
                owner: ownerId
            }
        };

        await JournalModel.destroy(query);
        res.status(200).json({ message: "Journal Entry Removed" });
    } catch {
        res.status(500).json({ error: err });
    }
});

router.get('/about', (req, res) => {
    res.send('This is the about route!')
});

module.exports = router;
//Line 5: We inject the validateJWT variable as a middleware function in the '/practice' route in the journalcontroller. It will check to see if the incoming request has a token for this specific route. 