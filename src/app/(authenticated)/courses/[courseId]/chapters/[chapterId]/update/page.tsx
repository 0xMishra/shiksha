import { redirect } from "next/navigation";
import { ChapterUpdateForm } from "~/components/ChapterUpdateForm";
import { getAuthSession } from "~/server/auth/config";
import { db } from "~/server/db";

const chapterUpdatePage = async ({
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
      name: true,
      creatorId: true,
      chapters: {
        select: {
          name: true,
          description: true,
          image: true,
          video: true,
        },
        where: { id: parseInt(chapterId) },
      },
    },
  });

  if (session.user.id !== course?.creatorId) {
    redirect("/");
  }

  return (
    <div>
      <ChapterUpdateForm
        chapter={course.chapters[0]!}
        chapterId={chapterId}
        courseId={courseId}
        courseName={course.name}
      />
    </div>
  );
};

export default chapterUpdatePage;
