import { FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";

const TambahKategoriModal = ({
  isOpen,
  onClose,
  onKategoriTambah, // 🔹 Callback untuk update daftar kategori di halaman utama
}: {
  isOpen: boolean;
  onClose: () => void;
  onKategoriTambah: (kategoriBaru: string) => void;
}) => {
  const [kategori, setKategori] = useState(""); // 🔹 State untuk input kategori

  if (!isOpen) return null; // Jika modal tidak aktif, tidak ditampilkan

  // 🔹 Handle Submit Kategori
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kategori.trim()) return; // 🔹 Cegah kategori kosong

    // Ambil kategori yang sudah ada di localStorage
    const existingKategori = JSON.parse(localStorage.getItem("kategoriBarang") || "[]");

    // Tambahkan kategori baru
    const updatedKategori = [...existingKategori, kategori];

    // Simpan ke localStorage
    localStorage.setItem("kategoriBarang", JSON.stringify(updatedKategori));

    // 🔹 Kirim data ke halaman utama
    onKategoriTambah(kategori);

    // Reset input & Tutup Modal
    setKategori("");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg">
        
        {/* 🔹 Header Modal */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Tambah Kategori</h2>
          <FaTimes className="text-gray-500 cursor-pointer" onClick={onClose} />
        </div>

        {/* 🔹 Garis Pembatas */}
        <div className="border-t border-gray-300 my-4"></div>

        {/* 🔹 Form Input */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Nama Kategori */}
          <label className="text-sm font-medium">Nama Kategori</label>
          <input 
            type="text" 
            value={kategori} 
            onChange={(e) => setKategori(e.target.value)} 
            placeholder="Masukkan nama.." 
            className="w-full p-2 border rounded-md bg-gray-100"
          />

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