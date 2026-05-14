# 🌱 Gisikdrono Space - Modern Artisanal Gallery

Gisikdrono Space adalah platform marketplace berbasis web yang dirancang khusus untuk masyarakat **Kelurahan Gisikdrono, Semarang Barat**. Website ini berfungsi sebagai galeri digital eksklusif untuk memamerkan dan menjual hasil kreasi warga, mulai dari kerajinan tangan estetik berbasis *ecobrick*, produk *eco-enzyme*, hingga kuliner rumahan unggulan UMKM lokal.

![Gisikdrono Space Preview](https://img.shields.io/badge/UI%2FUX-Modern_Gallery-emerald) 
![Status](https://img.shields.io/badge/Status-Live-success)
![Database](https://img.shields.io/badge/Database-Supabase-blue)

## ✨ Fitur Unggulan

* **🎨 Modern Artisanal UI:** Desain "Frameless Glass" yang memberikan kesan premium pada setiap produk.
* **🌓 Adaptive Theme:** Mendukung Mode Terang dan Mode Malam (Dark Mode) untuk kenyamanan visual.
* **📱 Fully Responsive:** Antarmuka yang mulus diakses melalui smartphone warga maupun desktop monitor.
* **⚡ Real-time Synchronization:** Menggunakan **Supabase** untuk integrasi data yang instan di semua perangkat.
* **🚀 Seamless Image Compression:** Fitur upload foto otomatis diperkecil ukurannya di sisi browser untuk performa loading yang kilat.
* **💹 Smart Filter & Sort:** Filter kategori dinamis dengan pengurutan harga termurah/termahal secara real-time.
* **📲 WhatsApp Integration:** Transaksi langsung ke WhatsApp penjual dengan sistem format pesan otomatis.

## 🛠️ Tech Stack

* **Frontend:** HTML5, Tailwind CSS (CDN), Custom Native JavaScript.
* **Database:** Supabase (PostgreSQL).
* **Icons:** FontAwesome 6.
* **Typography:** Plus Jakarta Sans.

## 🚀 Cara Menjalankan Secara Lokal

1.  **Clone Repositori**
    ```bash
    git clone [https://github.com/username-kamu/gisikdrono-space.git](https://github.com/username-kamu/gisikdrono-space.git)
    ```
2.  **Konfigurasi Supabase**
    Buka file `script.js` dan ganti kredensial berikut dengan milik Anda:
    ```javascript
    const supabaseUrl = 'https://YOUR_PROJECT_URL.supabase.co';
    const supabaseKey = 'YOUR_ANON_KEY';
    ```
3.  **Jalankan Website**
    Cukup buka file `index.html` di browser Anda, atau gunakan ekstensi **Live Server** di VS Code.

## 📊 Struktur Database (Supabase)

Pastikan Anda memiliki tabel bernama `products` dengan kolom sebagai berikut:

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | int8 | Primary Key (Auto-increment) |
| `created_at` | timestamptz | Timestamp input |
| `seller` | text | Nama kreator/penjual |
| `title` | text | Judul karya |
| `cat` | text | Kategori (ecobrick/kerajinan/kuliner) |
| `price` | int8 | Harga produk |
| `wa` | text | Nomor WhatsApp aktif |
| `img` | text | Data URL foto (Base64) |
| `desc` | text | Narasi/deskripsi produk |

## 🌎 Kontribusi

Proyek ini dibangun untuk mendukung ekonomi sirkular dan UMKM di Kelurahan Gisikdrono. Jika Anda ingin menambahkan fitur seperti sistem rating atau integrasi peta wilayah, silakan lakukan *pull request*.

---
Diberdayakan oleh Warga untuk Bumi. 🌿