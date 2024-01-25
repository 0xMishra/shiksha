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
    },
  });

  return (
    <div className="mt-10 flex h-[100vh] w-[100vw] items-start justify-center">
      <div className="mt-8 flex w-[100%] flex-col items-center justify-start md:pl-64 ">
        <h1 className="mb-4 text-3xl font-semibold">Courses bought</h1>

        <section className="lg:justify-between lg:gap-2 flex w-[100%] flex-col items-center justify-center gap-2 p-2 md:flex-row md:gap-0">
          <div className="flex w-[50%] items-center justify-center ">
            <Card className="lg:w-[100%] flex w-[100%] max-w-[400px] items-center justify-center p-2 md:w-[80%] ">
              <Clock4 size={30} />
              <CardHeader>
                <CardTitle>In progress</CardTitle>
                <CardDescription>{5} courses</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="flex w-[50%] items-center justify-center ">
            <Card className="lg:w-[100%] flex w-[100%] max-w-[400px] items-center justify-center p-2 md:w-[80%] ">
              <CheckCircle size={30} />
              <CardHeader>
                <CardTitle>Completed</CardTitle>
                <CardDescription>{0} courses</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="xl:pr-0  flex w-[100%] flex-col items-center justify-center md:pr-64">
          <div className="mb-2 mt-6 w-[100%] md:ml-64">
            <div className="flex w-[100%] flex-wrap items-center justify-center gap-3">
              {courses.map((course) => (
                <CoursesBoughtInfoCard key={course.id} {...course} />
              ))}
            </div>
          </div>
        </section>

        <h1 className="mb-4 mt-32 text-3xl font-semibold">Courses sold</h1>

        <section className="lg:justify-between lg:gap-2 flex w-[100%] flex-col items-center justify-center gap-2 p-2 md:flex-row md:gap-0">
          <div className="flex w-[50%] items-center justify-center ">
            <Card className="lg:w-[100%] flex w-[100%] max-w-[400px] items-center justify-center p-2 md:w-[80%] ">
              <NotebookPen size={30} />
              <CardHeader>
                <CardTitle>Courses sold</CardTitle>
                <CardDescription>
                  {userWithCoursesSold?.coursesCreated.length} courses
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="flex w-[50%] items-center justify-center ">
            <Card className="lg:w-[100%] flex w-[100%] max-w-[400px] items-center justify-center p-2 md:w-[80%] ">
              <DollarSign size={30} />
              <CardHeader>
                <CardTitle>Total revenue</CardTitle>
                <CardDescription>{1000} USD</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        <section className="xl:pr-0 flex w-[100%] flex-col items-center justify-center md:pr-64">
          <div className="mb-2 mt-6 w-[100%] md:ml-64">
            <div className="flex w-[100%] flex-wrap items-center justify-center gap-3 border-2 border-solid border-black">
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
