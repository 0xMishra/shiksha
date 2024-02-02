import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { type Course } from "@prisma/client";
import { CourseInfoCard } from "./CourseInfoCard";

export const CoursesSoldInfoCard = async ({ id }: Course) => {
  const session = await getServerAuthSession();
  const userWithCoursesSold = await db.user.findUnique({
    where: {
      id: session?.user.id,
    },
    include: {
      coursesCreated: {
        where: {
          id: id,
        },
      },
    },
  });

  return (
    <>
      {userWithCoursesSold?.coursesCreated
        ? userWithCoursesSold?.coursesCreated.map((course) => (
            <CourseInfoCard key={course.id} {...course} />
          ))
        : ""}
    </>
  );
};
