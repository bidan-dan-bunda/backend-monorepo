# Backend untuk aplikasi Bidan dan Bunda

## Instalasi
- Pastikan Node.js dan NPM terinstall
  - Versi yang direkomendasikan: >=14
- `git clone` repositori ini
- Install dependencies: `npm install`

## Build
Untuk melakukan build, jalankan `npm run build`.

## Jalankan
- Program menggunakan environment variables untuk konfigurasi internal.
  Environment variables bisa ditulis di file `.env` atau melalui command line.

### Daftar environment variables

| Variable | Deskripsi | Default |
|---	     |---	       |---	     |
| DB_HOST  | Host database |  |
| DB_USER  | User database |  |
| DB_PASS  | Password user database | |
| DB_NAME  | Nama database |  |
| SESSION_SECRET  | Key secret untuk generator session ID | |
| USE_BETTER_STORE  | Jika kosong maka `express-session` akan menggunakan store defaultnya, yaitu `MemoryStore`. Jika bernilai truthy maka akan menggunakan `connect-session-sequelize`. | |

- Jalankan mode development: `npm run start:dev`
  Mode development secara otomatis menjalankan `nodemon`, tidak perlu restart program jika mengedit source code.
- Jalankan mode production: `npm start`.

### Debug logging
Tambahkan environment variables `DEBUG="app:*"` untuk menampilkan semua logging yang berkaitan dengan program.

## Jalankan test suite
Untuk menjalankan test suite, jalankan `npm test`. Direkomendasikan untuk menggunakan option `--runInBand` karena antara satu test dengan test lain sangat _coupled_.

Catatan: beberapa test suite membutuhkan environment variables seperti menjalankan program biasa.