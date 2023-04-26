require('dotenv').config()
module.exports = {
    secret: process.env.JWT_SECRET,
    database: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    }
};