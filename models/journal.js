const { DataTypes } = require("sequelize");
const db = require("../db")

const journal = db.define("journal", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    entry: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
    },
    owner: {
        type: DataTypes.INTEGER
    }
});

module.exports = journal;

//I changed the "Journal" to "journal" due to a mistake. Mental Note: The module.exports should be exactly like the value const in the top