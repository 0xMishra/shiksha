import { AddChaptersToCourseForm } from "@/components/AddChaptersToCourseForm";
import { Button } from "@/components/ui/button";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import Link from "next/link";
import { redirect } from "next/navigation";

const AddChaptersPage = async ({
  params,
}: {
  params: {
    courseId: string;
  };
}) => {
  const session = await getServerAuthSession();

  const course = await db.course.findUnique({
    where: { id: params.courseId },
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

  if (!userWithCourseSold?.coursesCreated?.length) {
    return redirect("/");
  }

  return (
    <section className=" mt-4 flex w-[100vw] flex-col items-center justify-center p-2 md:ml-64 md:pr-72 ">
      <div className="flex w-[100%] items-center justify-center gap-2">
        <h2 className="text-2xl font-semibold">{course?.name}</h2>
      </div>

      <div className="w-[100%]">
        <AddChaptersToCourseForm courseId={params.courseId} />
      </div>
    </section>
  );
};

export default AddChaptersPage;
