import { Sidebar } from "@/components/Sidebar";
import type { Dispatch, SetStateAction } from "react";

export default function RenderSidebar({
  isSidebarOpen,
  setSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="relative z-10">
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
      {/* The rest of your app content */}
    </div>
  );
}
