"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

export const AuthButton = () => {
  const pathname = usePathname();
  if (pathname === "/sign-in") {
    return (
      <Button variant={"primary"} size={"sm"} asChild>
        <Link href={"/sign-up"}>sign up</Link>
      </Button>
    );
  }
  return (
    <Button variant={"primary"} size={"sm"} asChild>
      <Link href={"/sign-in"}>login</Link>
    </Button>
  );
};
