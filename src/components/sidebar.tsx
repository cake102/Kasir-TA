import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { FC } from "react";

// ✅ Definisikan tipe untuk menu item
interface MenuItem {
  name: string;
  iconPath: string;
  path: string;
  logout?: boolean;
}

// ✅ Sidebar sebagai React.FC
const Sidebar: FC = () => {
  const router = useRouter();
  const [active, setActive] = useState<string>(router.pathname);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setActive(router.pathname);
  }, [router.pathname]);

  const menuItems: MenuItem[] = [
    { name: "Manajemen", iconPath: "/icons/manajemen.svg", path: "/manajemen" },
    { name: "Transaksi", iconPath: "/icons/transaksi.svg", path: "/transaksi" },
    { name: "Laporan", iconPath: "/icons/laporan.svg", path: "/laporan" },
    { name: "Akun Saya", iconPath: "/icons/akun.svg", path: "/profile" },
    { name: "Keluar", iconPath: "/icons/logout.svg", path: "/login", logout: true },
  ];

  // ✅ Fungsi Logout
  const handleLogout = () => {
    localStorage.removeItem("currentUser"); // Hapus user yang sedang login
    router.push("/login"); // Arahkan ke halaman login
  };

  return (
    <div className="relative">
      {/* ✅ Overlay Transparan Saat Hover */}
      {isHovered && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-30 transition-opacity duration-300"
          onMouseEnter={() => setIsHovered(false)}
        ></div>
      )}

      {/* ✅ Sidebar */}
      <div
        className={`h-screen bg-white shadow-md flex flex-col items-center py-5 font-poppins transition-all duration-300 relative z-10 ${
          isHovered ? "w-64" : "w-20"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* ✅ Logo */}
        <div className="flex flex-col items-center justify-center">
          <Image src="/logo.svg" alt="Kasir" width={40} height={40} />
          {isHovered && <span className="text-gray-600 text-sm font-semibold mt-2">Toko Aya</span>}
        </div>

        {/* ✅ Teks "MAIN" */}
        <div className="w-full px-4 mt-6 flex items-center justify-center">
          <span className={`text-gray-500 text-sl uppercase ${isHovered ? "text-sm" : "text-[13px]"}`}>
            MAIN
          </span>
        </div>

        {/* ✅ Menu Navigation */}
        <nav className="flex flex-col items-center justify-center flex-grow gap-6 w-full">
          {menuItems.slice(0, 4).map((item) => (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-center justify-center w-full py-3 px-4 transition-all text-gray-500"
            >
              <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${
                active.startsWith(item.path) ? "bg-blue-200" : ""
              }`}>
                <Image src={item.iconPath} alt={item.name} width={24} height={24} />
              </div>
              {isHovered && <span className="text-xs text-center">{item.name}</span>}
            </button>
          ))}
        </nav>

        {/* ✅ Garis Pembatas Kedua */}
        <div className="w-full flex justify-center">
          <div className="w-3/4 border-t border-gray-300 my-2"></div>
        </div>

        {/* ✅ Tombol Logout */}
        <div className="mt-auto flex flex-col items-center w-full pb-6">
          <button
            onClick={handleLogout} // ✅ Logout dengan menghapus user dari localStorage
            className="flex flex-col items-center justify-center w-full py-3 px-4 transition-all text-gray-500"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-red-200">
              <Image src="/icons/logout.svg" alt="Keluar" width={24} height={24} />
            </div>
            {isHovered && <span className="text-xs text-center">Keluar</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;