const express = require("express");
const app = express();

// Middleware untuk parsing JSON
app.use(express.json());

// Data mahasiswa disimpan sementara dalam array di memori
let mahasiswa = [
  { id: 1, nama: "Budi Santoso", nim: "12345678" },
  { id: 2, nama: "Siti Aminah", nim: "87654321" },
];

// Helper: generate ID baru
const generateId = () => {
  if (mahasiswa.length === 0) return 1;
  return Math.max(...mahasiswa.map((m) => m.id)) + 1;
};

// POST /register → Menambahkan data mahasiswa baru
app.post("/register", (req, res) => {
  const { nama, nim } = req.body;

  // Validasi input
  if (!nama || !nim) {
    return res.status(400).json({
      status: "error",
      message: "Nama dan NIM harus diisi",
    });
  }

  // Cek apakah NIM sudah ada
  const existing = mahasiswa.find((m) => m.nim === nim);
  if (existing) {
    return res.status(409).json({
      status: "error",
      message: "NIM sudah terdaftar",
    });
  }

  const newMahasiswa = {
    id: generateId(),
    nama,
    nim,
  };

  mahasiswa.push(newMahasiswa);

  res.status(201).json({
    status: "success",
    message: "Registrasi berhasil",
    data: {
      nama: newMahasiswa.nama,
      nim: newMahasiswa.nim,
    },
  });
});

// GET /users → Menampilkan seluruh data mahasiswa
app.get("/users", (req, res) => {
  res.json({
    status: "success",
    data: mahasiswa,
  });
});

// PUT /users/:id → Mengupdate data mahasiswa berdasarkan id
app.put("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { nama, nim } = req.body;

  if (!nama || !nim) {
    return res.status(400).json({
      status: "error",
      message: "Nama dan NIM harus diisi",
    });
  }

  const index = mahasiswa.findIndex((m) => m.id === id);
  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: "Mahasiswa tidak ditemukan",
    });
  }

  // Cek duplikasi NIM (kecuali milik diri sendiri)
  const existingNim = mahasiswa.find((m) => m.nim === nim && m.id !== id);
  if (existingNim) {
    return res.status(409).json({
      status: "error",
      message: "NIM sudah digunakan oleh mahasiswa lain",
    });
  }

  mahasiswa[index] = { id, nama, nim };
  res.json({
    status: "success",
    message: "Data mahasiswa berhasil diperbarui",
    data: mahasiswa[index],
  });
});

// DELETE /users/:id → Menghapus data mahasiswa berdasarkan id
app.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = mahasiswa.findIndex((m) => m.id === id);

  if (index === -1) {
    return res.status(404).json({
      status: "error",
      message: "Mahasiswa tidak ditemukan",
    });
  }

  const deleted = mahasiswa.splice(index, 1)[0];
  res.json({
    status: "success",
    message: "Data mahasiswa berhasil dihapus",
    data: deleted,
  });
});

// Jalankan server di port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
