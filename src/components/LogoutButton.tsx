"use client";
import React from "react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export const LogoutButton = () => {
  return (
    <div>
      <Button
        className="flex items-center justify-start"
        onClick={() => signOut()}
      >
        <LogOut />
        Logout
      </Button>
    </div>
  );
};
