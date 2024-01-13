import { Logo } from "@/components/Logo";
import { Compass, LayoutDashboard, Mail } from "lucide-react";
import Link from "next/link";

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
const InfoSidebar = () => {
  return (
    <div
      className={
        "fixed inset-y-0 left-0 top-[67px] z-20 hidden w-64 translate-x-0 transform border-r-[1px] border-solid border-r-gray-800 bg-white p-4 text-black transition-transform duration-300 ease-in-out md:block"
      }
    >
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

export default InfoSidebar;
