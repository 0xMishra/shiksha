import { getServerAuthSession } from "@/server/auth";
import { AuthButton } from "./AuthButton";
import { Logo } from "./Logo";
import { NavbarMenu } from "./NavbarMenu";
import { Searchbar } from "./Searchbar";
import { UserAccountNav } from "./UserAccountNav";

export const Navbar = async () => {
  const session = await getServerAuthSession();
  return (
    <nav className=" mt-16 flex items-center justify-center ">
      <div className="fixed top-0 mb-2 h-[60px] w-[100vw] border-b-[1px] border-solid border-b-gray-500 bg-white">
        <div className="flex w-[100vw] max-w-[2000px] items-center justify-between px-8 py-2">
          <div className="hidden md:flex">
            <Logo />
          </div>
          <NavbarMenu />
          <div className="hidden md:flex">
            <Searchbar />
          </div>
          <div>
            {session ? <UserAccountNav session={session} /> : <AuthButton />}
          </div>
        </div>
      </div>
    </nav>
  );
};
