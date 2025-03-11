import { ReactNode } from "react";
import Sidebar from "../components/sidebar";

// ✅ Definisikan tipe props dengan TypeScript
interface MainLayoutProps {
  children: ReactNode;
}

// ✅ Gunakan React.FC untuk keamanan typing
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex w-full h-screen"> {/* ✅ Pastikan full layar */}
      <Sidebar />
      <main className="flex-1 w-full h-full overflow-auto p-4"> {/* ✅ Tambahkan h-full & w-full */}
        {children}
      </main>
    </div>
  );
};

export default MainLayout;