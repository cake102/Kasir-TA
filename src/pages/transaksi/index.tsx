import { useRouter } from "next/router";
import MainLayout from "../../layouts/MainLayout";
import UserProfile from "../../components/UserProfile";
import Image from "next/image";
import { useState, useEffect } from "react";
import BarcodeScanner from "../manajemen/BarcodeScanner";
import { FaBarcode } from "react-icons/fa";

const Transaksi = () => {
  const router = useRouter();
  const [barangTersedia, setBarangTersedia] = useState<any[]>([]);
  const [kategoriList, setKategoriList] = useState<string[]>([]);
  const [selectedKategori, setSelectedKategori] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    const savedBarang = JSON.parse(localStorage.getItem("barangList") || "[]");
    setBarangTersedia(savedBarang);

    const savedKategori = JSON.parse(localStorage.getItem("kategoriBarang") || "[]");
    setKategoriList(savedKategori);
  }, []);

  const filteredBarang = selectedKategori
    ? barangTersedia.filter((barang) => barang.kategori === selectedKategori && barang.stok > 0)
    : barangTersedia.filter((barang) => barang.stok > 0);

  const tambahBarang = (barang: any) => {
    setSelectedItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.kode === barang.kode);

      if (existingItem) {
        if (existingItem.jumlah + 1 > barang.stok) {
          alert("Jumlah pembelian melebihi stok yang tersedia!");
          return prevItems;
        }
        return prevItems.map((item) =>
          item.kode === barang.kode ? { ...item, jumlah: item.jumlah + 1 } : item
        );
      } else {
        if (barang.stok < 1) {
          alert("Stok barang habis!");
          return prevItems;
        }
        return [...prevItems, { ...barang, jumlah: 1 }];
      }
    });
  };
  // ✅ Fungsi untuk menangani hasil scan barcode
  const handleScan = (barcode: string) => {
    setIsScannerOpen(false); // ✅ Tutup scanner setelah scan berhasil
    const barangDitemukan = barangTersedia.find((barang) => barang.kode === barcode);

    if (barangDitemukan) {
      tambahBarang(barangDitemukan);
    } else {
      alert("Barang tidak ditemukan!");
    }
  };

  const onTambah = (kode: string) => {
    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.kode === kode
          ? { ...item, jumlah: item.jumlah + 1 > item.stok ? item.stok : item.jumlah + 1 }
          : item
      )
    );
  };

  const onKurang = (kode: string) => {
    setSelectedItems((prevItems) =>
      prevItems
        .map((item) =>
          item.kode === kode ? { ...item, jumlah: item.jumlah - 1 } : item
        )
        .filter((item) => item.jumlah > 0)
    );
  };

  const onUbahJumlah = (kode: string, jumlahBaru: number) => {
    if (jumlahBaru < 1) jumlahBaru = 1;
    
    setSelectedItems((prevItems) =>
      prevItems.map((item) =>
        item.kode === kode
          ? { ...item, jumlah: jumlahBaru > item.stok ? item.stok : jumlahBaru }
          : item
      )
    );
  };

  const handleBayar = () => {
    if (selectedItems.length === 0) return alert("Pilih barang terlebih dahulu!");
    
    const encodedData = encodeURIComponent(JSON.stringify(selectedItems));
    router.push(`/transaksi/pembayaran?data=${encodedData}&total=${totalHarga}`);
  };

  const totalHarga = selectedItems.reduce((total, item) => total + item.hargaJual * item.jumlah, 0);

  return (
    <MainLayout>
      <div className="flex flex-col h-screen">
        <div className="flex items-center justify-between p-6">
          <h1 className="text-2xl font-bold">Transaksi</h1>
          <UserProfile />
        </div>

        <div className="w-full border-b border-gray-300 mb-6"></div>

        <div className="flex flex-grow p-6 gap-6">
          <div className="w-1/2 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-bold mb-3">Kategori</h2>

            <div className="mt-4">
              {filteredBarang.map((barang) => (
                <button
                  key={barang.kode}
                  className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg mb-2 hover:bg-gray-100 flex items-center"
                  onClick={() => tambahBarang(barang)}
                >
                  <Image src="/icons/box.svg" alt={barang.nama} width={40} height={40} className="mr-3 rounded-md" />
                  <div>
                    <span className="block font-semibold">{barang.nama}</span>
                    <span className="text-gray-500 text-sm">{`Rp ${barang.hargaJual.toLocaleString()} - Stok: ${barang.stok}`}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="w-1/2 bg-white rounded-lg shadow-md flex flex-col">
            <div className="p-6 flex-grow">
              <h2 className="text-lg font-bold mb-3">List Barang</h2>
              <ul>
                {selectedItems.map((item) => (
                  <li key={item.kode} className="flex justify-between items-center py-3 border-b">

                    {/* Gambar Produk */}
                    <Image src={item.gambar || "/icons/box.svg"} alt={item.nama} width={50} height={50} className="rounded-md" />

                    {/* Detail Produk */}
                    <div className="flex-grow px-4">
                      <span className="block font-semibold">{item.nama}</span>
                      <span className="text-gray-500 text-sm">{`Rp ${item.hargaJual.toLocaleString()}`}</span>
                    </div>

                    {/* Tombol Kurang dengan Ikon */}
                    <button onClick={() => onKurang(item.kode)} className="px-3">
                      <Image src="/icons/mines.svg" alt="Kurang" width={25} height={25} />
                    </button>

                    {/* Input Jumlah (tanpa spinner di Safari) */}
                    <input
                      type="number"
                      value={item.jumlah}
                      min=""
                      max={item.stok}
                      onChange={(e) => onUbahJumlah(item.kode, Number(e.target.value))}
                      className="bg-gray-200 px-4 py-2 rounded-lg text-xl font-bold w-16 text-center appearance-none"
                      style={{
                        MozAppearance: "textfield",
                      }}
                    />

                    {/* Tombol Tambah dengan Ikon */}
                    <button onClick={() => onTambah(item.kode)} className="px-3">
                      <Image src="/icons/plus.svg" alt="Tambah" width={25} height={25} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-200 p-4 flex justify-between items-center rounded-b-lg">
              <button onClick={() => setIsScannerOpen(true)} className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg">
                <FaBarcode className="mr-2" /> Scan Barcode
              </button>
              <span className="text-xl font-bold">{`Rp ${totalHarga.toLocaleString()}`}</span>
              <button onClick={handleBayar} className="bg-blue-500 text-white px-6 py-2 rounded-lg">
                Bayar
              </button>
            </div>
          </div>
        </div>
      </div>
      {isScannerOpen && <BarcodeScanner onScan={handleScan} onClose={() => setIsScannerOpen(false)} />}
    </MainLayout>
  );
};

export default Transaksi;