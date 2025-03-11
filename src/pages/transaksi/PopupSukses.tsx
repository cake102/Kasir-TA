import React, { useEffect, useState } from "react";

const PopupSukses = ({ kembalian, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 300);
    }, 3000); // Animasi bertahan selama 3 detik
  }, []);

  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity ${show ? "opacity-100" : "opacity-0"}`}>
      <div className={`bg-white p-6 rounded-lg shadow-lg text-center w-80 transform transition-transform ${show ? "scale-100" : "scale-75"}`}>
        
        {/* 🔹 Ikon sukses dengan animasi */}
        <div className="flex justify-center">
          <svg className="w-16 h-16 text-green-500 animate-pulse" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>

        <h2 className="text-lg font-bold mt-3">Pembayaran Sukses!</h2>

        {kembalian !== null && (
          <p className="text-xl font-semibold text-green-600 mt-2">Kembalian: Rp {kembalian.toLocaleString()}</p>
        )}
      </div>
    </div>
  );
};

export default PopupSukses;