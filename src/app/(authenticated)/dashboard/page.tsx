import Link from "next/link";
import { redirect } from "next/navigation";
import { CoursesBoughtTable } from "~/components/CoursesBoughtTable";
import { CoursesCreatedTable } from "~/components/CoursesCreatedTable";
import { DashboardChart } from "~/components/DashboardChart";
import { getAuthSession } from "~/server/auth/config";
import { db } from "~/server/db";

type CoursesCreated = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  price?: number;
  courseBoughtBy: {
    id: string;
  }[];
};

interface CoursesBought {
  id: string;
  name: string;
  chapters: {
    id: number;
  }[];
  creator: {
    name: string | null;
  };
  isCompleted?: boolean;
}

const dashboardPage = async () => {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/sign-in");
  }
  const userWithCourses = await db.user.findUnique({
    where: { id: session.user.id },

    select: {
      coursesBought: {
        select: {
          id: true,
          name: true,
          price: true,
          chapters: {
            select: { id: true },
          },
          creator: {
            select: { name: true },
          },
        },
      },
      chaptersCompleted: {
        select: { id: true },
      },
      coursesCreated: {
        select: {
          id: true,
          name: true,
          price: true,
          createdAt: true,
          updatedAt: true,
          courseBoughtBy: { select: { id: true } },
        },
      },
    },
  });

  const coursesCreated: CoursesCreated[] = userWithCourses?.coursesCreated || [
    {
      id: "",
      name: "",
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
      courseBoughtBy: [{ id: " " }],
    },
  ];

  let coursesBought: CoursesBought[] = userWithCourses?.coursesBought || [
    {
      id: "",
      name: "",
      creator: { name: " " },
      chapters: [{ id: 0 }],
    },
  ];

  const chaptersCompleted = userWithCourses?.chaptersCompleted || [
    {
      id: 0,
    },
  ];

  let totalReveueMade = 0;
  let totalCustomers = 0;

  userWithCourses?.coursesCreated.map((course) => {
    totalReveueMade += course.courseBoughtBy.length * course.price;
    totalCustomers += course.courseBoughtBy.length;
  });

  let totalCoursesBought = userWithCourses?.coursesBought.length!;
  let totalMoneySpent = 0;

  userWithCourses?.coursesBought.map((course) => {
    totalMoneySpent += course.price;
  });

  let totalCoursesCompleted = 0;
  userWithCourses?.coursesBought.map((course) => {
    let isCourseCompleted = course.chapters.every((ch2) =>
      userWithCourses.chaptersCompleted.some((ch1) => ch1.id === ch2.id),
    );
    if (isCourseCompleted) totalCoursesCompleted++;
  });

  // for courses created : course name, numberOfBuyers, createdAt , updatedAt, view, update and delete
  // for courses bougth : course name, numberOfChapters, creator name , mark as complete
  return (
    <div
      className={`mb-20 ${userWithCourses?.coursesCreated.length! > 0 && userWithCourses?.coursesBought.length! > 0 ? "mb-40" : ""} mt-20 flex h-screen w-screen items-start justify-center`}
    >
      <div className="flex w-[90%] max-w-[900px] flex-col items-center justify-center pb-20 md:ml-8 lg:ml-0">
        <h1 className="my-4 text-4xl font-extrabold text-gray-200">
          Courses created
        </h1>
        {userWithCourses?.coursesCreated.length! > 0 ? (
          <>
            <CoursesCreatedTable courses={coursesCreated} />
            <div className="mt-2 grid w-[100%] grid-cols-1 place-items-center gap-2 pb-10 md:grid-cols-2 lg:grid-cols-3">
              <DashboardChart
                data={`${userWithCourses?.coursesCreated.length}`}
                text={`${userWithCourses?.coursesCreated.length === 1 ? "Course" : "Courses"} created`}
              />
              <DashboardChart
                data={`₹${totalReveueMade}`}
                text="Revenue made"
              />
              <DashboardChart
                data={`${totalCustomers}`}
                text="Customers served"
              />
            </div>
          </>
        ) : (
          <DefaultComponent option={Option.CREATED} />
        )}

        <h1 className="my-4 mt-24 text-4xl font-extrabold text-gray-200">
          Courses bought
        </h1>
        {userWithCourses?.coursesBought.length! > 0 ? (
          <>
            <CoursesBoughtTable
              courses={coursesBought}
              chaptersCompleted={chaptersCompleted}
            />
            <div className="mt-2 grid w-[100%] grid-cols-1 place-items-center gap-2 pb-10 md:grid-cols-2 lg:grid-cols-3">
              <DashboardChart
                data={`${totalCoursesBought}`}
                text={`${totalCoursesBought <= 1 ? "Course" : "Courses"} bought`}
              />
              <DashboardChart data={`₹${totalMoneySpent}`} text="Money spent" />
              <DashboardChart
                data={`${totalCoursesCompleted}`}
                text={`${totalCoursesCompleted <= 1 ? "Course" : "Courses"} completed`}
              />
            </div>
          </>
        ) : (
          <DefaultComponent option={Option.BOUGHT} />
        )}
      </div>
    </div>
  );
};

enum Option {
  CREATED,
  BOUGHT,
}

function DefaultComponent({ option }: { option: Option }) {
  return (
    <div className="text-center">
      <p className="mt-1 text-xl font-light text-gray-400">
        {option === Option.CREATED
          ? "No courses created yet"
          : "No courses bought yet"}
      </p>
      <div className="mt-6 flex justify-center">
        <div className="group relative inline-block overflow-hidden rounded bg-white px-6 py-3 font-medium text-black shadow transition hover:bg-gray-800 hover:text-white">
          <span className="absolute inset-0 translate-x-full translate-y-full transform rounded-[2px] bg-blue-600 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0"></span>
          {option === Option.CREATED ? (
            <Link href={"/courses/create"} className="relative z-10">
              Create course
            </Link>
          ) : (
            <Link href={"/courses"} className="relative z-10">
              Browse course
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default dashboardPage;
