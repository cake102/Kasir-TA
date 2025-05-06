import MainLayout from "../../layouts/MainLayout";
import UserProfile from "../../components/UserProfile";
import Image from "next/image";
import { useRouter } from "next/router";
import { FaArrowLeft } from "react-icons/fa";
import TambahBarangModal from "./TambahBarangModal";
import { useState, useEffect } from "react";

// ✅ Interface untuk barang
interface Barang {
  nama: string;
  kode: string;
  stok: number;
  hargaDasar: number;
  hargaJual: number;
  kategori: string;
  gambar: string | null;
}

const DataBarang = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [barangList, setBarangList] = useState<Barang[]>([]);
  const [selectedBarang, setSelectedBarang] = useState<Barang | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const savedBarang = JSON.parse(localStorage.getItem("barangList") || "[]");
    setBarangList(savedBarang);
  }, []);

  const handleTambahBarang = (barangBaru: Barang) => {
    const updatedBarang = [...barangList, barangBaru];
    setBarangList(updatedBarang);
    localStorage.setItem("barangList", JSON.stringify(updatedBarang));
  };

  const filteredBarang = barangList.filter((barang) =>
    barang.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="flex flex-col h-screen">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <FaArrowLeft
              className="text-gray-500 cursor-pointer text-xl"
              onClick={() => router.push("/manajemen")}
            />
            <h1 className="text-2xl font-bold">Data Barang / Produk</h1>
          </div>
          <UserProfile />
        </div>

        <div className="w-[96%] max-w-0xl mx-auto border-b border-gray-300 mb-6"></div>

        <div className="flex flex-grow p-6 gap-6">
          {/* Bagian Kiri */}
          <div className="flex flex-col w-1/2 bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center gap-3 w-full">
              <button className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100">
                <Image src="/icons/filter.svg" alt="Filter" width={20} height={20} />
              </button>

              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 w-full">
                <Image src="/icons/search.svg" alt="Search" width={20} height={20} className="mr-3" />
                <input
                  type="text"
                  placeholder="Cari barang.."
                  className="w-full outline-none bg-transparent text-gray-600"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-grow overflow-y-auto mt-4">
              {filteredBarang.length > 0 ? (
                filteredBarang.map((barang, index) => (
                  <div
                    key={index}
                    className={`p-3 border-b text-gray-700 font-medium cursor-pointer hover:bg-gray-100 ${
                      selectedBarang?.kode === barang.kode ? "bg-blue-100" : ""
                    }`}
                    onClick={() => setSelectedBarang(barang)}
                  >
                    {barang.nama} - ({barang.kategori})
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center text-gray-400 h-full">
                  Tidak ada barang
                </div>
              )}
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full mt-4 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600"
            >
              + Tambah Barang
            </button>
          </div>

          {/* Bagian Kanan */}
          <div className="flex flex-col w-1/2 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-bold">Rincian Barang :</h2>
            <div className="flex-grow overflow-y-auto mt-4">
              {selectedBarang ? (
                <div className="space-y-4">
                  {selectedBarang.gambar && (
                    <div className="flex justify-center">
                      <Image
                        src={selectedBarang.gambar}
                        alt={`Gambar ${selectedBarang.nama}`}
                        width={192}
                        height={192}
                        className="object-cover border rounded-md"
                        unoptimized
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-[150px_10px_1fr] gap-y-2 text-gray-700">
                    <div className="font-semibold">Nama</div>
                    <div>:</div>
                    <div>{selectedBarang.nama}</div>

                    <div className="font-semibold">Kategori</div>
                    <div>:</div>
                    <div>{selectedBarang.kategori}</div>

                    <div className="font-semibold">Kode</div>
                    <div>:</div>
                    <div>{selectedBarang.kode}</div>

                    <div className="font-semibold">Stok</div>
                    <div>:</div>
                    <div>{selectedBarang.stok}</div>

                    <div className="font-semibold">Harga Dasar</div>
                    <div>:</div>
                    <div>Rp {selectedBarang.hargaDasar.toLocaleString()}</div>

                    <div className="font-semibold">Harga Jual</div>
                    <div>:</div>
                    <div>Rp {selectedBarang.hargaJual.toLocaleString()}</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center text-gray-400 h-full">
                  Tidak ada barang yang dipilih
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <TambahBarangModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBarangTambah={handleTambahBarang}
      />
    </MainLayout>
  );
};

export default DataBarang;
