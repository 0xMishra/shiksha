import { redirect } from "next/navigation";
import { CourseUpdateForm } from "~/components/CourseUpdateForm";
import { getAuthSession } from "~/server/auth/config";
import { db } from "~/server/db";

const courseUpdatePage = async ({
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
      name: true,
      description: true,
      price: true,
      image: true,
    },
  });

  if (session.user.id !== course?.creatorId) {
    redirect("/");
  }

  return (
    <div>
      <CourseUpdateForm course={course} />
    </div>
  );
};

export default courseUpdatePage;
