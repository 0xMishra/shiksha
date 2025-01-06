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
      name: true,
      id: true,
      creatorId: true,
    },
  });

  if (session.user.id !== course?.creatorId) {
    redirect("/");
  }

  return (
    <div>
      <CreateChapterForm courseId={courseId} courseName={course.name} />
    </div>
  );
};

export default createChaptersPage;
