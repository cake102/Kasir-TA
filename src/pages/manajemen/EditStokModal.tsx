import React, { useState, useEffect } from "react";
import Image from "next/image";  // Import Image dari Next.js

interface Barang {
  nama: string;
  kode: string;
  kategori: string;
  stok: number;
  hargaJual: number;
  hargaDasar: number;
  gambar: string | null;
}

interface EditStokModalProps {
  isOpen: boolean;
  onClose: () => void;
  barang: Barang | null;  // Menggunakan tipe Barang
  onSave: (updatedBarang: Barang) => void;  // Menggunakan tipe Barang
}

const EditStokModal: React.FC<EditStokModalProps> = ({ isOpen, onClose, barang, onSave }) => {
  const [nama, setNama] = useState("");
  const [kode, setKode] = useState("");
  const [kategori, setKategori] = useState("");
  const [stok, setStok] = useState(0);
  const [hargaJual, setHargaJual] = useState(0);
  const [hargaDasar, setHargaDasar] = useState(0);
  const [kategoriList, setKategoriList] = useState<string[]>([]);

  const [preview, setPreview] = useState<string | null>(null);  // Gambar preview

  useEffect(() => {
    const savedKategori = JSON.parse(localStorage.getItem("kategoriBarang") || "[]");
    setKategoriList(savedKategori);
  }, []);

  useEffect(() => {
    if (barang) {
      setNama(barang.nama || "");
      setKode(barang.kode || "");
      setKategori(barang.kategori || "");
      setStok(barang.stok || 0);
      setHargaJual(barang.hargaJual || 0);
      setHargaDasar(barang.hargaDasar || 0);
      setPreview(barang.gambar || null);  // Set preview gambar dari barang
    }
  }, [barang]);

  const handleGambarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));  // Menampilkan gambar yang dipilih
    }
  };

  const handleSave = () => {
    if (!barang) return;
    const updatedBarang = {
      ...barang,
      nama,
      kode,
      kategori,
      stok,
      hargaJual,
      hargaDasar,
      gambar: preview,  // Menyimpan gambar yang dipilih (preview)
    };
    onSave(updatedBarang);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-xl font-bold mb-4">Edit Stok Barang</h2>

        {/* Gambar di atas */}
        <div className="mb-4">
          <label className="block mb-1">Gambar</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleGambarChange}
            className="w-full"
          />
          {preview && (
            <div className="mt-2">
              <Image
                src={preview}
                alt="Preview"
                width={128}  // Tentukan ukuran gambar
                height={128}  // Tentukan ukuran gambar
                className="object-cover rounded border"
              />
            </div>
          )}
        </div>

        {/* Nama */}
        <div className="mb-4">
          <label className="block mb-1">Nama Barang</label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="border rounded-lg w-full p-2"
          />
        </div>

        {/* Kode */}
        <div className="mb-4">
          <label className="block mb-1">Kode</label>
          <input
            type="text"
            value={kode}
            onChange={(e) => setKode(e.target.value)}
            className="border rounded-lg w-full p-2"
          />
        </div>

        {/* Kategori */}
        <div className="mb-4">
          <label className="block mb-1">Kategori</label>
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="border rounded-lg w-full p-2 bg-white"
          >
            <option value="">-- Pilih Kategori --</option>
            {kategoriList.map((kat, idx) => (
              <option key={idx} value={kat}>
                {kat}
              </option>
            ))}
          </select>
        </div>

        {/* Stok */}
        <div className="mb-4">
          <label className="block mb-1">Stok</label>
          <input
            type="number"
            value={stok}
            onChange={(e) => setStok(Number(e.target.value))}
            className="border rounded-lg w-full p-2"
          />
        </div>

        {/* Harga Jual */}
        <div className="mb-4">
          <label className="block mb-1">Harga Jual (Rp)</label>
          <input
            type="number"
            value={hargaJual}
            onChange={(e) => setHargaJual(Number(e.target.value))}
            className="border rounded-lg w-full p-2"
          />
        </div>

        {/* Harga Dasar */}
        <div className="mb-4">
          <label className="block mb-1">Harga Dasar (Rp)</label>
          <input
            type="number"
            value={hargaDasar}
            onChange={(e) => setHargaDasar(Number(e.target.value))}
            className="border rounded-lg w-full p-2"
          />
        </div>

        {/* Tombol */}
        <div className="flex justify-end">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded-lg mr-2">
            Batal
          </button>
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStokModal;
