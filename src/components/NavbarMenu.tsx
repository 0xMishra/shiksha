"use client";
import { Menu } from "lucide-react";
import RenderSidebar from "./RenderSidebar";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";

export const NavbarMenu = () => {
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleOpenSidebar = () => {
    setSidebarOpen(true);
  };

  return (
    <>
      {!pathname.includes("/explore") ? (
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
      ) : (
        <div className="md:hidden">
          <Logo />
        </div>
      )}
    </>
  );
};
