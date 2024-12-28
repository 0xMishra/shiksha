import { redirect } from "next/navigation";
import { getAuthSession } from "~/server/auth/config";

async function HomePage() {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/sign-in");
  }
  return (
    <div>
      <div></div>
    </div>
  );
}

export default HomePage;
