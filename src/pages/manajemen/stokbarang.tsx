import { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import UserProfile from "../../components/UserProfile";
import Image from "next/image";
import { useRouter } from "next/router";
import { FaArrowLeft } from "react-icons/fa";
import EditStokModal from "./EditStokModal"; // Import modal
import PopupEkspor from "./PopupEkspor"; // ✅ Import popup ekspor

const StokBarang = () => {
  const router = useRouter();
  const [barangList, setBarangList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBarang, setSelectedBarang] = useState<any>(null); // State untuk barang yang dipilih
  const [showPopupEkspor, setShowPopupEkspor] = useState(false); // State untuk modal ekspor

  useEffect(() => {
    const savedBarang = JSON.parse(localStorage.getItem("barangList") || "[]");
    setBarangList(savedBarang);
  }, []);

  const filteredBarang = barangList.filter((barang) =>
    barang.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (barang: any) => {
    setSelectedBarang(barang);
    setIsModalOpen(true);
  };

  const handleSave = (updatedBarang: any) => {
    const updatedList = barangList.map((barang) =>
      barang.kode === updatedBarang.kode ? updatedBarang : barang
    );
    setBarangList(updatedList);
    localStorage.setItem("barangList", JSON.stringify(updatedList));
  };

  const handleDeleteClick = (kode: string) => {
    const konfirmasi = window.confirm("Apakah Anda yakin ingin menghapus barang ini?");
    if (!konfirmasi) return;
  
    const updatedList = barangList.filter((barang) => barang.kode !== kode);
    setBarangList(updatedList);
    localStorage.setItem("barangList", JSON.stringify(updatedList));
  };

  const handleOpenPopupEkspor = () => {
    setShowPopupEkspor(true);
  };

  const handleExport = (format: string) => {
    console.log(`Mengekspor data dalam format: ${format}`);
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-screen">
        {/* 🔹 Header */}
        <div className="flex items-center justify-between p-6 w-[96%] mx-auto">
          <div className="flex items-center gap-3">
            <FaArrowLeft
              className="text-gray-500 cursor-pointer text-xl"
              onClick={() => router.push("/manajemen")}
            />
            <h1 className="text-2xl font-bold">Stok Barang</h1>
          </div>
          <UserProfile />
        </div>

        {/* 🔹 Garis Pembatas */}
        <div className="w-[96%] mx-auto border-b border-gray-300 mt-3"></div>

        {/* 🔹 Tombol Export & Import */}
        <div className="flex justify-between items-center px-6 mt-4 w-[96%] mx-auto">
          <div className="flex gap-3">
            <button
              onClick={handleOpenPopupEkspor}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              {/* <Image src="/icons/export.svg" alt="Export" width={20} height={20} /> */}
              Export & Import Data
            </button>
            {/* <button className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
              <Image src="/icons/import.svg" alt="Import" width={20} height={20} />
              Import Data
            </button> */}
          </div>

          {/* 🔹 Search Input */}
          <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 w-80">
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

        {/* 🔹 Kontainer Tabel */}
        <div className="flex flex-grow w-full items-start justify-center p-6 mt-3">
          <div className="w-[96%] bg-white shadow-md rounded-lg overflow-hidden flex flex-col">
            {/* 🔹 Tabel Stok Barang */}
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-blue-500 text-white text-left">
                  <th className="p-3 border">Gambar</th>
                  <th className="p-3 border">Nama Barang</th>
                  <th className="p-3 border">Kode</th>
                  <th className="p-3 border">Kategori</th>
                  <th className="p-3 border">Stok</th>
                  <th className="p-3 border">Harga Jual (Rp)</th>
                  <th className="p-3 border">Harga Dasar (Rp)</th>
                  <th className="p-3 border">Aksi</th>
                </tr>
              </thead>
              <tbody className="align-top">
                {filteredBarang.length > 0 ? (
                  filteredBarang.map((barang, index) => (
                    <tr key={index} className="border">
                      <td className="p-3 border">
                        <Image
                          src={barang.gambar || "/icons/box.svg"} // ⬅ Gunakan gambar dari data
                          alt={barang.nama}
                          width={50}
                          height={50}
                          className="rounded-md object-cover"
                        />
                      </td>
                      <td className="p-3 border">{barang.nama}</td>
                      <td className="p-3 border">{barang.kode}</td>
                      <td className="p-3 border">{barang.kategori}</td>
                      <td className="p-3 border">{barang.stok}</td>
                      <td className="p-3 border">Rp {barang.hargaJual.toLocaleString()}</td>
                      <td className="p-3 border">Rp {barang.hargaDasar.toLocaleString()}</td>
                      <td className="p-3 border">
                        <span
                          onClick={() => handleEditClick(barang)}
                          className="text-green-500 cursor-pointer hover:text-green-700 mr-4"
                        >
                          Edit
                        </span>
                        <span
                          onClick={() => handleDeleteClick(barang.kode)}
                          className="text-red-500 cursor-pointer hover:text-red-700"
                        >
                          Hapus
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-5 text-center text-gray-400 border">
                      Data tidak ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* 🔹 Pagination */}
            <div className="flex justify-between items-center p-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span>Tampilkan:</span>
                <select className="border rounded-lg px-2 py-1">
                  <option value="1">1</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                </select>
                <span>Ditampilkan {filteredBarang.length} dari {barangList.length} data</span>
              </div>

              {/* 🔹 Navigasi Halaman */}
              <div className="flex items-center gap-2">
                <button className="border px-2 py-1 rounded-lg text-gray-500 hover:bg-gray-200">&lt;</button>
                <span className="border px-3 py-1 rounded-lg bg-blue-500 text-white">1</span>
                <button className="border px-2 py-1 rounded-lg text-gray-500 hover:bg-gray-200">&gt;</button>
              </div>
            </div>
          </div>
        </div>

        {/* 🔹 Modal Edit Stok */}
        <EditStokModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          barang={selectedBarang}
          onSave={handleSave}
        />

        {/* 🔹 Popup Ekspor */}
        <PopupEkspor
          isOpen={showPopupEkspor}
          onClose={() => setShowPopupEkspor(false)}
          onExport={handleExport}
        />
      </div>
    </MainLayout>
  );
};

export default StokBarang;
