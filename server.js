const express = require('express');
const path = require('path');
// BENAR: Gunakan require untuk mysql2 seperti ini
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
    // Arahkan halaman utama langsung ke undangan untuk pengalaman yang lebih baik
    res.redirect('/undangan');
});

app.get('/undangan', async (req, res) => {
    try {
        const guestName = req.query.to || "Tamu Undangan";
        const finalGuestName = guestName.replace(/\+/g, ' ');
        
        // Sesuaikan query dengan database Anda (contoh ini untuk PostgreSQL)
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
        // Sesuaikan placeholder dengan database Anda ($1 untuk PG, ? untuk MySQL)
        const sql = 'INSERT INTO ucapan (nama, pesan, konfirmasi) VALUES ($1, $2, $3)';
        await pool.query(sql, [nama, pesan, konfirmasi]);
        
        // Redirect kembali ke halaman undangan dengan nama tamu yang sama
        const guest = req.query.to ? `?to=${encodeURIComponent(req.query.to)}` : '';
        res.redirect(`/undangan${guest}&status=sukses`);

    } catch (error) {
        console.error("Gagal menyimpan ucapan:", error);
        res.status(500).send("Terjadi kesalahan pada server saat menyimpan data.");
    }
});


// === HAPUS SEMUA BAGIAN "MENJALANKAN SERVER" (app.listen) ===
// Blok kode startServer() atau pool.connect().then(...) dihapus dari sini.


// === TAMBAHKAN BARIS INI DI PALING BAWAH ===
// Ini "menyerahkan" aplikasi Express Anda ke Vercel untuk dijalankan
module.exports = app;