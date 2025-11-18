const app = require("./app");

// Jalankan server di port 3000 (untuk pengembangan lokal)
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server berjalan di http://0.0.0.0:${PORT}`);
});
