import Link from "next/link";
import { redirect } from "next/navigation";
import { CreateReviewForm } from "~/components/CreateReviewForm";
import { ReviewSection } from "~/components/ReviewSection";
import { getAuthSession } from "~/server/auth/config";
import { db } from "~/server/db";

const reviewsPage = async ({
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
      courseBoughtBy: { select: { id: true } },
      creatorId: true,
      reviews: {
        select: {
          id: true,
          text: true,
          ratings: true,
          creator: { select: { name: true, image: true, email: true } },
        },
      },
      id: true,
      name: true,
    },
  });

  const isUserTheCourseCreator = session.user.id === course?.creatorId;
  const hasUserBoughtTheCourse: boolean = !!course?.courseBoughtBy.find(
    (buyer) => buyer.id === session.user.id,
  );

  return (
    <div>
      {isUserTheCourseCreator || !hasUserBoughtTheCourse ? (
        ""
      ) : (
        <CreateReviewForm
          courseId={courseId}
          courseName={course?.name!}
          creatorId={session.user.id}
        />
      )}
      {course?.reviews.length === 0 ? (
        <div
          className={`${isUserTheCourseCreator || !hasUserBoughtTheCourse ? "mt-24" : "mt-16"} flex w-screen items-center justify-center bg-black text-white`}
        >
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-200">
              No reviews
            </h1>
            <p className="mt-4 text-xl font-light text-gray-400">
              There are no reviews for this course yet
            </p>
            <div className="mt-6 flex justify-center">
              <div className="group relative inline-block overflow-hidden rounded bg-white px-6 py-3 font-medium text-black shadow transition hover:bg-gray-800 hover:text-white">
                <span className="absolute inset-0 translate-x-full translate-y-full transform rounded-[2px] bg-blue-600 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0"></span>
                <Link href={"/"} className="relative z-10">
                  Browse other courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`${isUserTheCourseCreator ? "mt-24" : "mt-10"} mb-28`}>
          {course?.reviews.map((review) => {
            const { id, creator } = review;
            return (
              <ReviewSection
                key={id}
                review={{ ...review }}
                user={{
                  image: creator.image!,
                  name: creator.name!,
                  email: creator.email!,
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default reviewsPage;
