"use client";
import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "~/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { useRouter } from "next/navigation";

export const UserAuthButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const signInToGoogle = async () => {
    setIsLoading(true);
    try {
      await signIn("google");
      toast({
        title: "Successfully signed up",
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: `${error}`,
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => router.push("/sign-in")}
          >
            Try again
          </ToastAction>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-[100%] items-center justify-center p-2">
      <Button
        onClick={signInToGoogle}
        className="my-3 flex w-[70%] items-center justify-center rounded-lg bg-gradient-to-b from-blue-400 to-blue-700 px-2 py-1 text-lg font-semibold text-white hover:bg-gray-800"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <div className="flex items-center justify-center">
            <FaGoogle />
            <span className="pl-2">sign in to google</span>
          </div>
        )}
      </Button>
    </div>
  );
};
