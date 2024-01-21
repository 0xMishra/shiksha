import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { type Course } from "@prisma/client";
import { CourseInfoCard } from "./CourseInfoCard";

export const CoursesBoughtInfoCard = async ({ id }: Course) => {
  const session = await getServerAuthSession();

  const userWithCoursesBought = await db.user.findUnique({
    where: {
      id: session?.user.id,
    },
    include: {
      coursesBought: {
        where: {
          id: id,
        },
      },
    },
  });

  return (
    <>
      {userWithCoursesBought?.coursesBought
        ? userWithCoursesBought.coursesBought.map((course) => (
            <CourseInfoCard key={course.id} {...course} />
          ))
        : ""}
    </>
  );
};
