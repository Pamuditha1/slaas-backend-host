const mysql = require('mysql');
const envVariables = require('./envVariables')

const dbConnection = mysql.createConnection(envVariables.mysqlConnection);

module.exports = dbConnection