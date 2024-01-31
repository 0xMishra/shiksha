import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import Course from "./_components/Course";
import { redirect } from "next/navigation";

const CourseIdPage = async ({
  params,
}: {
  params: {
    courseId: string;
  };
}) => {
  const session = await getServerAuthSession();

  if (!session) {
    return redirect("/sign-up");
  }

  const course = await db.course.findUnique({
    where: { id: params.courseId },
    include: {
      chapters: true,
    },
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
    <Course
      chapters={course ? course.chapters : []}
      isUserCourseCreator={isUserCourseCreator}
      courseId={params.courseId}
      courseName={course ? course.name : ""}
    />
  );
};

export default CourseIdPage;
