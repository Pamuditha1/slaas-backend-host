const mysql = require('mysql');

const dbConnection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '0112704105',
    database : 'slaasproject',
    multipleStatements: true
});

module.exports = dbConnection