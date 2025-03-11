import MainLayout from "../../layouts/MainLayout";
import UserProfile from "../../components/UserProfile";
import Image from "next/image";
import { useRouter } from "next/router";
import { FaArrowLeft } from "react-icons/fa";
import TambahKategoriModal from "./TambahKategoriModal";
import { useState, useEffect } from "react";

const KategoriBarang = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [kategoriList, setKategoriList] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKategori, setSelectedKategori] = useState<string | null>(null);
  const [barangList, setBarangList] = useState<{ nama: string; kategori: string }[]>([]);

  // 🔹 Load kategori dari localStorage saat halaman dimuat
  useEffect(() => {
    const savedKategori = JSON.parse(localStorage.getItem("kategoriBarang") || "[]");
    setKategoriList(savedKategori);
  }, []);

  // 🔹 Load barang dari localStorage
  useEffect(() => {
    const savedBarang = JSON.parse(localStorage.getItem("barangList") || "[]");
    setBarangList(savedBarang);
  }, []);

  // 🔹 Menambahkan kategori baru & update localStorage
  const handleTambahKategori = (kategoriBaru: string) => {
    const updatedKategori = [...kategoriList, kategoriBaru];
    setKategoriList(updatedKategori);
    localStorage.setItem("kategoriBarang", JSON.stringify(updatedKategori));
  };

  // 🔹 Filter kategori berdasarkan pencarian
  const filteredKategori = kategoriList.filter((kategori) =>
    kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔹 Filter barang berdasarkan kategori yang dipilih
  const barangByKategori = selectedKategori
    ? barangList.filter((barang) => barang.kategori === selectedKategori)
    : [];

  return (
    <MainLayout>
      <div className="flex flex-col h-screen">
        {/* 🔹 Header: Kembali, Judul, Profil */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <FaArrowLeft 
              className="text-gray-500 cursor-pointer text-xl"
              onClick={() => router.push("/manajemen")} // ✅ Navigasi kembali
            />
            <h1 className="text-2xl font-bold">Kategori Barang</h1>
          </div>
          <UserProfile />
        </div>

        {/* 🔹 Garis Pembatas */}
        <div className="w-[96%] max-w-0xl mx-auto border-b border-gray-300 mb-6"></div>

        {/* 🔹 Kontainer Grid */}
        <div className="flex flex-grow p-6 gap-6">
          {/* 🔹 Bagian Kiri: List Kategori */}
          <div className="flex flex-col w-1/2 bg-white shadow-md rounded-lg p-6">
            {/* 🔹 Search & Filter */}
            <div className="flex items-center gap-3 w-full">
              {/* 🔹 Filter Button */}
              <button className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100">
                <Image src="/icons/filter.svg" alt="Filter" width={20} height={20} />
              </button>

              {/* 🔹 Search Input */}
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 w-full">
                <Image src="/icons/search.svg" alt="Search" width={20} height={20} className="mr-3" />
                <input
                  type="text"
                  placeholder="Cari kategori.."
                  className="w-full outline-none bg-transparent text-gray-600"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* 🔹 List Kategori */}
            <div className="flex-grow overflow-y-auto mt-4">
              {filteredKategori.length > 0 ? (
                filteredKategori.map((kategori, index) => (
                  <div
                    key={index}
                    className={`p-3 border-b text-gray-700 font-medium cursor-pointer hover:bg-gray-100 ${
                      selectedKategori === kategori ? "bg-blue-100" : ""
                    }`}
                    onClick={() => setSelectedKategori(kategori)}
                  >
                    {kategori}
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center text-gray-400 h-full">
                  Tidak ada kategori
                </div>
              )}
            </div>

            {/* 🔹 Tombol Tambah Kategori */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full mt-4 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600"
            >
              + Tambah Kategori
            </button>
          </div>

          {/* 🔹 Bagian Kanan: Rincian Barang */}
          <div className="flex flex-col w-1/2 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-bold">
              {selectedKategori ? `Barang dalam Kategori: ${selectedKategori}` : "Pilih Kategori"}
            </h2>
            <div className="flex-grow overflow-y-auto mt-4">
              {selectedKategori ? (
                barangByKategori.length > 0 ? (
                  barangByKategori.map((barang, index) => (
                    <div key={index} className="p-3 border-b text-gray-700 font-medium">
                      {barang.nama}
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center text-gray-400 h-full">
                    Tidak ada barang dalam kategori ini
                  </div>
                )
              ) : (
                <div className="flex items-center justify-center text-gray-400 h-full">
                  Klik kategori untuk melihat barang
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Komponen Modal */}
      <TambahKategoriModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onKategoriTambah={handleTambahKategori} 
      />
    </MainLayout>
  );
};

export default KategoriBarang;