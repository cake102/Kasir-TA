import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Manajemen from "./manajemen"; // ✅ Pastikan path benar

function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      router.push("/login"); // 🔹 Arahkan ke login jika belum login
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // 🔹 Loading sementara sebelum menentukan akses
  if (!isAuthenticated) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return <Manajemen />;
}

export default Home;