require('dotenv').config()
module.exports = {
    secret: process.env.JWT_SECRET,
    database: {
        host: "db_mysql",
        user: "root",
        password: "root",
        database: "db_teste"
    }
};