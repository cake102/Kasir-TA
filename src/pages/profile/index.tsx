import MainLayout from "../../layouts/MainLayout";
import Image from "next/image";
import { FC, useState, useEffect } from "react";
import { useRouter } from "next/router";

const Profile: FC = () => {
  const router = useRouter();

  const [userData, setUserData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    address: "",
    imageUrl: "",
  });

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState(userData);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!currentUser) {
      router.push("/login");
      return;
    }

    const profileKey = `userProfile-${currentUser.username}`;
    const savedData = localStorage.getItem(profileKey);

    if (savedData) {
      const parsed = JSON.parse(savedData);
      setUserData(parsed);
      setEditData(parsed);
      setImagePreview(parsed.imageUrl || null);
    }
  }, [router]); // ✅ Fixed dependency warning

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setEditData((prev) => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setUserData(editData);
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    localStorage.setItem(`userProfile-${currentUser.username}`, JSON.stringify(editData));
    setIsEditOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/login");
  };

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Akun Saya</h1>

        <div className="bg-gray-100 rounded-xl p-8 flex flex-col items-center z-0">
          <div className="flex justify-between items-center w-full max-w-2xl mb-4">
            <div className="flex items-center gap-4">
              {userData.imageUrl ? (
                <Image
                  src={userData.imageUrl}
                  alt="User Avatar"
                  width={64}
                  height={64}
                  className="rounded-full border-4 border-white object-cover"
                />
              ) : (
                <Image
                  src="/icons/akun.svg"
                  alt="User Avatar"
                  width={60}
                  height={60}
                  className="rounded-full border-4 border-white"
                />
              )}
              <h2 className="text-xl font-semibold text-gray-800">Akun Saya</h2>
            </div>

            <button
              onClick={() => setIsEditOpen(true)}
              className="bg-white flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm text-gray-700 hover:bg-gray-200"
            >
              <Image src="/icons/edit.svg" alt="Edit Icon" width={16} height={16} />
              Edit Profil
            </button>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
            <div className="text-gray-800 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Nama</p>
                <p className="text-lg font-semibold">{userData.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
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

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-100 px-6 py-3 rounded-lg shadow-sm text-red-600 hover:bg-red-200"
              >
                <Image src="/icons/logout.svg" alt="Logout Icon" width={16} height={16} />
                Logout
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
              <div>
                <label className="block text-sm text-gray-600">Foto Profil</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />
                {imagePreview && (
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={80}
                    height={80}
                    className="mt-2 object-cover rounded-full"
                  />
                )}
              </div>
            </div>

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
