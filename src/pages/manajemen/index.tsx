import MainLayout from "../../layouts/MainLayout";
import Image from "next/image"; // 🔹 Gunakan next/image untuk ikon
import { FC } from "react";
import { useRouter } from "next/router"; // ✅ Import useRouter
import UserProfile from "../../components/UserProfile"; // ✅ Import profil pengguna

// ✅ Definisikan TypeScript Typing untuk menu
interface MenuItem {
  title: string;
  description: string;
  iconPath: string; // Ubah ke path ikon
  link: string;
}

// ✅ Gunakan typing pada array menu
const manajemenMenu: MenuItem[] = [
  {
    title: "Data Barang / Produk",
    description: "Tambahkan barang atau jasa yang anda miliki untuk pengelolaan yang lebih akurat.",
    iconPath: "/icons/box.svg", // 🔹 Gunakan ikon SVG lokal
    link: "/manajemen/databarang",
  },
  {
    title: "Kategori Barang",
    description: "Kelola barang dengan kategori tertentu untuk memudahkan manajemen produk.",
    iconPath: "/icons/list.svg",
    link: "/manajemen/kategoribarang",
  },
  {
    title: "Stok Barang",
    description: "Kelola stok barang anda dengan mudah dan pantau stok secara real-time disini.",
    iconPath: "/icons/bullet.svg",
    link: "/manajemen/stokbarang",
  },
];

const Manajemen: FC = () => {
    const router = useRouter();
    return (
      <MainLayout>
        <div className="p-6">
          
          {/* 🔹 Baris Judul dengan Profil */}
          <div className="flex items-center justify-between">
            {/* 🔹 Bagian Kiri: Judul dan Angka */}
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Manajemen</h1>
            </div>
  
            {/* 🔹 Bagian Kanan: Profil Pengguna */}
            <UserProfile />
          </div>
  
          {/* 🔹 Garis Pembatas */}
          <div className="w-full border-b border-gray-300 mt-3 mb-6"></div>

        {/* Card Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {manajemenMenu.map((item) => (
            <div key={item.title} className="bg-white shadow-md rounded-lg p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  <a href={item.link} className="text-blue-500 hover:underline">
                    {item.title}
                  </a>
                </h2>
                 {/* 🔹 Bungkus ikon dengan div berwarna biru untuk efek background */}
                 <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-xl">
                  <Image src={item.iconPath} alt={item.title} width={24} height={24} />
                </div>
              </div>
              <p className="text-gray-600 mt-2">{item.description}</p>
              <button
                  onClick={() => router.push(item.link)} // ✅ Pindah halaman ke databarang.jsx
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full"
                >
                  Atur sekarang
                </button>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Manajemen;