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

const DashboardPage = async () => {
  const session = await getServerAuthSession();
  const courses = await db.course.findMany();

  const userWithCoursesSold = await db.user.findUnique({
    where: { id: session?.user.id },
    include: {
      coursesCreated: {
        where: {
          creator: session?.user,
        },
      },
      coursesCompleted: true,
      coursesBought: true,
    },
  });

  let coursesInProgress = 0;

  if (userWithCoursesSold) {
    coursesInProgress =
      userWithCoursesSold?.coursesBought.length -
      userWithCoursesSold?.coursesCompleted.length;
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
                  {userWithCoursesSold?.coursesCompleted.length} courses
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
                <CardDescription>
                  {userWithCoursesSold?.revenueMade} USD
                </CardDescription>
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
