import React, { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

// Definisikan tipe data untuk item dalam transaksi
interface Transaksi {
  waktuOrder: string;
  metode: string;
  total: number;
}

// Perbaiki tipe properti untuk PopupEkspor agar menerima 'onExport'
interface PopupEksporProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string) => void; // Properti onExport ditambahkan
}

const PopupEkspor: React.FC<PopupEksporProps> = ({
  isOpen,
  onClose,
  onExport, // Ambil props onExport
}) => {
  const [format, setFormat] = useState("PDF");
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    const transaksi: Transaksi[] = JSON.parse(localStorage.getItem("transaksi") || "[]");

    if (!transaksi.length) {
      alert("Tidak ada data untuk diekspor.");
      return;
    }

    if (format === "PDF") {
      const doc = new jsPDF();
      let y = 10;

      doc.setFontSize(14);
      doc.text("Laporan Transaksi", 10, y);
      y += 10;
      doc.setFontSize(10);

      transaksi.forEach((item: Transaksi, index: number) => {
        const detail = `${index + 1}. ${item.waktuOrder} | Metode: ${item.metode} | Total: Rp${item.total}`;
        doc.text(detail, 10, y);
        y += 8;

        if (y > 280) {
          doc.addPage();
          y = 10;
        }
      });

      doc.save("laporan-transaksi.pdf");
    } else if (format === "Excel") {
      const worksheet = XLSX.utils.json_to_sheet(transaksi);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Transaksi");
      XLSX.writeFile(workbook, "laporan-transaksi.xlsx");
    }

    // Memanggil onExport setelah ekspor selesai
    onExport(format); // Sekarang onExport dipanggil

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {!showSuccess ? (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Ekspor Laporan Transaksi</h2>
              <button onClick={onClose} className="text-gray-500 text-xl">
                ✖
              </button>
            </div>

            <p className="mt-3 text-gray-600">
              Pilih format untuk ekspor dan simpan laporan transaksi ke perangkat.
            </p>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Format Ekspor
              </label>
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
              <button
                onClick={onClose}
                className="bg-gray-300 text-black px-4 py-2 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleExport}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Ekspor
              </button>
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
