"use client";
import { cn } from "@/lib/utils";
import { Compass, LayoutDashboard, SquarePen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    id: 1,
    link: "/",
    icon: <Compass />,
    text: "Browse course",
  },
  {
    id: 2,
    link: "/dashboard",
    icon: <LayoutDashboard />,
    text: "Dashboard",
  },
  {
    id: 3,
    link: "/courses/create",
    icon: <SquarePen />,
    text: "Create courses",
  },
];
const InfoSidebar = () => {
  const pathname = usePathname();
  return (
    <div
      className={
        "fixed inset-y-0 left-0 mt-[60px] hidden w-64 translate-x-0 transform border-r-[1px] border-solid border-r-gray-800 bg-white p-4 text-black transition-transform duration-300 ease-in-out md:block"
      }
    >
      <div className="mt-8 flex flex-col items-center justify-center py-2 ">
        {links.map((l) => {
          let extraClasses = "";
          if (
            l.link === pathname ||
            (l.text === "Browse course" && pathname.includes("explore")) ||
            (l.text === "Create courses" && pathname.includes("/add-chapters"))
          ) {
            extraClasses = "bg-lime-900  text-white";
          }
          return (
            <Link
              key={l.id}
              href={l.link}
              className={cn(
                "my-4 flex w-[100%] items-center justify-center space-x-2 border-[1px] border-solid border-gray-800 py-2 transition-all hover:bg-lime-900/90  hover:text-white",
                extraClasses,
              )}
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

export default InfoSidebar;
