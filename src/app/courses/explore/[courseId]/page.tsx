import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { Course } from "./_components/Course";
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

  const userWithCourse = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      coursesBought: {
        where: {
          id: params.courseId,
        },
      },
      coursesCreated: {
        where: {
          id: params.courseId,
        },
      },
    },
  });

  let coursePreview = "";

  const chaptersOfThisCourse = await db.chapter.findMany({
    where: {
      courseId: params.courseId,
    },
  });

  if (chaptersOfThisCourse.length > 0) {
    if (chaptersOfThisCourse[0]) {
      coursePreview = chaptersOfThisCourse[0]?.videoUrl;
    }
  }

  let hasUserBoughtThisCourse = false;

  if (userWithCourse) {
    if (userWithCourse.coursesBought.length > 0) {
      hasUserBoughtThisCourse = true;
    }
  }

  let isUserCourseCreator = false;

  if (userWithCourse?.coursesCreated?.length) {
    isUserCourseCreator = true;
  }

  const coursePrice = course?.price ? course?.price.toString() : "0";

  return (
    <Course
      chapters={course ? course.chapters : []}
      isUserCourseCreator={isUserCourseCreator}
      courseId={params.courseId}
      courseName={course ? course.name : ""}
      hasUserBoughtThisCourse={hasUserBoughtThisCourse}
      coursePreview={coursePreview}
      coursePrice={coursePrice}
    />
  );
};

export default CourseIdPage;
