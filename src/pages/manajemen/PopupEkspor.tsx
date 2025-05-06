import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

const PopupEkspor = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [format, setFormat] = useState("PDF");
  const [showSuccess, setShowSuccess] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  useEffect(() => {
    // Pastikan komponen hanya dijalankan di client-side
    if (typeof window === "undefined") return;
  }, []);

  if (!isOpen) return null;

  const handleExport = () => {
    const barangList = JSON.parse(localStorage.getItem("barangList") || "[]");

    if (format === "PDF") {
      const doc = new jsPDF();
      let y = 10;

      doc.setFontSize(12);
      doc.text("Laporan Stok Barang", 10, y);
      y += 10;

      barangList.forEach((item: { nama: string; kode: string; stok: number }, index: number) => {
        const line = `${index + 1}. ${item.nama} | Kode: ${item.kode} | Stok: ${item.stok}`;
        doc.text(line, 10, y);
        y += 10;
      });

      doc.save("stok-barang.pdf");
    } else if (format === "Excel") {
      const filteredList = barangList.map((item: { nama: string; kode: string; kategori: string; stok: number; hargaJual: number; hargaDasar: number }) => ({
        nama: item.nama,
        kode: item.kode,
        kategori: item.kategori,
        stok: item.stok,
        hargaJual: item.hargaJual,
        hargaDasar: item.hargaDasar,
      }));

      const worksheet = XLSX.utils.json_to_sheet(filteredList);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "StokBarang");
      XLSX.writeFile(workbook, "stok-barang.xlsx");
    }

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 2000);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImportError(null);

    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const importedData = XLSX.utils.sheet_to_json<{ nama: string; kode: string; kategori: string; stok: number; hargaJual: number; hargaDasar: number }>(sheet);

      // 🔍 Validasi format kolom wajib
      const isValid = importedData.every((item) =>
        item.nama &&
        item.kode &&
        item.kategori &&
        item.stok !== undefined &&
        item.hargaJual !== undefined &&
        item.hargaDasar !== undefined
      );

      if (!isValid) {
        setImportError("❌ Format salah! Pastikan semua kolom: nama, kode, kategori, stok, hargaJual, dan hargaDasar ada.");
        return;
      }

      const existingData = JSON.parse(localStorage.getItem("barangList") || "[]");
      const combinedData = [...existingData, ...importedData];

      // Hapus duplikat berdasarkan 'kode'
      const uniqueData = Array.from(
        new Map(combinedData.map(item => [item.kode, item])).values()
      );

      localStorage.setItem("barangList", JSON.stringify(uniqueData));
      setImportError(null); // hapus error jika sukses
      alert("✅ Data berhasil diimpor (tanpa duplikat).");
      onClose();
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {!showSuccess ? (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Ekspor / Import Barang</h2>
              <button onClick={onClose} className="text-gray-500 text-xl">✖</button>
            </div>

            <p className="mt-3 text-gray-600">
              Pilih format untuk ekspor, atau unggah file Excel untuk import data.
            </p>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Format Ekspor</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg mt-2"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <option value="PDF">PDF</option>
                <option value="Excel">Excel</option>
              </select>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded-lg">Batal</button>
              <button onClick={handleExport} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Ekspor
              </button>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700">Import Excel</label>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleImport}
                className="mt-2 w-full"
              />
              {importError && (
                <p className="text-red-500 text-sm mt-2">{importError}</p>
              )}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-bold mb-2">Sukses!</h2>
            <p className="text-gray-600">Laporan berhasil diekspor.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PopupEkspor;
