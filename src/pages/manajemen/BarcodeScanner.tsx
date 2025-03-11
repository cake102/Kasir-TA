import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { FaTimes } from "react-icons/fa";

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const scannerRef = useRef<HTMLDivElement>(null);
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);
  const [daftarKamera, setDaftarKamera] = useState<MediaDeviceInfo[]>([]);
  const [kameraTerpilih, setKameraTerpilih] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isScanning, setIsScanning] = useState(true);
  const lastScannedCodeRef = useRef<string | null>(null);
  const beepSound = new Audio("/beep.mp3");
  const [scannedBarcode, setScannedBarcode] = useState("");

  // 📌 1️⃣ Dapatkan daftar kamera
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => navigator.mediaDevices.enumerateDevices())
      .then((devices) => {
        const kameraVideo = devices.filter((device) => device.kind === "videoinput");
        setDaftarKamera(kameraVideo);
        if (kameraVideo.length > 0) {
          setKameraTerpilih(kameraVideo[0].deviceId);
        }
      })
      .catch(() => setErrorMessage("Gagal mendapatkan daftar kamera. Coba berikan izin kamera."));
  }, []);

  // 📌 2️⃣ Mulai scanner kamera
  useEffect(() => {
    if (!scannerRef.current || !kameraTerpilih || !isScanning) return;

    const qrCodeScanner = new Html5Qrcode("scanner-container");

    qrCodeScanner
      .start(
        kameraTerpilih,
        { fps: 15, qrbox: { width: 400, height: 150 }, aspectRatio: 4, formatsToSupport: ["EAN_13", "UPC_A", "CODE_128"] },
        (decodedText) => {
          if (decodedText === lastScannedCodeRef.current) return;
          beepSound.play().catch(console.error);
          lastScannedCodeRef.current = decodedText;
          onScan(decodedText);
          setScannedBarcode(decodedText);
          setTimeout(() => (lastScannedCodeRef.current = null), 2000);
        },
        () => {}
      )
      .catch(() => setErrorMessage("Gagal memulai scanner. Coba ganti kamera."));

    setHtml5QrCode(qrCodeScanner);

    return () => qrCodeScanner.stop().catch(console.error);
  }, [kameraTerpilih, isScanning]);

  // 📌 3️⃣ Menangkap input dari scanner USB
  useEffect(() => {
    let barcodeBuffer = "";
    let timeout: NodeJS.Timeout;

    const handleKeydown = (event: KeyboardEvent) => {
      const key = event.key;

      // ✅ Hanya menerima angka & huruf (tanpa karakter khusus)
      if (/^[a-zA-Z0-9]$/.test(key)) {
        barcodeBuffer += key;
        console.log(`🔤 Karakter diterima: ${key}`);
      }

      // Jika tombol Enter ditekan, barcode selesai
      if (event.key === "Enter" || event.key === "Tab") {
        event.preventDefault(); // 🔥 Hindari pindah field karena Tab
        if (barcodeBuffer.length > 3) {
          console.log(`✅ Barcode lengkap: ${barcodeBuffer}`);

          // 🚀 Filter karakter tambahan
          barcodeBuffer = barcodeBuffer.trim();

          beepSound.play().catch(console.error);
          onScan(barcodeBuffer);
          setScannedBarcode(barcodeBuffer);
          barcodeBuffer = ""; // Reset buffer
        }
      }

      // Reset jika tidak ada input dalam 500ms
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        console.log("⏳ Reset buffer barcode (karena tidak ada input dalam 500ms)");
        barcodeBuffer = "";
      }, 500);
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [onScan]);

  const handleClose = () => {
    setIsScanning(false);
    onClose();
  };

  return (
    isScanning && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
        <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-xs flex flex-col justify-center relative">
          <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-800" onClick={handleClose}>
            <FaTimes className="text-lg" />
          </button>
          <h2 className="text-lg font-semibold mb-2 text-center">Pindai Barcode</h2>
          <p className="text-center text-sm">Gunakan scanner USB atau kamera</p>

          {/* Pilihan Kamera */}
          <div className="mb-2">
            <label className="text-sm font-medium block">Pilih Kamera</label>
            <select
              value={kameraTerpilih}
              onChange={(e) => setKameraTerpilih(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {daftarKamera.map((kamera, index) => (
                <option key={index} value={kamera.deviceId}>
                  {kamera.label || `Kamera ${index + 1}`}
                </option>
              ))}
            </select>
          </div>

          {/* Scanner Kamera */}
          <div id="scanner-container" ref={scannerRef} className="w-full bg-black rounded-md" style={{ height: "200px" }}></div>

          {/* Tampilkan hasil scan */}
          {scannedBarcode && (
            <div className="mt-4 p-2 bg-green-100 border border-green-400 text-center font-bold text-green-600">
              {scannedBarcode}
            </div>
          )}
        </div>
      </div>
    )
  );
};

export default BarcodeScanner;