require('dotenv').config();

const config = {
  development: { // Untuk lokal
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
  },
  production: { // Untuk Vercel
    host: process.env.PROD_DB_HOST,
    user: process.env.PROD_DB_USER,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    port: process.env.PROD_DB_PORT,
    ssl: { "rejectUnauthorized": true } // Beberapa provider cloud memerlukan ini
  }
};

const env = process.env.NODE_ENV || 'development';
module.exports = config[env];