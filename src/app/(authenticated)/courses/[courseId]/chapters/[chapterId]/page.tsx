import { redirect } from "next/navigation";
import React from "react";
import { getAuthSession } from "~/server/auth/config";
import { db } from "~/server/db";
import { VideoRenderer } from "~/components/VideoRenderer";

const chapterPage = async ({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) => {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/sign-in");
  }

  const { courseId, chapterId } = await params;

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
          name: true,
          video: true,
        },
        where: { id: parseInt(chapterId) },
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
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <VideoRenderer src={course?.chapters[0]?.video || ""} />
      <div className="mt-3 flex items-center justify-start text-3xl font-semibold">
        <h3>{course?.chapters[0]?.name}</h3>
      </div>
    </div>
  );
};

export default chapterPage;
