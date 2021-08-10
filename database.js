const mysql = require('mysql');
const envVariables = require('./envVariables')
let dbConnection = {}

try{
    dbConnection = mysql.createConnection(envVariables.mysqlConnection);
}
catch(e) {
    console.log("Database Connection Error", e)
}

module.exports = dbConnection