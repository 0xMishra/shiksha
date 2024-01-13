"use client";

import { cn } from "@/lib/utils";
import { Compass, LayoutDashboard, Mail, X } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Logo } from "./Logo";

const links = [
  {
    id: 1,
    link: "/",
    icon: <Compass />,
    text: "Browse",
  },
  {
    id: 2,
    link: "/my-courses",
    icon: <LayoutDashboard />,
    text: "Dashboard",
  },
  {
    id: 3,
    link: "/mail",
    icon: <Mail />,
    text: "Mail",
  },
];

export const Sidebar = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const sidebarClasses = `fixed inset-y-0 z-20 left-0 transform ${
    isOpen ? "translate-x-0" : "-translate-x-full"
  } w-64 bg-white text-black p-4 transition-transform duration-300 ease-in-out`;

  return (
    <div className={cn(sidebarClasses)}>
      <Button
        onClick={onClose}
        variant="subtle"
        className="absolute right-1 h-6 w-6 rounded-md p-0"
      >
        <X aria-label="close modal" className="h-4 w-4 text-xl text-lime-900" />
      </Button>

      <div className="mt-4 flex items-start">
        <Logo />
      </div>
      <div className="mt-8 flex flex-col items-center justify-center py-2 ">
        {links.map((l) => {
          return (
            <Link
              key={l.id}
              href={l.link}
              className="my-4 flex w-[100%] items-center justify-center space-x-2 border-[1px] border-solid border-gray-800 py-2 transition-all hover:bg-lime-900  hover:text-white"
            >
              <div>{l.icon}</div>
              <p>{l.text}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
