require('dotenv').config();

const config = {
  development: { // Untuk lokal
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  production: { // Untuk Vercel
    host: process.env.PROD_DB_HOST,
    user: process.env.PROD_DB_USER,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    ssl: { "rejectUnauthorized": true } // PlanetScale memerlukan SSL
  }
};

const env = process.env.NODE_ENV || 'development';
module.exports = config[env];