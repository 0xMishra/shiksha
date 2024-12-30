import { redirect } from "next/navigation";
import React from "react";
import { CreateChapterForm } from "~/components/CreateChapterForm";
import { getAuthSession } from "~/server/auth/config";
import { db } from "~/server/db";

const createChaptersPage = async ({
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

  return (
    <div>
      <CreateChapterForm courseId={courseId} />
    </div>
  );
};

export default createChaptersPage;
