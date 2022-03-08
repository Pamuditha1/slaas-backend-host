module.exports = {
  jewtKey: process.env.JWT_KEY,
  mysqlConnection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    multipleStatements: true,
  },
  emailAuth: {
    auth: {
      api_key: process.env.MAILGUN_API,
      domain: process.env.MAILGUN_DOMAIN,
    },
  },
};
