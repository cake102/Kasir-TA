import MainLayout from "../../layouts/MainLayout";
import UserProfile from "../../components/UserProfile";
import { useState, useEffect } from "react";
import PopupEkspor from "./PopupEkspor";
import Image from "next/image";

const Laporan = () => {
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [totalPenjualan, setTotalPenjualan] = useState(0);
  const [totalTransaksi, setTotalTransaksi] = useState(0);
  const [totalPembayaran, setTotalPembayaran] = useState(0);
  const [showPopupEkspor, setShowPopupEkspor] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [showAll, setShowAll] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [filterMode, setFilterMode] = useState<"date" | "month">("date");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  useEffect(() => {
    const transaksiDariStorage = localStorage.getItem("transaksi");
    let parsedTransactions: any[] = [];

    if (transaksiDariStorage !== null) {
      try {
        parsedTransactions = JSON.parse(transaksiDariStorage);
      } catch (error) {
        console.error("Error parsing transactions:", error);
        parsedTransactions = [];
      }
    }

    const formattedTransactions = parsedTransactions.map((trx) => {
      const waktuOrder = new Date(trx.waktuOrder);
      return {
        ...trx,
        tanggal: waktuOrder.toISOString().split("T")[0],
        bulan: waktuOrder.toISOString().slice(0, 7), // YYYY-MM
      };
    });

    let filteredBy;
    if (showAll) {
      filteredBy = formattedTransactions;
    } else if (filterMode === "month" && selectedMonth) {
      filteredBy = formattedTransactions.filter((trx) => trx.bulan === selectedMonth);
    } else {
      filteredBy = formattedTransactions.filter((trx) => trx.tanggal === selectedDate);
    }

    setFilteredData(filteredBy);

    setCurrentPage(1);

    const totalSales = filteredBy.reduce((sum, trx) => sum + trx.total, 0);
    setTotalPenjualan(totalSales);
    setTotalTransaksi(filteredBy.length);
    setTotalPembayaran(totalSales);
  }, [selectedDate, selectedMonth, showAll, filterMode]);

  const handleExport = (format: string) => {
    console.log(`Export dalam format: ${format}`);
  };

  const monthOptions = [
    "2025-01", "2025-02", "2025-03", "2025-04", "2025-05",
    "2025-06", "2025-07", "2025-08", "2025-09", "2025-10",
    "2025-11", "2025-12"
  ];

  return (
    <MainLayout>
      <div className="flex flex-col h-screen">
        <div className="flex items-center justify-between p-6">
          <h1 className="text-2xl font-bold">Laporan Transaksi</h1>
          <UserProfile />
        </div>

        <div className="flex flex-wrap gap-6 items-center px-6 mb-4">
          <div className="flex items-center gap-2">
            <label className="text-lg font-semibold">Mode Filter:</label>
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value as "date" | "month")}
              className="p-2 border rounded-lg"
            >
              <option value="date">Per Tanggal</option>
              <option value="month">Per Bulan</option>
            </select>
          </div>

          {filterMode === "date" && (
            <div className="flex items-center gap-2">
              <label className="text-lg font-semibold">Pilih Tanggal:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="p-2 border rounded-lg"
                disabled={showAll}
              />
            </div>
          )}

          {filterMode === "month" && (
            <div className="flex items-center gap-2">
              <label className="text-lg font-semibold">Pilih Bulan:</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="p-2 border rounded-lg"
                disabled={showAll}
              >
                <option value="">-- Pilih Bulan --</option>
                {monthOptions.map((month) => (
                  <option key={month} value={month}>
                    {new Date(month + "-01").toLocaleString("id-ID", {
                      month: "long",
                      year: "numeric",
                    })}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-2">
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

        <div className="flex justify-end px-6">
          <button
            onClick={() => setShowPopupEkspor(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Image src="/icons/export.svg" alt="Export" width={20} height={20} />
            Ekspor Laporan
          </button>
        </div>

        <div className="p-6 bg-white shadow-md rounded-lg mt-4 overflow-auto max-h-[400px]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">Nomor Transaksi</th>
                <th className="p-3 text-left">Waktu Order</th>
                <th className="p-3 text-left">Waktu Bayar</th>
                <th className="p-3 text-left">Outlet</th>
                <th className="p-3 text-left">Barang</th>
                <th className="p-3 text-left">Total Penjualan (Rp.)</th>
                <th className="p-3 text-left">Metode Pembayaran</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((trx, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3">{trx.id}</td>
                    <td className="p-3">{trx.waktuOrder}</td>
                    <td className="p-3">{trx.waktuBayar}</td>
                    <td className="p-3">{trx.outlet}</td>
                    <td className="p-3">
                      {trx.barangList?.length > 0 ? (
                        <ul className="list-disc pl-4">
                          {trx.barangList.map((barang: any, i: number) => (
                            <li key={i}>
                              {barang.nama} x{barang.jumlah}
                            </li>
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
          <div className="flex justify-center mt-4 gap-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === index + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        <PopupEkspor isOpen={showPopupEkspor} onClose={() => setShowPopupEkspor(false)} onExport={handleExport} />
      </div>
    </MainLayout>
  );
};

export default Laporan;
