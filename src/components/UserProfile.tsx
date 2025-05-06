import Image from "next/image";
import { FaChevronDown, FaCamera, FaUserEdit } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";

const UserProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [userData, setUserData] = useState({
    name: "Pengguna",
    email: "",
    imageUrl: "",
  });

  useEffect(() => {
    const currentUserRaw = localStorage.getItem("currentUser");
    if (currentUserRaw) {
      const currentUser = JSON.parse(currentUserRaw);
      const profileKey = `userProfile-${currentUser.username}`;
      const profileDataRaw = localStorage.getItem(profileKey);

      if (profileDataRaw) {
        const profileData = JSON.parse(profileDataRaw);
        setUserData({
          name: profileData.name || currentUser.username,
          email: profileData.email || `${currentUser.username}@example.com`,
          imageUrl: profileData.imageUrl || "",
        });
      } else {
        // Fallback jika tidak ada data profile
        setUserData({
          name: currentUser.username,
          email: `${currentUser.username}@example.com`,
          imageUrl: "",
        });
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center gap-3 cursor-pointer" ref={dropdownRef}>
      {/* ✅ Foto Profil Mini */}
      <div
        className="w-12 h-12 rounded-full overflow-hidden border border-gray-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        {userData.imageUrl ? (
          <img src={userData.imageUrl} alt="User Profile" className="w-full h-full object-cover" />
        ) : (
          <Image src="/profil.jpg" alt="Default Profile" width={48} height={48} />
        )}
      </div>

      {/* Ikon Dropdown */}
      <FaChevronDown
        className={`text-gray-500 text-lg transition-transform ${isOpen ? "rotate-180" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      />

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 top-14 bg-white shadow-lg rounded-xl p-5 w-64 border border-blue-500"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ✅ Header Profil */}
          <div className="flex flex-col items-center text-center">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gray-300">
              {userData.imageUrl ? (
                <img src={userData.imageUrl} alt="User Profile" className="w-full h-full object-cover" />
              ) : (
                <Image src="/profil.jpg" alt="Default Profile" width={80} height={80} />
              )}
              <div className="absolute bottom-1 right-1 bg-black rounded-full p-1 cursor-pointer">
                <FaCamera className="text-white text-xs" />
              </div>
            </div>
            <h2 className="text-lg font-semibold mt-2">{userData.name}</h2>
            <p className="text-sm text-gray-500">{userData.email}</p>
          </div>

          <div className="border-t border-gray-200 my-3"></div>

          <div className="flex flex-col">
            <button
              onClick={() => router.push("/profile")}
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
