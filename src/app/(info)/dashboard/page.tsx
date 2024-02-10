import { CoursesBoughtInfoCard } from "@/components/CoursesBoughtInfoCard";
import { CoursesSoldInfoCard } from "@/components/CoursesSoldInfoCard";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { CheckCircle, Clock4, DollarSign, NotebookPen } from "lucide-react";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const session = await getServerAuthSession();

  if (!session) {
    return redirect("/sign-up");
  }

  const courses = await db.course.findMany();

  const userWithCoursesSold = await db.user.findUnique({
    where: { id: session?.user.id },
    include: {
      coursesCreated: {
        where: {
          creator: session?.user,
        },
      },
      coursesBought: {
        include: {
          chapters: true,
        },
      },
      chaptersCompleted: {
        include: {
          course: true,
        },
      },
    },
  });

  const coursesSoldByUser = await db.course.findMany({
    where: {
      creatorId: session.user.id,
    },
    include: {
      boughtBy: true,
    },
  });

  let revenueMade = 0;

  if (coursesSoldByUser.length > 0) {
    coursesSoldByUser.forEach((course) => {
      revenueMade += course.price * course.boughtBy.length;
    });
  }

  let coursesInProgress = 0;

  let numberOfCompletedCourses = 0;

  // to calculate total numbers of completed courses
  if (
    userWithCoursesSold?.coursesBought &&
    userWithCoursesSold.chaptersCompleted
  ) {
    if (
      userWithCoursesSold.coursesBought.length > 0 &&
      userWithCoursesSold.chaptersCompleted.length > 0
    ) {
      userWithCoursesSold.coursesBought.forEach((course) => {
        if (course.chapters.length > 0) {
          const allChaptersCompleted = course.chapters.every((chapter) => {
            return userWithCoursesSold.chaptersCompleted.some(
              (completedChapter) => completedChapter.id === chapter.id,
            );
          });

          if (allChaptersCompleted) {
            numberOfCompletedCourses++;
          }
        }
      });
    }
  }

  // total numbers of course in progress
  if (userWithCoursesSold) {
    coursesInProgress =
      userWithCoursesSold?.coursesBought.length - numberOfCompletedCourses;
  }

  return (
    <div className="mt-10 flex h-[100vh] w-[100vw] items-start justify-center">
      <div className="mb-8 mt-8 flex w-[100%] flex-col items-center justify-start md:pl-64">
        <h1 className="mb-4 text-3xl font-semibold">Courses bought</h1>

        <section className="flex w-[100%] flex-col items-center justify-center gap-2 p-2 md:flex-row md:gap-0 lg:justify-between lg:gap-2">
          <div className="flex w-[100%] items-center justify-center md:w-[50%]">
            <Card className="flex w-[100%] max-w-[400px] items-center justify-center p-2 shadow-md md:w-[80%] lg:w-[100%]">
              <Clock4 size={30} />
              <CardHeader>
                <CardTitle>In progress</CardTitle>
                <CardDescription>{coursesInProgress} courses</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="mt-12 flex w-[100%] items-center justify-center md:mt-0 md:w-[50%] ">
            <Card className="flex w-[100%] max-w-[400px] items-center justify-center p-2 shadow-md md:w-[80%] lg:w-[100%] ">
              <CheckCircle size={30} />
              <CardHeader>
                <CardTitle>Completed</CardTitle>
                <CardDescription>
                  {numberOfCompletedCourses} courses
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="my-8 flex w-[100%] flex-col items-center justify-center">
          <div className="mb-2 mt-6 w-[100%] ">
            <div className="flex w-[100%] flex-wrap items-center justify-center gap-12 ">
              {courses.map((course) => (
                <CoursesBoughtInfoCard key={course.id} {...course} />
              ))}
            </div>
          </div>
        </section>

        <h1 className="mb-4 mt-32 text-3xl font-semibold">Courses sold</h1>

        <section className="flex w-[100%] flex-col items-center justify-center gap-2 p-2 md:flex-row md:gap-0 lg:justify-between lg:gap-2">
          <div className="flex w-[100%] items-center justify-center md:w-[50%] ">
            <Card className="flex w-[100%] max-w-[400px] items-center justify-center p-2 shadow-md md:w-[80%] lg:w-[100%] ">
              <NotebookPen size={30} />
              <CardHeader>
                <CardTitle>Courses created</CardTitle>
                <CardDescription>
                  {userWithCoursesSold?.coursesCreated.length} courses
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="mt-12 flex w-[100%] items-center justify-center md:mt-0 md:w-[50%] ">
            <Card className="flex w-[100%] max-w-[400px] items-center justify-center p-2 shadow-md md:w-[80%] lg:w-[100%] ">
              <DollarSign size={30} />
              <CardHeader>
                <CardTitle>Total revenue</CardTitle>
                <CardDescription>{revenueMade} INR</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="my-8 flex w-[100%] flex-col items-center justify-center ">
          <div className="mb-2 mt-6 w-[100%] ">
            <div className="flex w-[100%] flex-wrap items-center justify-center gap-12 ">
              {courses.map((course) => (
                <CoursesSoldInfoCard key={course.id} {...course} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
