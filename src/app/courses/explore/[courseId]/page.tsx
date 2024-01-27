import { Button } from "@/components/ui/button";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import Link from "next/link";

const CourseIdPage = async ({
  params,
}: {
  params: {
    courseId: string;
  };
}) => {
  const session = await getServerAuthSession();

  const course = await db.course.findUnique({
    where: { id: params.courseId },
  });

  const userWithCourseSold = await db.user.findUnique({
    where: { id: session?.user.id },
    include: {
      coursesCreated: {
        where: {
          id: params.courseId,
        },
      },
    },
  });

  let isUserCourseCreator = false;

  if (userWithCourseSold?.coursesCreated?.length) {
    isUserCourseCreator = true;
  }

  return (
    <section className="mt-4 flex w-[100vw] items-center justify-center p-2 md:ml-64 md:pr-72 ">
      <div className="flex w-[100%] items-center justify-between gap-2">
        <h2 className="text-2xl font-semibold">{course?.name}</h2>
        {isUserCourseCreator ? (
          <Button variant={"primary"} asChild>
            <Link href={`/courses/create/${params.courseId}/add-chapters`}>
              Add chapters
            </Link>
          </Button>
        ) : (
          <Button variant={"primary"} asChild>
            <Link href={`/`}>Browse courses</Link>
          </Button>
        )}
      </div>
    </section>
  );
};

export default CourseIdPage;
