import React, { useState } from "react";

const PopupCash = ({ totalHarga, onClose, onSuccess }) => {
  const [inputPembayaran, setInputPembayaran] = useState("");

  const handleKonfirmasi = () => {
    const cashGiven = parseFloat(inputPembayaran) || 0;
    if (cashGiven < totalHarga) {
      alert("Uang yang diberikan kurang!");
    } else {
      const kembalian = cashGiven - totalHarga; // hitung langsung saat perlu
      setTimeout(() => {
        onSuccess(cashGiven === totalHarga ? null : kembalian);
        onClose();
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
        <h2 className="text-lg font-bold mb-3">Masukkan Uang Cash</h2>
        <input
          type="number"
          className="w-full p-2 border rounded-lg text-center"
          placeholder="Jumlah uang"
          value={inputPembayaran}
          onChange={(e) => setInputPembayaran(e.target.value)}
        />
        <button
          className="mt-4 bg-green-500 text-white p-2 rounded-lg w-full"
          onClick={handleKonfirmasi}
        >
          Konfirmasi Pembayaran
        </button>
        <button
          className="mt-2 bg-gray-300 text-black p-2 rounded-lg w-full"
          onClick={onClose}
        >
          Batal
        </button>
      </div>
    </div>
  );
};

export default PopupCash;
