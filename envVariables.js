module.exports = {
    jewtKey : process.env.JWT_KEY || 'jwtlock',
    mysqlConnection: {
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'slaasproject',
        multipleStatements: true
    },
    // mysqlConnection: {
    //     host     : process.env.MYSQL_HOST || 'slaasdatabase.mysql.database.azure.com',
    //     user     : process.env.MYSQL_USER || 'adminpamu@slaasdatabase',
    //     password : process.env.MYSQL_PASSWORD || '0112704105Abc',
    //     database : process.env.MYSQL_DATABASE || 'slaasproject',
    //     port: process.env.PORT || 3306,
    //     multipleStatements: true
    // },
    emailAuth: {
        auth : {
            api_key: process.env.MAILGUN_API || 'a4bf6801fbec21b312f56810185006cd-24e2ac64-a714b04c',
            domain: process.env.DOMAIN ||'sandbox04ae4b1772c44e9dacd8e117ec1c3ace.mailgun.org'
        }
    }
} 
