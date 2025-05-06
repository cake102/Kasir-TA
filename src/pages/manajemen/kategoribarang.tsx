import MainLayout from "../../layouts/MainLayout";
import UserProfile from "../../components/UserProfile";
import Image from "next/image";
import { useRouter } from "next/router";
import { FaArrowLeft } from "react-icons/fa";
import TambahKategoriModal from "./TambahKategoriModal";
import EditKategoriModal from "./EditKategoriModal";
import { useState, useEffect } from "react";

const KategoriBarang = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [kategoriEdit, setKategoriEdit] = useState<string | null>(null);
  const [kategoriList, setKategoriList] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKategori, setSelectedKategori] = useState<string | null>(null);
  const [barangList, setBarangList] = useState<{ nama: string; kategori: string }[]>([]);

  useEffect(() => {
    const savedKategori = JSON.parse(localStorage.getItem("kategoriBarang") || "[]");
    setKategoriList(savedKategori);
  }, []);

  useEffect(() => {
    const savedBarang = JSON.parse(localStorage.getItem("barangList") || "[]");
    setBarangList(savedBarang);
  }, []);

  const handleTambahKategori = (kategoriBaru: string) => {
    const updatedKategori = [...kategoriList, kategoriBaru];
    setKategoriList(updatedKategori);
    localStorage.setItem("kategoriBarang", JSON.stringify(updatedKategori));
  };

  const handleEditKategori = (kategori: string) => {
    setKategoriEdit(kategori);
    setEditModalOpen(true);
  };

  const handleUpdateKategori = (kategoriLama: string, kategoriBaru: string) => {
    const updatedList = kategoriList.map((k) => (k === kategoriLama ? kategoriBaru : k));
    const updatedBarang = barangList.map((barang) =>
      barang.kategori === kategoriLama ? { ...barang, kategori: kategoriBaru } : barang
    );

    setKategoriList(updatedList);
    setBarangList(updatedBarang);
    localStorage.setItem("kategoriBarang", JSON.stringify(updatedList));
    localStorage.setItem("barangList", JSON.stringify(updatedBarang));
    setEditModalOpen(false);
  };

  const handleDeleteKategori = (kategori: string) => {
    const confirmDelete = window.confirm(`Yakin ingin menghapus kategori "${kategori}"?`);

    if (confirmDelete) {
      const updatedList = kategoriList.filter((k) => k !== kategori);
      setKategoriList(updatedList);
      localStorage.setItem("kategoriBarang", JSON.stringify(updatedList));

      if (selectedKategori === kategori) {
        setSelectedKategori(null);
      }
    }
  };

  const filteredKategori = kategoriList.filter((kategori) =>
    kategori.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const barangByKategori = selectedKategori
    ? barangList.filter((barang) => barang.kategori === selectedKategori)
    : [];

  return (
    <MainLayout>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <FaArrowLeft
              className="text-gray-500 cursor-pointer text-xl"
              onClick={() => router.push("/manajemen")}
            />
            <h1 className="text-2xl font-bold">Kategori Barang</h1>
          </div>
          <UserProfile />
        </div>

        <div className="w-[96%] max-w-0xl mx-auto border-b border-gray-300 mb-6"></div>

        {/* Grid */}
        <div className="flex flex-grow p-6 gap-6">
          {/* Kiri: List Kategori */}
          <div className="flex flex-col w-1/2 bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center gap-3 w-full">
              <button className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100">
                <Image src="/icons/filter.svg" alt="Filter" width={20} height={20} />
              </button>

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

            {/* List */}
            <div className="flex-grow overflow-y-auto mt-4">
              {filteredKategori.length > 0 ? (
                filteredKategori.map((kategori, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 border-b cursor-pointer hover:bg-gray-100 ${
                      selectedKategori === kategori ? "bg-blue-100" : ""
                    }`}
                  >
                    <span
                      onClick={() => setSelectedKategori(kategori)}
                      className="flex-1 text-gray-700 font-medium"
                    >
                      {kategori}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditKategori(kategori)}
                        className="text-blue-500 hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteKategori(kategori)}
                        className="text-red-500 hover:underline text-sm"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center text-gray-400 h-full">
                  Tidak ada kategori
                </div>
              )}
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full mt-4 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600"
            >
              + Tambah Kategori
            </button>
          </div>

          {/* Kanan: Barang dalam kategori */}
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

      {/* Modal Tambah */}
      <TambahKategoriModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onKategoriTambah={handleTambahKategori}
      />

      {/* Modal Edit */}
      <EditKategoriModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleUpdateKategori}
        kategoriLama={kategoriEdit}
      />
    </MainLayout>
  );
};

export default KategoriBarang;