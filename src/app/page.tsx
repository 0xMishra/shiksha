import { redirect } from "next/navigation";
import { CourseCard } from "~/components/CourseCard";
import { getAuthSession } from "~/server/auth/config";

async function HomePage() {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/sign-in");
  }
  return (
    <div className="flex h-screen w-screen items-start justify-center">
      <div className="relative top-20 grid w-[90vw] max-w-[900px] grid-cols-1 gap-8 p-4 sm:grid-cols-2 lg:grid-cols-3">
        <CourseCard />
      </div>
    </div>
  );
}

export default HomePage;
