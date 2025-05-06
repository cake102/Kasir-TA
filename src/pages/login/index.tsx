import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

// Definisikan tipe untuk User
type User = {
  username: string;
  password: string;
  role: string;
};

const Login = () => {
  const router = useRouter();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const existingUsers: User[] = JSON.parse(localStorage.getItem("users") || "[]");
      if (existingUsers.length === 0) {
        localStorage.setItem(
          "users",
          JSON.stringify([
            { username: "admin", password: "admin123", role: "Owner" },
            { username: "staff", password: "staff123", role: "Staff" },
          ])
        );
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u: User) => u.username === username && u.password === password
    );

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));

      const profileKey = `userProfile-${user.username}`;
      if (!localStorage.getItem(profileKey)) {
        const defaultProfile = {
          name: user.username,
          role: user.role,
          email: `${user.username}@example.com`,
          phone: "",
          address: "",
          imageUrl: "",
        };
        localStorage.setItem(profileKey, JSON.stringify(defaultProfile));
      }

      router.push("/");
    } else {
      setError("Username atau Password salah!");
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-col">
      <div className="p-6 absolute top-0 left-0 flex items-center gap-2">
        <Image src="/icons/icon.svg" alt="Logo" width={150} height={100} />
      </div>

      <div className="h-full flex items-center justify-center">
        <div className="flex w-full max-w-5xl">
          <div className="w-1/2 flex items-center justify-center">
            <Image src="/icons/gambar.svg" alt="Login" width={350} height={350} />
          </div>

          <div className="w-1/2 px-12 flex flex-col justify-center">
            <h2 className="text-2xl font-bold">Masuk ke Akun Anda</h2>
            <p className="text-gray-500 text-sm">Kamu dapat masuk sebagai owner ataupun staf</p>

            <form onSubmit={handleLogin} className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full p-3 border rounded-lg bg-gray-100"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full p-3 border rounded-lg bg-gray-100"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
