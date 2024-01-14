"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Notebook } from "lucide-react";
import { type Session } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Icons } from "./Icons";

export const UserAccountNav = ({ session }: { session: Session }) => {
  const router = useRouter();
  const signOutWithGoogle = async () => {
    try {
      await signOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt="profile image"
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <Icons.user />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="relative -top-2 mr-16">
          <DropdownMenuLabel className="text-lg">
            {session.user.name}
          </DropdownMenuLabel>
          <DropdownMenuLabel className="relative -top-4 text-sm text-gray-700">
            {session.user.email}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-lg font-semibold text-gray-600"
            onClick={() => router.push("/dashboard")}
          >
            <div className="flex items-center ">
              <Notebook className="text-gray-600" />
              <div
                onClick={() => signOutWithGoogle()}
                className=" relative -top-1 ml-2 text-center text-lg "
              >
                my courses
              </div>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => signOutWithGoogle()}
            className="text-lg font-semibold text-gray-600"
          >
            <LogOut className=" text-gray-600" />
            <div className=" relative -top-1 ml-2 cursor-pointer text-center  ">
              sign out
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
