import MainLayout from "../../layouts/MainLayout";
import UserProfile from "../../components/UserProfile";
import { useState, useEffect } from "react";
import PopupEkspor from "./PopupEkspor"; // ✅ Import popup ekspor
import Image from "next/image";

const Laporan = () => {
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [totalPenjualan, setTotalPenjualan] = useState(0);
  const [totalTransaksi, setTotalTransaksi] = useState(0);
  const [totalPembayaran, setTotalPembayaran] = useState(0);
  const [showPopupEkspor, setShowPopupEkspor] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]); // Default hari ini
  const [showAll, setShowAll] = useState(false); // Jika true, tampilkan semua transaksi

  useEffect(() => {
    // 🔹 Ambil transaksi dari localStorage
    const transaksiDariStorage = JSON.parse(localStorage.getItem("transaksi")) || [];

    // 🔹 Ubah format tanggal transaksi ke `YYYY-MM-DD`
    const formattedTransactions = transaksiDariStorage.map((trx) => ({
      ...trx,
      tanggal: new Date(trx.waktuOrder).toISOString().split("T")[0], // Ambil hanya tanggal
    }));

    let filteredByDate;
    if (showAll) {
      filteredByDate = formattedTransactions; // Jika "Tampilkan Semua" aktif, ambil semua transaksi
    } else {
      filteredByDate = formattedTransactions.filter((trx) => trx.tanggal === selectedDate);
    }

    setFilteredData(filteredByDate);

    // 🔹 Hitung total transaksi & penjualan dari transaksi yang difilter
    const totalSales = filteredByDate.reduce((sum, trx) => sum + trx.total, 0);
    setTotalPenjualan(totalSales);
    setTotalTransaksi(filteredByDate.length);
    setTotalPembayaran(totalSales);
  }, [selectedDate, showAll]);

  // 🔹 Fungsi ekspor laporan
  const handleExport = (format: string) => {
    console.log(`Mengekspor laporan dalam format: ${format}`);
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-screen">
        {/* 🔹 Header */}
        <div className="flex items-center justify-between p-6">
          <h1 className="text-2xl font-bold">Laporan Transaksi</h1>
          <UserProfile />
        </div>

        {/* 🔹 Filter Tanggal dan Tampilkan Semua */}
        <div className="flex items-center justify-between px-6 mb-4">
          <div className="flex items-center gap-4">
            <label className="text-lg font-semibold">Pilih Tanggal:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-2 border rounded-lg"
              disabled={showAll} // Jika "Tampilkan Semua" aktif, disable input tanggal
            />
          </div>
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              id="showAll"
              checked={showAll}
              onChange={(e) => setShowAll(e.target.checked)}
              className="w-5 h-5"
            />
            <label htmlFor="showAll" className="text-lg font-semibold cursor-pointer">
              Tampilkan Semua Transaksi
            </label>
          </div>
        </div>

        {/* 🔹 Dashboard Cards */}
        <div className="grid grid-cols-3 gap-4 p-6">
          <div className="bg-white shadow-md p-4 rounded-lg">
            <p className="text-gray-500">Total Penjualan</p>
            <h2 className="text-2xl font-bold">Rp {totalPenjualan.toLocaleString()}</h2>
          </div>
          <div className="bg-white shadow-md p-4 rounded-lg">
            <p className="text-gray-500">Total Transaksi</p>
            <h2 className="text-2xl font-bold">{totalTransaksi}</h2>
          </div>
          <div className="bg-white shadow-md p-4 rounded-lg">
            <p className="text-gray-500">Total Pembayaran</p>
            <h2 className="text-2xl font-bold">Rp {totalPembayaran.toLocaleString()}</h2>
          </div>
        </div>

       {/* 🔹 Tombol Ekspor */}
        <div className="flex justify-end px-6">
          <button
            onClick={() => setShowPopupEkspor(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Image src="/icons/export.svg" alt="Export" width={20} height={20} />
            Ekspor Laporan
          </button>
        </div>

        {/* 🔹 Tabel Transaksi */}
        <div className="p-6 bg-white shadow-md rounded-lg mt-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-3 text-left">Nomor Transaksi</th>
                <th className="p-3 text-left">Waktu Order</th>
                <th className="p-3 text-left">Waktu Bayar</th>
                <th className="p-3 text-left">Outlet</th>
                <th className="p-3 text-left">Barang</th> {/* 🔹 Ganti Jenis Order dengan Barang */}
                <th className="p-3 text-left">Total Penjualan (Rp.)</th>
                <th className="p-3 text-left">Metode Pembayaran</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((trx, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3">{trx.id}</td>
                    <td className="p-3">{trx.waktuOrder}</td>
                    <td className="p-3">{trx.waktuBayar}</td>
                    <td className="p-3">{trx.outlet}</td>
                    <td className="p-3">
                      {trx.barangList && trx.barangList.length > 0 ? (
                        <ul className="list-disc pl-4">
                          {trx.barangList.map((barang: any, i: number) => (
                            <li key={i}>{barang.nama} x{barang.jumlah}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-400">Tidak ada barang</span>
                      )}
                    </td>
                    <td className="p-3">{`Rp ${trx.total.toLocaleString()}`}</td>
                    <td className="p-3">{trx.metode}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-400">
                    Data tidak tersedia
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 🔹 Popup Ekspor */}
        <PopupEkspor isOpen={showPopupEkspor} onClose={() => setShowPopupEkspor(false)} onExport={handleExport} />
      </div>
    </MainLayout>
  );
};

export default Laporan;