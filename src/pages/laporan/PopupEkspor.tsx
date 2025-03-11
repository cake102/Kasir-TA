import React, { useState } from "react";

const PopupEkspor = ({ isOpen, onClose, onExport }) => {
  const [format, setFormat] = useState("PDF");
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    onExport(format);
    setShowSuccess(true);

    // Tutup popup sukses setelah 2 detik
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        {!showSuccess ? (
          <>
            {/* Popup Konfirmasi Ekspor */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold">Ekspor Laporan Transaksi</h2>
              <button onClick={onClose} className="text-gray-500 text-xl">✖</button>
            </div>
            <p className="mt-3 text-gray-600">
              Rekap transaksi akan diekspor dalam format yang dipilih dan disimpan di perangkat. Lanjutkan?
            </p>

            {/* Dropdown format */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Pilih Format</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg mt-2"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <option>PDF</option>
                <option>Excel</option>
              </select>
            </div>

            {/* Tombol aksi */}
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded-lg">Batal</button>
              <button onClick={handleExport} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Ya, Lanjutkan
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Popup Sukses Ekspor */}
            <div className="flex justify-between">
              <h2 className="text-lg font-bold">Ekspor Laporan Transaksi</h2>
              <button onClick={onClose} className="text-gray-500 text-xl">✖</button>
            </div>
            <p className="mt-3 text-gray-600">Laporan berhasil diekspor.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PopupEkspor;