import { redirect } from "next/navigation";
import React from "react";
import { getAuthSession } from "~/server/auth/config";

const authorizedRoutesLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/sign-in");
  }
  return <>{children}</>;
};

export default authorizedRoutesLayout;
