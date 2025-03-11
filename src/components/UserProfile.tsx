import Image from "next/image";
import { FaChevronDown, FaCamera, FaUserEdit, FaSignOutAlt } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router"; // ✅ Import router

const UserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter(); // ✅ Next.js Router untuk navigasi

  // 🔹 State untuk menyimpan data user dari localStorage
  const [userData, setUserData] = useState({
    name: "Manusia",
    email: "bajidehjedar@gmail.com",
  });

  // ✅ Load data user dari localStorage
  useEffect(() => {
    const savedUserData = localStorage.getItem("userProfile");
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
    }
  }, []);

  // ✅ Menutup dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center gap-3 cursor-pointer" ref={dropdownRef}>
      {/* 🔹 Foto Profil */}
      <div
        className="w-12 h-12 rounded-full overflow-hidden border border-gray-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image src="/profil.jpg" alt="User Profile" width={48} height={48} />
      </div>

      {/* 🔹 Ikon Dropdown */}
      <FaChevronDown
        className={`text-gray-500 text-lg transition-transform ${isOpen ? "rotate-180" : ""}`}
        onClick={(e) => {
          e.stopPropagation(); // 🔹 Agar klik tidak menutup dropdown langsung
          setIsOpen(!isOpen);
        }}
      />

      {/* 🔹 Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 top-14 bg-white shadow-lg rounded-xl p-5 w-64 border border-blue-500"
          onClick={(e) => e.stopPropagation()} // 🔹 Mencegah klik di dalam dropdown menutupnya
        >
          {/* ✅ Header Profil */}
          <div className="flex flex-col items-center text-center">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gray-300">
              <Image src="/profil.jpg" alt="User Profile" width={80} height={80} />
              {/* 🔹 Ikon Kamera */}
              <div className="absolute bottom-1 right-1 bg-black rounded-full p-1 cursor-pointer">
                <FaCamera className="text-white text-xs" />
              </div>
            </div>
            <h2 className="text-lg font-semibold mt-2">{userData.name}</h2>
            <p className="text-sm text-gray-500">{userData.email}</p>
          </div>

          {/* 🔹 Garis Pembatas */}
          <div className="border-t border-gray-200 my-3"></div>

          {/* ✅ Menu Aksi */}
          <div className="flex flex-col">
            <button
              onClick={() => router.push("/profile")} // ✅ Navigasi ke halaman profile
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <FaUserEdit className="text-gray-600" />
              Edit Profil
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;