import MainLayout from "../../layouts/MainLayout";
import Image from "next/image";
import { FC, useState, useEffect } from "react";

const Profile: FC = () => {
  // 🔹 State untuk menyimpan data pengguna
  const [userData, setUserData] = useState({
    name: "Manusia",
    role: "Admin",
    email: "bajidehjedar@gmail.com",
    phone: "+62 123-456-7890",
    address: "Purwokerto",
  });

  // 🔹 State untuk mengontrol modal edit
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState(userData);

  // 🔹 Load data dari localStorage saat pertama kali halaman dibuka
  useEffect(() => {
    const savedUserData = localStorage.getItem("userProfile");
    if (savedUserData) {
      setUserData(JSON.parse(savedUserData));
      setEditData(JSON.parse(savedUserData));
    }
  }, []);

  // 🔹 Handle perubahan input pada form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // 🔹 Simpan perubahan ke localStorage
  const handleSave = () => {
    setUserData(editData);
    localStorage.setItem("userProfile", JSON.stringify(editData));
    setIsEditOpen(false);
  };

  return (
    <MainLayout>
      <div className="p-6">
        {/* Judul Halaman */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Akun Saya</h1>

        {/* Container Profile */}
        <div className="bg-gray-100 rounded-xl p-8 relative flex flex-col items-center">
          {/* Avatar dan Tombol Edit */}
          <div className="flex justify-between items-center w-full max-w-2xl mb-4">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <Image
                src="/icons/akun.svg"
                alt="User Avatar"
                width={60}
                height={60}
                className="rounded-full border-4 border-white"
              />
              <h2 className="text-xl font-semibold text-gray-800">Akun Saya</h2>
            </div>

            {/* Tombol Edit Profil */}
            <button
              onClick={() => setIsEditOpen(true)}
              className="bg-white flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm text-gray-700 hover:bg-gray-200"
            >
              <Image src="/icons/edit.svg" alt="Edit Icon" width={16} height={16} />
              Edit Profil
            </button>
          </div>

          {/* Kartu Profile */}
          <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
            {/* Informasi User */}
            <div className="text-gray-800 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Nama</p>
                <p className="text-lg font-semibold">{userData.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role User</p>
                <p className="text-lg font-semibold">{userData.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg font-semibold">{userData.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Telepon</p>
                <p className="text-lg font-semibold">{userData.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Alamat</p>
                <p className="text-lg font-semibold">{userData.address}</p>
              </div>
            </div>

            {/* Tombol Logout di dalam Kotak Putih */}
            <div className="mt-6 flex justify-end">
              <button className="flex items-center gap-2 bg-red-100 px-6 py-3 rounded-lg shadow-sm text-red-600 hover:bg-red-200">
                <Image src="/icons/logout.svg" alt="Logout Icon" width={16} height={16} />
                Logout Aplikasi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Modal Edit Profil */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Profil</h2>
            
            {/* Form Edit */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600">Nama</label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Telepon</label>
                <input
                  type="text"
                  name="phone"
                  value={editData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Alamat</label>
                <input
                  type="text"
                  name="address"
                  value={editData.address}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            {/* 🔹 Tombol Simpan dan Batal */}
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setIsEditOpen(false)}
                className="bg-gray-200 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-600"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Profile;