import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="relative -z-20 mb-2 flex items-center justify-center bg-white text-sm lg:ml-64 ">
      <div className="fixed bottom-3 flex w-[90vw] max-w-[2000px] flex-col items-center justify-between bg-white p-2 md:left-64 md:w-[60vw] md:flex-row">
        <div>©2024 All rights reserved.</div>
        <div className="flex flex-col items-center justify-center md:flex-row md:space-x-8">
          <Link className="font-semibold" href={"/"}>
            contact
          </Link>
          <Link className="font-semibold" href={"/"}>
            privacy policy
          </Link>
        </div>
      </div>
    </footer>
  );
};
