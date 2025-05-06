import { useRouter } from "next/router";
import MainLayout from "../../layouts/MainLayout";
import UserProfile from "../../components/UserProfile";
import Image from "next/image";
import { useState, useEffect } from "react";
import BarcodeScanner from "../manajemen/BarcodeScanner";
import { FaBarcode } from "react-icons/fa";

// Define the Barang interface to make the typing more specific
interface Barang {
  kode: string;
  nama: string;
  hargaJual: number;
  stok: number;
  kategori: string;
  gambar?: string;
  jumlah?: number;
}

const Transaksi = () => {
  const router = useRouter();
  const [barangTersedia, setBarangTersedia] = useState<Barang[]>([]);
  const [kategoriList, setKategoriList] = useState<string[]>([]);
  const [selectedKategori, setSelectedKategori] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedItems, setSelectedItems] = useState<Barang[]>([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [showAllKategori, setShowAllKategori] = useState(false);

  const loadBarangData = () => {
    const savedBarang: Barang[] = JSON.parse(localStorage.getItem("barangList") || "[]");
    setBarangTersedia(savedBarang);

    const savedKategori: string[] = JSON.parse(localStorage.getItem("kategoriBarang") || "[]");
    setKategoriList(savedKategori);
  };

  useEffect(() => {
    loadBarangData();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadBarangData();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const filteredBarang = barangTersedia.filter((barang) => {
    const cocokKategori = selectedKategori ? barang.kategori === selectedKategori : true;
    const keyword = searchKeyword.toLowerCase();
    const cocokKeyword =
      (barang.nama || "").toLowerCase().includes(keyword) ||
      (String(barang.kode) || "").toLowerCase().includes(keyword);
    return cocokKategori && cocokKeyword && barang.stok > 0;
  });

  const tambahBarang = (barang: Barang) => {
    setSelectedItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.kode === barang.kode);

      if (existingItem) {
        if (existingItem.jumlah! + 1 > barang.stok) {
          alert("Jumlah pembelian melebihi stok yang tersedia!");
          return prevItems;
        }
        return prevItems.map((item) =>
          item.kode === barang.kode ? { ...item, jumlah: item.jumlah! + 1 } : item
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

  const handleScan = (barcode: string) => {
    setIsScannerOpen(false);
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
          ? { ...item, jumlah: item.jumlah! + 1 > item.stok ? item.stok : item.jumlah! + 1 }
          : item
      )
    );
  };

  const onKurang = (kode: string) => {
    setSelectedItems((prevItems) =>
      prevItems
        .map((item) =>
          item.kode === kode ? { ...item, jumlah: item.jumlah! - 1 } : item
        )
        .filter((item) => item.jumlah! > 0)
    );
  };

  const handleBayar = () => {
    if (selectedItems.length === 0) return alert("Pilih barang terlebih dahulu!");

    const encodedData = encodeURIComponent(JSON.stringify(selectedItems));
    router.push(`/transaksi/pembayaran?data=${encodedData}&total=${totalHarga}`);
  };

  const totalHarga = selectedItems.reduce((total, item) => total + item.hargaJual * item.jumlah!, 0);

  return (
    <MainLayout>
      <div className="flex flex-col h-screen">
        <div className="flex items-center justify-between p-6">
          <h1 className="text-2xl font-bold">Transaksi</h1>
          <UserProfile />
        </div>

        <div className="w-full border-b border-gray-300 mb-6"></div>

        <div className="flex flex-grow p-6 gap-6">
          {/* Kiri */}
          <div className="w-1/2 bg-white shadow-md rounded-lg p-6">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Cari nama atau kode barang..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Kategori */}
            <div className="mb-4">
              <button
                onClick={() => setShowAllKategori((prev) => !prev)}
                className="mb-2 px-4 py-2 bg-blue-500 text-white rounded-full"
              >
                {showAllKategori ? "Tutup" : "Tampilkan Semua Kategori"}
              </button>

              {showAllKategori && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                  <button
                    onClick={() => setSelectedKategori(null)}
                    className={`px-4 py-2 rounded-full border text-sm ${
                      selectedKategori === null ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                  >
                    Semua
                  </button>
                  {kategoriList.map((kategori) => (
                    <button
                      key={kategori}
                      onClick={() => setSelectedKategori(kategori)}
                      className={`px-4 py-2 rounded-full border text-sm ${
                        selectedKategori === kategori ? "bg-blue-500 text-white" : "bg-gray-200"
                      }`}
                    >
                      {kategori}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              {filteredBarang.map((barang) => (
                <button
                  key={barang.kode}
                  className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg mb-2 hover:bg-gray-100 flex items-center"
                  onClick={() => tambahBarang(barang)}
                >
                  <Image
                    src={barang.gambar || "/icons/box.svg"} 
                    alt={barang.nama}
                    width={40}
                    height={40}
                    className="mr-3 rounded-md object-cover"
                  />
                  <div>
                    <span className="block font-semibold">{barang.nama}</span>
                    <span className="text-gray-500 text-sm">{`Rp ${barang.hargaJual.toLocaleString()} - Stok: ${barang.stok}`}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Kanan */}
          <div className="w-1/2 bg-white rounded-lg shadow-md flex flex-col">
            <div className="p-6 flex-grow">
              <h2 className="text-lg font-bold mb-3">List Barang</h2>
              <ul>
                {selectedItems.map((item) => (
                  <li key={item.kode} className="flex justify-between items-center py-3 border-b">
                    <Image src={item.gambar || "/icons/box.svg"} alt={item.nama} width={50} height={50} className="rounded-md" />
                    <div className="flex-grow px-4">
                      <span className="block font-semibold">{item.nama}</span>
                      <span className="text-gray-500 text-sm">{`Rp ${item.hargaJual.toLocaleString()}`}</span>
                    </div>
                    <button onClick={() => onKurang(item.kode)} className="px-3">
                      <Image src="/icons/mines.svg" alt="Kurang" width={25} height={25} />
                    </button>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={item.jumlah === 0 ? "" : item.jumlah}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                          setSelectedItems((prevItems) =>
                            prevItems.map((i) =>
                              i.kode === item.kode
                                ? { ...i, jumlah: value === "" ? 0 : Number(value) }
                                : i
                            )
                          );
                        }
                      }}
                      onBlur={() => {
                        if (item.jumlah != null && item.jumlah < 1) {
                          setSelectedItems((prevItems) =>
                            prevItems.filter((i) => i.kode !== item.kode)
                          );
                        } else if (item.jumlah != null && item.jumlah > item.stok) {
                          setSelectedItems((prevItems) =>
                            prevItems.map((i) =>
                              i.kode === item.kode ? { ...i, jumlah: item.stok } : i
                            )
                          );
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.currentTarget.blur(); 
                        }
                      }}
                      className="bg-gray-200 px-4 py-2 rounded-lg text-xl font-bold w-16 text-center appearance-none"
                    />
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
              <button
                onClick={handleBayar}
                className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg"
              >
                Bayar
              </button>
            </div>
          </div>
        </div>

        {isScannerOpen && <BarcodeScanner onScan={handleScan} onClose={() => setIsScannerOpen(false)} />}
      </div>
    </MainLayout>
  );
};

export default Transaksi;
