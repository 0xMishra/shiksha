import React from "react";
import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  return (
    <Link href="/">
      <div className=" flex items-center justify-center">
        <Image
          src={"/notebook.svg"}
          alt="logo"
          priority
          width={50}
          height={50}
        />
        <h1 className="text-xl font-semibold text-lime-900">Shiksha</h1>
      </div>
    </Link>
  );
};
