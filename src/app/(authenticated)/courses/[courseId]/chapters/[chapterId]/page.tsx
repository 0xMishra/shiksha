import { CircleCheckBig } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChaptersListSidebar } from "~/components/ChaptersListSidbar";
import { CommentSection } from "~/components/CommentSection";
import { CreateCommentForm } from "~/components/CreateCommentForm";
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
          comments: {
            select: {
              id: true,
              text: true,
              creator: { select: { name: true, image: true, email: true } },
            },
          },
          name: true,
          video: true,
          chapterCompletedBy: { select: { id: true } },
        },
        where: { id: parseInt(chapterId) },
      },
    },
  });

  const allChapters = await db.chapter.findMany({
    where: { courseId: courseId },
    select: { id: true, name: true, courseId: true },
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
    <div className="mt-20 flex w-screen flex-col items-center justify-center">
      <h1 className="mb-10 text-2xl font-extrabold text-gray-200 sm:text-3xl md:text-4xl lg:text-5xl">
        {course?.name}
      </h1>

      <div className="w-[90vw] max-w-4xl items-center justify-center">
        {session.user.id === course?.creatorId && (
          <div className="flex w-[100%] items-center justify-between">
            <DeleteChapter chapterId={chapterId} />

            <Link
              href={`/courses/${courseId}/chapters/${chapterId}/update`}
              className="transform cursor-pointer rounded-full bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 px-5 py-2 text-white shadow-lg transition-all duration-300 hover:scale-105"
            >
              Update
            </Link>
          </div>
        )}
      </div>

      <div className="w-[90vw] max-w-4xl items-center justify-center">
        {hasBoughtTheCourse && (
          <div className="mt-3 flex w-[100%] items-center justify-between">
            {isChapterCompletedByUser ? (
              <div className="flex transform items-center justify-center rounded-full border-[2px] border-solid border-green-600 bg-transparent px-5 py-1 font-semibold text-green-600 shadow-lg transition-all duration-300 hover:scale-105">
                <CircleCheckBig className="pr-1" />
                Completed
              </div>
            ) : (
              <MarkChapterAsComplete
                courseId={courseId}
                chapterId={chapterId}
              />
            )}
            <ChaptersListSidebar chapters={allChapters} />
          </div>
        )}
      </div>

      <VideoRenderer src={course?.chapters[0]?.video || ""} />
      <h3 className="text-3xl font-semibold">{course?.chapters[0]?.name}</h3>
      <CreateCommentForm
        chapterId={chapterId}
        courseId={courseId}
        creatorId={session.user.id}
      />

      <div className={`pb-28`}>
        {course?.chapters[0]?.comments.map((comment) => {
          const { id, creator, text } = comment;
          return (
            <CommentSection
              key={id}
              comment={{ id, text }}
              user={{
                image: creator?.image!,
                name: creator?.name!,
                email: creator?.email!,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default chapterPage;
