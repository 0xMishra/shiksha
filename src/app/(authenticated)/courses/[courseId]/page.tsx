import { Chapter } from "@prisma/client";
import { Pick } from "@prisma/client/runtime/library";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChapterCard } from "~/components/ChapterCard";
import { Button } from "~/components/ui/button";
import { getAuthSession } from "~/server/auth/config";
import { db } from "~/server/db";

const chaptersPage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const { courseId } = await params;

  const course = await db.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      creatorId: true,
      courseBoughtBy: {
        select: {
          id: true,
        },
      },
      chapters: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  const hasBoughtTheCourse = course?.courseBoughtBy.find(
    (buyer) => buyer.id === session.user.id,
  );

  if (session.user.id !== course?.creatorId && !hasBoughtTheCourse) {
    redirect("/");
  }

  if (course && course?.chapters.length > 0) {
    return (
      <div className="mb-10 mt-20 flex h-screen w-screen flex-col items-center justify-start">
        {session.user.id === course?.creatorId ? (
          <div className="relative top-4 grid w-[90vw] max-w-[1200px] p-4 pl-4 md:pl-8">
            <Link
              href={`/courses/${course.id}/chapters/create`}
              className="relative z-10 my-2"
            >
              <Button variant={"white"}>Add chapters</Button>
            </Link>
          </div>
        ) : (
          ""
        )}
        <div className="relative top-4 grid w-[90vw] max-w-[1200px] grid-cols-1 place-items-center gap-8 p-4 pb-24 sm:grid-cols-2 md:ml-6 lg:grid-cols-3">
          {course?.chapters.map(
            (chapter: Pick<Chapter, "id" | "name" | "image">) => {
              const { id, name, image } = chapter;
              return (
                <ChapterCard
                  courseId={course?.id || ""}
                  id={id}
                  key={id}
                  name={name}
                  image={image}
                />
              );
            },
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-200">
          No chapters yet
        </h1>
        <p className="mt-4 text-xl font-light text-gray-400">
          There are no chapters for this course yet
        </p>
        <div className="mt-6 flex justify-center">
          <div className="group relative inline-block overflow-hidden rounded bg-white px-6 py-3 font-medium text-black shadow transition hover:bg-gray-800 hover:text-white">
            <span className="absolute inset-0 translate-x-full translate-y-full transform rounded-[2px] bg-blue-600 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0"></span>
            {session.user.id === course?.creatorId ? (
              <Link
                href={`/courses/${course.id}/chapters/create`}
                className="relative z-10"
              >
                Add a chapter
              </Link>
            ) : (
              <Link href={"/"} className="relative z-10">
                Browse other courses
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default chaptersPage;
