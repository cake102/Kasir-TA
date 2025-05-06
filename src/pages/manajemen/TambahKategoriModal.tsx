import { FaTimes } from "react-icons/fa";
import { useState } from "react";

const TambahKategoriModal = ({
  isOpen,
  onClose,
  onKategoriTambah,
}: {
  isOpen: boolean;
  onClose: () => void;
  onKategoriTambah: (kategoriBaru: string) => void;
}) => {
  const [kategori, setKategori] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  // 🔹 Handle Submit Kategori
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = kategori.trim();

    // 🔸 Validasi input kosong
    if (!trimmed) {
      setError("Nama kategori tidak boleh kosong");
      return;
    }

    // 🔸 Ambil dan normalisasi kategori yang sudah ada
    const existingKategori = JSON.parse(localStorage.getItem("kategoriBarang") || "[]");

    const isDuplicate = existingKategori.some(
      (item: string) => item.toLowerCase() === trimmed.toLowerCase()
    );

    // 🔸 Validasi duplikat
    if (isDuplicate) {
      setError("Nama kategori sudah ada");
      return;
    }

    // 🔸 Tambahkan kategori baru
    const updatedKategori = [...existingKategori, trimmed];
    localStorage.setItem("kategoriBarang", JSON.stringify(updatedKategori));
    onKategoriTambah(trimmed);

    // 🔸 Reset & Tutup Modal
    setKategori("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
        
        {/* 🔹 Header Modal */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Tambah Kategori</h2>
          <FaTimes
            className="text-gray-500 cursor-pointer"
            onClick={() => {
              setKategori("");
              setError("");
              onClose();
            }}
          />
        </div>

        {/* 🔹 Garis Pembatas */}
        <div className="border-t border-gray-300 my-4"></div>

        {/* 🔹 Form Input */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Label */}
          <label className="text-sm font-medium">Nama Kategori</label>

          {/* Input */}
          <input 
            type="text" 
            value={kategori} 
            onChange={(e) => {
              setKategori(e.target.value);
              setError(""); // 🔸 Hapus error saat user mulai mengetik ulang
            }} 
            placeholder="Masukkan nama.." 
            className="w-full p-2 border rounded-md bg-gray-100"
          />

          {/* 🔹 Pesan Error */}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* 🔹 Tombol Tambah */}
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white p-3 rounded-lg mt-3 hover:bg-blue-600"
          >
            Tambah
          </button>
        </form>
      </div>
    </div>
  );
};

export default TambahKategoriModal;