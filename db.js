const Sequelize = require('sequelize'); //Import the sequelize package and create an instance of sequelize for use in the module with the "Sequelize" variable.

const sequelize = new Sequelize("postgres://postgres:16e178946be14ab9abd46a256ad6b0ce@localhost:5432/eleven-journal"); //Use the constructor to create a new sequelize object. The constructor takes in a string which holds all of the pertinet data required to connect to a database, also known as a URI connection.
/*
Anaylize string:
    'postgress://user:pass@example.com:5432/dbname'

    postgress = Identifies the database table to connect to. In our case, we are connecting to a postgres database

user = The username in order to connect to the database. In our case, this username is postgres.

password = The password used for the local database. This is the password you used when you set up pgAdmin earlier and should be unique.

example.com:5432 = The host points to the local port for Sequelize. This is 5432.

dbname = The name we choose in order to identify a specific database.
*/
module.exports = sequelize; //We export the module here.