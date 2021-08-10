module.exports = {
    jewtKey : process.env.JWT_KEY,
    // mysqlConnection: {
    //     host     : 'localhost',
    //     user     : 'root',
    //     password : '0112704105',
    //     database : 'slaasproject',
    //     multipleStatements: true
    // },
    mysqlConnection: {
        host     : process.env.MYSQL_HOST,
        user     : process.env.MYSQL_USER,
        password : process.env.MYSQL_PASSWORD,
        database : process.env.MYSQL_DATABASE,
        port: process.env.PORT || 3306,
        multipleStatements: true
    },
    emailAuth: {
        auth : {
            api_key: process.env.MAILGUN_API,
            domain: process.env.DOMAIN
        }
    }
} 