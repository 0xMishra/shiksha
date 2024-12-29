import { getAuthSession } from "~/server/auth/config";
import { Sidebar } from "./Sidebar";

export const SidebarRenderer = async () => {
  const session = await getAuthSession();
  return <div>{session?.user ? <Sidebar /> : ""}</div>;
};
