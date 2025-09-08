// Menggunakan dotenv untuk memuat variabel dari file .env
require('dotenv').config();

// Objek konfigurasi untuk lingkungan yang berbeda
const config = {
  development: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  production: {
    // Variabel untuk produksi akan diambil dari environment variables di server hosting
    host: process.env.PROD_DB_HOST,
    user: process.env.PROD_DB_USER,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME
  }
};

// Menentukan environment mana yang sedang berjalan, defaultnya adalah 'development'
const env = process.env.NODE_ENV || 'development';

// Ekspor konfigurasi yang sesuai dengan environment saat ini
module.exports = config[env];