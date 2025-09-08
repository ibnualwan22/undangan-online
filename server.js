const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const dbConfig = require('./config/database');

const app = express();

// === KONFIGURASI APLIKASI ===
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// BENAR: Gunakan mysql.createPool untuk membuat koneksi MySQL
const pool = mysql.createPool(dbConfig);


// === ROUTES (RUTE) ===
app.get('/', (req, res) => {
    res.redirect('/undangan');
});

app.get('/undangan', async (req, res) => {
    try {
        const guestName = req.query.to || "Tamu Undangan";
        const finalGuestName = guestName.replace(/\+/g, ' ');
        
        const sql = 'SELECT nama, pesan, konfirmasi, created_at FROM ucapan ORDER BY created_at DESC';
        const [rows] = await pool.query(sql);

        res.render('undangan', { 
            namaTamu: finalGuestName,
            daftarUcapan: rows 
        });
    } catch (error) {
        console.error("Gagal mengambil data ucapan:", error);
        res.status(500).send("Terjadi kesalahan pada server saat mengambil data.");
    }
});

app.post('/ucapan', async (req, res) => {
    const { nama, pesan, konfirmasi } = req.body;
    if (!nama || !pesan || !konfirmasi) {
        return res.status(400).send("Semua kolom harus diisi!");
    }

    try {
        // PERBAIKAN: Gunakan placeholder '?' untuk MySQL
        const sql = 'INSERT INTO ucapan (nama, pesan, konfirmasi) VALUES (?, ?, ?)';
        await pool.query(sql, [nama, pesan, konfirmasi]);
        
        res.redirect('/undangan?status=sukses');

    } catch (error) {
        console.error("Gagal menyimpan ucapan:", error);
        res.status(500).send("Terjadi kesalahan pada server saat menyimpan data.");
    }
});

// Ini "menyerahkan" aplikasi Express Anda ke Vercel untuk dijalankan
module.exports = app;