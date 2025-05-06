import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import MainLayout from "../../layouts/MainLayout";
import UserProfile from "../../components/UserProfile";
import Image from "next/image";
import PopupSukses from "./PopupSukses";

interface Item {
  kode: string;
  nama: string;
  hargaJual: number;
  stok: number;
  jumlah: number;
}

interface Transaksi {
  id: string;
  waktuOrder: string;
  waktuBayar: string;
  outlet: string;
  barangList: Item[];
  total: number;
  metode: string;
}

const formatRupiah = (angka: string): string => {
  const numericValue = parseInt(angka.replace(/\D/g, ""), 10);
  if (isNaN(numericValue)) return "Rp 0";
  return "Rp " + numericValue.toLocaleString("id-ID");
};

const Pembayaran = () => {
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [totalHarga, setTotalHarga] = useState(0);
  const [inputPembayaran, setInputPembayaran] = useState("");
  const [metodePembayaran, setMetodePembayaran] = useState("Cash");
  const [showPopupSukses, setShowPopupSukses] = useState(false);
  const [kembalian, setKembalian] = useState<number | null>(null);
  const [lastTransaksi, setLastTransaksi] = useState<Transaksi | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [tempJumlah, setTempJumlah] = useState<Record<string, string>>({});

  useEffect(() => {
    if (router.query.data) {
      const decodedData = JSON.parse(decodeURIComponent(router.query.data as string));
      setSelectedItems(decodedData);
      setTotalHarga(Number(router.query.total));
    }
  }, [router.query]);

  const handleBayar = useCallback(() => {
    const cashGiven = parseFloat(inputPembayaran) || 0;
    if (metodePembayaran === "Cash" && cashGiven < totalHarga) {
      alert("Uang yang diberikan kurang!");
      return;
    }

    const barangList = JSON.parse(localStorage.getItem("barangList") || "[]") as Item[];
    const updatedBarangList = barangList.map((barang) => {
      const itemDibeli = selectedItems.find((item) => item.kode === barang.kode);
      if (itemDibeli) {
        return { ...barang, stok: Math.max(barang.stok - itemDibeli.jumlah, 0) };
      }
      return barang;
    });

    localStorage.setItem("barangList", JSON.stringify(updatedBarangList));

    const transaksiBaru: Transaksi = {
      id: `TRX${Date.now()}`,
      waktuOrder: new Date().toLocaleString(),
      waktuBayar: new Date().toLocaleString(),
      outlet: "Outlet 1",
      barangList: selectedItems,
      total: totalHarga,
      metode: metodePembayaran,
    };

    const transaksiSebelumnya = JSON.parse(localStorage.getItem("transaksi") || "[]");
    localStorage.setItem("transaksi", JSON.stringify([transaksiBaru, ...transaksiSebelumnya]));

    setKembalian(cashGiven - totalHarga);
    setLastTransaksi(transaksiBaru);
    setShowPopupSukses(true);
  }, [inputPembayaran, selectedItems, totalHarga, metodePembayaran]);

  const handleInput = useCallback((value: string) => {
    if (value === "C") {
      setInputPembayaran("");
    } else if (value === "Backspace" || value === "←") {
      setInputPembayaran((prev) => prev.slice(0, -1));
    } else if (value === "✔") {
      handleBayar();
    } else if (/^[0-9.]$/.test(value) || value === "00") {
      setInputPembayaran((prev) => prev + value);
    }
  }, [handleBayar]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isInputFocused || showPopupSukses) return;
      if (event.key === "Enter") {
        handleBayar();
      } else {
        handleInput(event.key);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isInputFocused, showPopupSukses, handleBayar, handleInput]);

  const handleEditJumlah = (kode: string, jumlahBaru: number) => {
    const stokTersedia = selectedItems.find(item => item.kode === kode)?.stok || 1;
    const jumlahFinal = Math.min(jumlahBaru, stokTersedia);

    if (jumlahFinal < 1) {
      handleHapusBarang(kode);
      return;
    }

    const updatedItems = selectedItems.map(item =>
      item.kode === kode ? { ...item, jumlah: jumlahFinal } : item
    );
    setSelectedItems(updatedItems);

    const total = updatedItems.reduce((acc, item) => acc + item.hargaJual * item.jumlah, 0);
    setTotalHarga(total);
  };

  const handleHapusBarang = (kode: string) => {
    const updatedItems = selectedItems.filter(item => item.kode !== kode);
    setSelectedItems(updatedItems);

    const total = updatedItems.reduce((acc, item) => acc + item.hargaJual * item.jumlah, 0);
    setTotalHarga(total);

    if (updatedItems.length === 0) {
      router.push("/transaksi");
    }
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
              {selectedItems.map((item) => (
                <li key={item.kode} className="flex justify-between items-center py-3 border-b">
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      inputMode="numeric"
                      className="w-16 p-1 border rounded text-center"
                      value={tempJumlah[item.kode] ?? item.jumlah}
                      min={1}
                      max={item.stok}
                      onFocus={(e) => {
                        setIsInputFocused(true);
                        setTempJumlah((prev) => ({
                          ...prev,
                          [item.kode]: item.jumlah.toString(),
                        }));
                        e.target.select();
                      }}
                      onChange={(e) => {
                        let val = e.target.value;
                        const parsed = parseInt(val, 10);
                        if (!isNaN(parsed)) {
                          val = Math.min(parsed, item.stok).toString();
                        }
                        setTempJumlah((prev) => ({ ...prev, [item.kode]: val }));
                      }}
                      onKeyDown={(e) => {
                        const originalJumlah = selectedItems.find(i => i.kode === item.kode)?.jumlah ?? 1;
                        const inputValue = tempJumlah[item.kode] || "";
                        const parsed = parseInt(inputValue, 10);

                        if (e.key === "Escape") {
                          e.stopPropagation();
                          if (!isNaN(parsed) && parsed !== originalJumlah && parsed >= 1) {
                            handleEditJumlah(item.kode, parsed);
                          } else {
                            setTempJumlah((prev) => ({
                              ...prev,
                              [item.kode]: originalJumlah.toString(),
                            }));
                          }
                          (e.target as HTMLInputElement).blur();
                        }

                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!isNaN(parsed) && parsed >= 1) {
                            handleEditJumlah(item.kode, parsed);
                            (e.target as HTMLInputElement).blur();
                          }
                        }
                      }}
                      onBlur={(e) => {
                        setIsInputFocused(false);
                        const val = e.target.value.trim();
                        const parsed = parseInt(val, 10);
                        if (!isNaN(parsed) && parsed >= 1) {
                          handleEditJumlah(item.kode, parsed);
                        } else {
                          setTempJumlah((prev) => ({
                            ...prev,
                            [item.kode]: item.jumlah.toString(),
                          }));
                        }
                      }}
                    />
                    <Image src="/icons/box.svg" alt={item.nama} width={40} height={40} className="rounded-md" />
                    <span className="font-semibold">{item.nama}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg">{`Rp ${(item.hargaJual * item.jumlah).toLocaleString()}`}</span>
                    <button
                      onClick={() => handleHapusBarang(item.kode)}
                      className="text-red-500 font-bold px-2 py-1 border border-red-500 rounded hover:bg-red-500 hover:text-white"
                    >
                      Hapus
                    </button>
                  </div>
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
              {formatRupiah(inputPembayaran)}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {["1", "2", "3", "C", "4", "5", "6", "←", "7", "8", "9", ".", "0", "00", "✔"].map((num) => (
                <button
                  key={num}
                  onClick={() => handleInput(num)}
                  className={`w-full p-4 text-2xl font-semibold border border-gray-300 rounded-md ${
                    num === "✔" ? "bg-green-500 text-white" : "bg-gray-200"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showPopupSukses && (
        <PopupSukses
          kembalian={kembalian}
          transaksi={lastTransaksi}
          onClose={() => router.push("/transaksi")}
        />
      )}
    </MainLayout>
  );
};

export default Pembayaran;
