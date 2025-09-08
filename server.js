const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
const dbConfig = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// === KONFIGURASI APLIKASI ===
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware untuk membaca data dari form (penting!)
app.use(express.urlencoded({ extended: true }));


// === KONEKSI DATABASE ===
const pool = mysql.createPool(dbConfig);


// === ROUTES (RUTE) ===
app.get('/', (req, res) => {
    res.send('<h1>Selamat Datang di Server Undangan Online!</h1><p>Coba akses /undangan?to=NamaAnda</p>');
});

app.get('/undangan', async (req, res) => {
    try {
        // Ambil nama tamu dari query URL
        const guestName = req.query.to || "Tamu Undangan";
        const finalGuestName = guestName.replace(/\+/g, ' ');

        // Ambil semua data ucapan dari database
        const connection = await pool.getConnection();
        const sql = 'SELECT nama, pesan, konfirmasi, created_at FROM ucapan ORDER BY created_at DESC';
        const [rows] = await connection.query(sql);
        connection.release();

        // Render file 'undangan.ejs' dan kirimkan DUA data: namaTamu dan daftarUcapan
        res.render('undangan', { 
            namaTamu: finalGuestName,
            daftarUcapan: rows // Ini adalah array berisi semua ucapan
        });
    } catch (error) {
        console.error("Gagal mengambil data ucapan:", error);
        res.status(500).send("Terjadi kesalahan pada server.");
    }
});

// Rute BARU untuk menangani data form (method POST)
app.post('/ucapan', async (req, res) => {
    // Ambil data dari body request yang dikirim form
    const { nama, pesan, konfirmasi } = req.body;

    // Validasi sederhana
    if (!nama || !pesan || !konfirmasi) {
        return res.status(400).send("Semua kolom harus diisi!");
    }

    try {
        const connection = await pool.getConnection();
        const sql = 'INSERT INTO ucapan (nama, pesan, konfirmasi) VALUES (?, ?, ?)';
        
        // Eksekusi query dengan data yang aman (mencegah SQL Injection)
        await connection.query(sql, [nama, pesan, konfirmasi]);
        
        connection.release();
        
        // Setelah berhasil, redirect kembali ke halaman undangan
        // Anda bisa menambahkan parameter untuk menampilkan pesan sukses
        res.redirect('/undangan?status=sukses');

    } catch (error) {
        console.error("Gagal menyimpan ucapan:", error);
        res.status(500).send("Terjadi kesalahan pada server.");
    }
});


// === MENJALANKAN SERVER ===
async function startServer() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Koneksi ke database MySQL berhasil!');
        connection.release();
        
        app.listen(PORT, () => {
            console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Gagal terkoneksi ke database MySQL:', error.message);
        process.exit(1);
    }
}

startServer();