import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import UserProfile from "../../components/UserProfile";
import Image from "next/image";
import PopupSukses from "./PopupSukses";

const Pembayaran = () => {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [totalHarga, setTotalHarga] = useState(0);
  const [inputPembayaran, setInputPembayaran] = useState("");
  const [metodePembayaran, setMetodePembayaran] = useState("Cash");
  const [showPopupSukses, setShowPopupSukses] = useState(false);
  const [kembalian, setKembalian] = useState<number | null>(null);

  useEffect(() => {
    if (router.query.data) {
      const decodedData = JSON.parse(decodeURIComponent(router.query.data));
      setSelectedItems(decodedData);
      setTotalHarga(Number(router.query.total));
    }
  }, [router.query]);

  const handleInput = (value: string) => {
    if (value === "C") {
      setInputPembayaran("");
    } else if (value === "Backspace" || value === "←") {
      setInputPembayaran((prev) => prev.slice(0, -1));
    } else if (/^[0-9.]$/.test(value)) {
      setInputPembayaran((prev) => prev + value);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      handleInput(event.key);
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handleBayar = () => {
    const cashGiven = parseFloat(inputPembayaran) || 0;
    if (metodePembayaran === "Cash" && cashGiven < totalHarga) {
      alert("Uang yang diberikan kurang!");
      return;
    }

    // 🔹 Kurangi stok barang di `localStorage`
    const barangList = JSON.parse(localStorage.getItem("barangList") || "[]");

    const updatedBarangList = barangList.map((barang: any) => {
      const itemDibeli = selectedItems.find((item: any) => item.kode === barang.kode);
      if (itemDibeli) {
        return { ...barang, stok: Math.max(barang.stok - itemDibeli.jumlah, 0) };
      }
      return barang;
    });

    // Simpan kembali data barang yang stoknya sudah berkurang
    localStorage.setItem("barangList", JSON.stringify(updatedBarangList));

    // 🔹 Simpan transaksi ke `localStorage` dengan daftar barang
    const transaksiBaru = {
      id: `TRX${Date.now()}`,
      waktuOrder: new Date().toLocaleString(),
      waktuBayar: new Date().toLocaleString(),
      outlet: "Outlet 1",
      barangList: selectedItems, // ✅ Simpan barang dalam transaksi
      total: totalHarga,
      metode: metodePembayaran,
    };

    const transaksiSebelumnya = JSON.parse(localStorage.getItem("transaksi") || "[]");
    localStorage.setItem("transaksi", JSON.stringify([transaksiBaru, ...transaksiSebelumnya]));

    setKembalian(cashGiven - totalHarga);
    setShowPopupSukses(true);
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-screen">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/transaksi")}>
            <span className="text-2xl">&larr;</span>
            <h1 className="text-2xl font-bold">Kembali</h1>
          </div>
          <UserProfile />
        </div>

        <div className="flex flex-grow p-6 gap-6">
          <div className="w-1/2 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-bold mb-3">List Barang</h2>
            <ul>
              {selectedItems.map((item: any) => (
                <li key={item.kode} className="flex justify-between items-center py-3 border-b">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold">{item.jumlah}</span>
                    <Image src="/icons/box.svg" alt={item.nama} width={40} height={40} className="rounded-md" />
                    <span className="font-semibold">{item.nama}</span>
                  </div>
                  <span className="text-lg">{`Rp ${(item.hargaJual * item.jumlah).toLocaleString()}`}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>{`Rp ${totalHarga.toLocaleString()}`}</span>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-lg font-semibold">Metode Pembayaran :</label>
              <select
                className="w-full p-2 mt-2 border border-gray-300 rounded-lg"
                value={metodePembayaran}
                onChange={(e) => setMetodePembayaran(e.target.value)}
              >
                <option>Cash</option>
                <option>QRIS</option>
              </select>
            </div>
          </div>

          <div className="w-1/2 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-lg font-bold mb-3">Pembayaran</h2>

            <div className="w-full p-3 text-xl text-center border border-gray-300 rounded-lg mb-4">
              {inputPembayaran || "Rp 0"}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {["1", "2", "3", "C", "4", "5", "6", "←", "7", "8", "9", ".", "0", "00", "000", "✔"].map((num) => (
                <button
                  key={num}
                  onClick={() => handleInput(num)}
                  className={`w-full p-4 text-2xl rounded-lg border shadow ${
                    num === "✔"
                      ? "bg-green-500 text-white"
                      : num === "C" || num === "←"
                      ? "bg-red-500 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <button
              onClick={handleBayar}
              className="w-full mt-4 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
            >
              Bayar
            </button>
          </div>
        </div>
      </div>

      {showPopupSukses && <PopupSukses kembalian={kembalian} onClose={() => router.push("/laporan")} />}
    </MainLayout>
  );
};

export default Pembayaran;