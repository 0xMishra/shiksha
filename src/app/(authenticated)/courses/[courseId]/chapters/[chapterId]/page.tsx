import { CheckIcon, CircleCheckBig } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { DeleteChapter } from "~/components/DeleteChapterActionButton";
import { MarkChapterAsComplete } from "~/components/MarkChapterAsComplete";
import { VideoRenderer } from "~/components/VideoRenderer";
import { getAuthSession } from "~/server/auth/config";
import { db } from "~/server/db";

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
      name: true,
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
          chapterCompletedBy: { select: { id: true } },
        },
        where: { id: parseInt(chapterId) },
      },
    },
  });

  let isChapterCompletedByUser: boolean =
    !!course?.chapters[0]?.chapterCompletedBy.find(
      ({ id }) => id === session.user.id,
    );

  const hasBoughtTheCourse: boolean = !!course?.courseBoughtBy.find(
    (buyer) => buyer.id === session.user.id,
  );

  if (session.user.id !== course?.creatorId && !hasBoughtTheCourse) {
    redirect("/");
  }
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <h1 className="mb-10 mt-20 text-2xl font-extrabold text-gray-200 underline sm:text-3xl md:text-4xl lg:text-5xl">
        {course?.name}
      </h1>
      <div className="w-[90vw] max-w-4xl items-center justify-center">
        {session.user.id === course?.creatorId && (
          <div className="flex w-[100%] items-center justify-between">
            <DeleteChapter chapterId={chapterId} />

            <Link
              href={`/courses/${courseId}/chapters/${chapterId}/update`}
              className="flex w-44 cursor-pointer items-center justify-center rounded-[0.5rem] bg-green-700 p-2 font-semibold text-white hover:bg-green-900"
            >
              UPDATE CHAPTER
            </Link>
          </div>
        )}
      </div>

      <VideoRenderer src={course?.chapters[0]?.video || ""} />
      <div className="mt-3 flex flex-col items-center justify-center text-3xl font-semibold">
        <h3>{course?.chapters[0]?.name}</h3>
        {hasBoughtTheCourse && (
          <div className="mt-3 flex w-[100%] items-center justify-center">
            {isChapterCompletedByUser ? (
              <div className="flex w-48 cursor-pointer items-center justify-center rounded-[0.5rem] border-[2px] border-solid border-green-700 p-2 text-lg font-semibold text-green-700">
                <CircleCheckBig className="pr-1" />
                COMPLETED
              </div>
            ) : (
              <MarkChapterAsComplete
                courseId={courseId}
                chapterId={chapterId}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default chapterPage;
