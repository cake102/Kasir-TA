import { useState, useEffect } from "react";
import { FaTimes, FaCamera, FaSyncAlt, FaBarcode } from "react-icons/fa";
import BarcodeScanner from "./BarcodeScanner"; // Import scanner

const TambahBarangModal = ({
  isOpen,
  onClose,
  onBarangTambah,
}: {
  isOpen: boolean;
  onClose: () => void;
  onBarangTambah: (barangBaru: any) => void;
}) => {
  const [kodeBarang, setKodeBarang] = useState("");
  const [namaBarang, setNamaBarang] = useState("");
  const [stok, setStok] = useState(0);
  const [hargaDasar, setHargaDasar] = useState(0);
  const [hargaJual, setHargaJual] = useState(0);
  const [kategori, setKategori] = useState("");
  const [kategoriList, setKategoriList] = useState<string[]>([]);
  const [showScanner, setShowScanner] = useState(false); // Tambahkan state scanner

  useEffect(() => {
    // Load kategori dari localStorage
    const savedKategori = JSON.parse(localStorage.getItem("kategoriBarang") || "[]");
    setKategoriList(savedKategori);
    if (savedKategori.length > 0) {
      setKategori(savedKategori[0]); // Set kategori default
    }
  }, []);

  const generateRandomCode = () => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setKodeBarang(randomCode);
  };

  const handleScan = (barcode: string) => {
    setKodeBarang(barcode);
    setShowScanner(false);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaBarang.trim() || !kategori) return; // Cegah input kosong

    const newBarang = {
      nama: namaBarang,
      kode: kodeBarang,
      stok,
      hargaDasar,
      hargaJual,
      kategori,
    };

    // Ambil barang yang sudah ada di localStorage
    const existingBarang = JSON.parse(localStorage.getItem("barangList") || "[]");

    // Tambahkan barang baru
    const updatedBarang = [...existingBarang, newBarang];

    // Simpan ke localStorage
    localStorage.setItem("barangList", JSON.stringify(updatedBarang));

    // Kirim data ke halaman utama
    onBarangTambah(newBarang);

    // Reset input & Tutup Modal
    setNamaBarang("");
    setKodeBarang("");
    setStok(0);
    setHargaDasar(0);
    setHargaJual(0);
    setKategori(kategoriList.length > 0 ? kategoriList[0] : "");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-lg overflow-y-auto max-h-[90vh]">
        {/* 🔹 Header Modal */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Tambah Barang</h2>
          <FaTimes className="text-gray-500 cursor-pointer" onClick={onClose} />
        </div>

        {/* 🔹 Upload Gambar */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
            <FaCamera className="text-gray-400 text-2xl" />
          </div>
          <button className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-lg text-sm">Ubah</button>
        </div>

        {/* 🔹 Form Input */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          {/* Nama Barang */}
          <label className="text-sm font-medium">Nama*</label>
          <input
            type="text"
            value={namaBarang}
            onChange={(e) => setNamaBarang(e.target.value)}
            placeholder="Masukkan nama.."
            className="w-full p-2 border rounded-md"
          />

          {/* Stok & Kode Barang */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Stok*</label>
              <input
                type="number"
                value={stok}
                onChange={(e) => setStok(Number(e.target.value))}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Kode Barang*</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={kodeBarang}
                  onChange={(e) => setKodeBarang(e.target.value)}
                  placeholder="Masukkan kode"
                  className="w-full p-2 border rounded-md"
                />
                <button
                  type="button"
                  onClick={generateRandomCode}
                  className="bg-gray-200 p-2 rounded-md hover:bg-gray-300"
                  title="Generate Kode Acak"
                >
                  <FaSyncAlt className="text-gray-600 text-lg" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowScanner(true)}
                  className="bg-blue-500 p-2 rounded-md text-white hover:bg-blue-600"
                  title="Scan Barcode"
                >
                  <FaBarcode className="text-lg" />
                </button>
              </div>
            </div>
          </div>

          {/* Harga Dasar & Harga Jual */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Harga Dasar*</label>
              <input
                type="number"
                value={hargaDasar}
                onChange={(e) => setHargaDasar(Number(e.target.value))}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Harga Jual*</label>
              <input
                type="number"
                value={hargaJual}
                onChange={(e) => setHargaJual(Number(e.target.value))}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          {/* Kategori */}
          <label className="text-sm font-medium">Kategori</label>
          <select
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            {kategoriList.length > 0 ? (
              kategoriList.map((kat, index) => (
                <option key={index} value={kat}>
                  {kat}
                </option>
              ))
            ) : (
              <option disabled>Tambahkan kategori terlebih dahulu</option>
            )}
          </select>

          {/* 🔹 Tombol Simpan */}
          <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg mt-3">
            Simpan
          </button>
        </form>
      </div>

      {/* Scanner Modal */}
      {showScanner && <BarcodeScanner onScan={handleScan} onClose={() => setShowScanner(false)} />}
    </div>
  );
};

export default TambahBarangModal;