"use client";
import {
  House,
  NotepadText,
  PanelsTopLeft,
  SquareChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const path = usePathname();

  return (
    <div>
      <div
        className={`bottom-0 z-50 hidden flex-col items-center border-solid border-gray-800 bg-accent text-white transition-all duration-300 ease-in-out md:fixed md:left-0 md:top-0 md:flex md:items-start md:border-r-[2px] ${
          isExpanded ? "h-16 w-56 md:h-full" : "h-16 w-16 md:h-full"
        }`}
      >
        <nav
          className={`mt-4 flex w-[100%] flex-row items-center space-y-4 md:flex-col md:items-start ${
            isExpanded ? "opacity-100" : "opacity-0 md:opacity-100"
          } transition-opacity duration-300`}
        >
          {[
            {
              icon: <PanelsTopLeft />,
              label: "Menu",
              currenthPath: "",
              link: "menu",
            },
            {
              icon: <House />,
              label: "Home",
              currenthPath: path,
              link: "/",
            },
            {
              icon: <NotepadText />,
              label: "Create course",
              currenthPath: path,
              link: "/courses/create",
            },
            {
              icon: <SquareChevronRight />,
              label: "Dashboard",
              currenthPath: path,
              link: "/dashboard",
            },
          ].map((item, index) => (
            <Link
              href={index === 0 ? path : item.link}
              key={index}
              onClick={() => {
                index === 0 ? setIsExpanded(!isExpanded) : null;
              }}
              className={`flex w-full cursor-pointer items-center space-x-3 rounded-lg px-4 py-2 ${item.currenthPath === item.link ? "bg-blue-600/15 text-blue-500" : "text-white"} hover:bg-blue-600/15`}
            >
              {index === 0 ? (
                <span className="cursor-pointer text-2xl md:my-4">
                  {item.icon}
                </span>
              ) : (
                <span className="cursor-pointer text-2xl md:my-4">
                  {item.icon}
                </span>
              )}
              {isExpanded && (
                <span className="text-sm md:text-base">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      <div className="fixed bottom-0 z-20 flex w-screen items-center justify-center border-t-[2px] border-solid border-gray-800 bg-accent text-center md:hidden">
        <nav
          className={`flex w-[100%] items-center justify-around p-2 sm:grid sm:grid-cols-3 sm:gap-5`}
        >
          {[
            {
              icon: <House />,
              label: "Home",
              currenthPath: path,
              link: "/",
            },
            {
              icon: <NotepadText />,
              label: "Create course",
              currenthPath: path,
              link: "/courses/create",
            },
            {
              icon: <SquareChevronRight />,
              label: "Dashboard",
              currenthPath: path,
              link: "/dashboard",
            },
          ].map((item, index) => (
            <Link
              href={item.link}
              key={index}
              className={`flex w-full cursor-pointer items-center justify-center rounded-lg p-2 ${item.currenthPath === item.link ? "text-blue-500" : "text-white"}`}
            >
              <span
                className={`cursor-pointer text-4xl ${item.currenthPath === item.link ? "bg-blue-600/15 sm:bg-accent" : ""} p-2`}
              >
                {item.icon}
              </span>
              <span className="hidden pl-1 text-lg sm:flex md:text-base">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
