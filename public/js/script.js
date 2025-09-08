document.addEventListener('DOMContentLoaded', function() {

    // === ELEMEN-ELEMEN PENTING ===
    const coverPage = document.getElementById('cover-page');
    const mainContent = document.getElementById('main-content');
    const openButton = document.getElementById('open-invitation');
    const music = document.getElementById('background-music');
    const musicControl = document.getElementById('music-control');
    const musicIcon = document.getElementById('music-icon');

    // Icon source
    const playIcon = "https://img.icons8.com/material-rounded/24/ffffff/play-button-circled--v1.png";
    const pauseIcon = "https://img.icons8.com/material-rounded/24/ffffff/pause-button.png";

    // === LOGIKA UNTUK COVER PAGE & MEMULAI MUSIK ===
    if (openButton) {
        openButton.addEventListener('click', function() {
            // Animasi fade-out cover
            coverPage.classList.add('fade-out');
            mainContent.classList.add('visible');
            setTimeout(() => {
                coverPage.style.display = 'none';
            }, 1000);

            // Gulir ke konten utama
            mainContent.scrollIntoView({ behavior: 'smooth' });

            // *** MULAI MUSIK ***
            music.play().catch(error => {
                console.log("Browser mencegah autoplay, butuh interaksi user.");
            });
            
            // Tampilkan tombol kontrol musik & set ikon ke pause
            musicControl.style.display = 'flex';
            musicIcon.src = pauseIcon;
        });
    }

    // === LOGIKA UNTUK TOMBOL PLAY/PAUSE MUSIK ===
    if (musicControl) {
        musicControl.addEventListener('click', function() {
            if (music.paused) {
                music.play();
                musicIcon.src = pauseIcon;
            } else {
                music.pause();
                musicIcon.src = playIcon;
            }
        });
    }



    // === LOGIKA COUNTDOWN TIMER ===
    // Atur tanggal dan waktu acara Anda di sini
    // Format: YYYY-MM-DDTHH:MM:SS (Tahun-Bulan-Tanggal T Jam:Menit:Detik)
    const eventDate = new Date("2025-09-14T19:50:00").getTime();

    // Memperbarui timer setiap 1 detik
    const countdownFunction = setInterval(function() {
        const now = new Date().getTime();
        const distance = eventDate - now;

        // Jika waktu acara sudah lewat
        if (distance < 0) {
            clearInterval(countdownFunction);
            document.getElementById("countdown").innerHTML = "<h3>Acara Telah Berlangsung</h3>";
            return; // Hentikan eksekusi fungsi
        }

        // Perhitungan waktu
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Menambahkan '0' di depan jika angka < 10 agar selalu 2 digit
        const format = (num) => (num < 10 ? '0' + num : num);

        // Tampilkan hasilnya di elemen HTML
        document.getElementById("days").innerText = format(days);
        document.getElementById("hours").innerText = format(hours);
        document.getElementById("minutes").innerText = format(minutes);
        document.getElementById("seconds").innerText = format(seconds);

    }, 1000); // Interval 1 detik

});