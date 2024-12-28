import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { getAuthSession } from "~/server/auth/config";
import { LogoutButton } from "./LogoutButton";

export const Navbar = async () => {
  const session = await getAuthSession();
  if (session?.user) {
    return (
      <div className="flex w-screen items-center justify-center border-b-[2px] border-solid border-gray-800 p-3">
        <div className="flex w-[90vw] max-w-[700px] items-center justify-between">
          <h1 className="bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text pl-2 pr-1 text-3xl font-black tracking-tighter text-transparent">
            Shiksha
          </h1>
          <div>
            <Avatar>
              {session?.user.image ? (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <AvatarImage src={session?.user.image} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem>
                      <LogoutButton />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : session && session.user.name ? (
                <AvatarFallback>
                  {session.user.name[0]?.toUpperCase()}
                </AvatarFallback>
              ) : (
                ""
              )}
            </Avatar>
          </div>
        </div>{" "}
      </div>
    );
  }

  return (
    <div className="flex w-screen items-center justify-center border-b-[2px] border-solid border-gray-800 p-3">
      <div className="flex w-[90vw] max-w-[700px] items-center justify-between">
        <h1 className="bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text pl-2 pr-1 text-3xl font-black tracking-tighter text-transparent">
          Shiksha
        </h1>
        <div>
          <Link
            href={"https://github.com/0xMishra"}
            target="_blank"
            className="my-3 flex items-center justify-center rounded-lg bg-gradient-to-b from-blue-400 to-blue-700 px-2 py-1 text-lg font-semibold text-white hover:bg-gray-800"
          >
            Github
          </Link>
        </div>
      </div>{" "}
    </div>
  );
};
