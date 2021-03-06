const mysql = require('mysql');
const envVariables = require('./envVariables')
const winston = require('winston')

let dbConnection = {}

const logConfiguration = {
    transports: [
        new winston.transports.File({
            filename: 'logs/errors.log'
        })
    ]
};
const logger = winston.createLogger(logConfiguration);

try{
    dbConnection = mysql.createConnection(envVariables.mysqlConnection);
}
catch(e) {

    logger.error(err.message, err)
    console.log(`Error : ${err.message} --> `, err)
}

module.exports = dbConnection