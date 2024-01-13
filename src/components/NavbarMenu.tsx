"use client";
import { Menu } from "lucide-react";
import RenderSidebar from "./RenderSidebar";
import { useState } from "react";

export const NavbarMenu = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleOpenSidebar = () => {
    setSidebarOpen(true);
  };

  return (
    <div>
      <div className="md:hidden">
        <RenderSidebar
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>
      <div className=" md:hidden">
        <Menu
          size={30}
          className="cursor-pointer"
          onClick={handleOpenSidebar}
        />
      </div>
    </div>
  );
};
