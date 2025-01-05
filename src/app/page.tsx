import Link from "next/link";
import { redirect } from "next/navigation";
import { CourseCard } from "~/components/CourseCard";
import { getAuthSession } from "~/server/auth/config";
import { db } from "~/server/db";

async function HomePage() {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/sign-in");
  }
  const courses = await db.course.findMany({
    select: {
      name: true,
      image: true,
      price: true,
      id: true,
      chapters: { select: { id: true } },
      description: true,
      courseBoughtBy: {
        select: {
          id: true,
        },
        where: { id: session.user.id },
      },
      creator: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });

  const userWithCoursesCompleted = await db.user.findUnique({
    where: { id: session.user.id },
    select: { chaptersCompleted: { select: { id: true } } },
  });

  let hasBoughtCourse = false;

  if (courses.length > 0) {
    return (
      <div className="mb-10 flex h-screen w-screen items-start justify-center">
        <div className="relative top-20 grid w-[90vw] max-w-[1200px] grid-cols-1 place-items-center gap-8 p-4 pb-24 sm:grid-cols-2 md:ml-6 lg:grid-cols-3">
          {courses.map((course) => {
            const {
              id,
              description,
              name,
              image,
              price,
              creator,
              courseBoughtBy,
            } = course;

            let buyerId = courseBoughtBy.find(
              (buyer) => buyer.id === session.user.id,
            );

            if (buyerId) hasBoughtCourse = true;

            const totalChapters = course.chapters.length;

            const completedChapters = course.chapters.filter((ch2) =>
              userWithCoursesCompleted?.chaptersCompleted.some(
                (ch1) => ch1.id === ch2.id,
              ),
            ).length;

            const totalBuyers = course.courseBoughtBy.length;
            const totalRevenue = course.courseBoughtBy.length * course.price;

            const completionPercentage =
              totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

            return (
              <CourseCard
                totalBuyers={totalBuyers}
                totalRevenue={totalRevenue}
                completionPercentage={Math.floor(completionPercentage)}
                desc={description || ""}
                hasBoughtCourse={hasBoughtCourse}
                creatorId={course.creator.id}
                id={id}
                key={id}
                name={name}
                image={image}
                price={price}
                creator={creator?.name || ""}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-200">
          No courses yet
        </h1>
        <p className="mt-4 text-xl font-light text-gray-400">
          There are no courses here yet
        </p>
        <div className="mt-6 flex justify-center">
          <div className="group relative inline-block overflow-hidden rounded bg-white px-6 py-3 font-medium text-black shadow transition hover:bg-gray-800 hover:text-white">
            <span className="absolute inset-0 translate-x-full translate-y-full transform rounded-[2px] bg-blue-600 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0"></span>
            <Link href={"/courses/create"} className="relative z-10">
              Create course
            </Link>
          </div>
        </div>
        <div className="mt-8">
          <div className="text-gray-500">
            <p>
              Need help?{" "}
              <a
                href="https://github.com/0xMishra"
                target="_blank"
                className="underline hover:text-gray-200"
              >
                Contact Us
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
