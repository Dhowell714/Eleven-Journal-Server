module.exports = { //We are exporting this file as a module. Specifically everything as an object
    userController: require('./usercontroller'),
    journalController: require("./journalcontroller"), //We define a property called "journalController". The value of this property is the import of the journalcontroller file.
};