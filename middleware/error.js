const winston = require('winston')

const logConfiguration = {
    transports: [
        new winston.transports.File({
            filename: 'logs/errors.log'
        })
    ]
};
const logger = winston.createLogger(logConfiguration);

module.exports = (err, req, res, next) => {
    logger.error(err.message, err)
    console.log(`Error : ${err.message} --> `, err)
    res.status(500).send('Server Error')
}