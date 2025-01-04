import Link from "next/link";
import { redirect } from "next/navigation";
import { CoursesBoughtTable } from "~/components/CoursesBoughtTable";
import { CoursesCreatedTable } from "~/components/CoursesCreatedTable";
import { getAuthSession } from "~/server/auth/config";
import { db } from "~/server/db";

type CoursesCreated = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
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
          chapters: {
            select: { id: true },
          },
          creator: {
            select: { name: true },
          },
        },
      },
      coursesCompleted: {
        select: { id: true },
      },
      coursesCreated: {
        select: {
          id: true,
          name: true,
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

  const coursesCompleted = userWithCourses?.coursesCompleted || [
    {
      id: "",
    },
  ];

  // for courses created : course name, numberOfBuyers, createdAt , updatedAt, view, update and delete
  // for courses bougth : course name, numberOfChapters, creator name , mark as complete
  return (
    <div className="mt-20 flex h-screen w-screen items-start justify-center">
      <div className="flex w-[90%] max-w-[900px] flex-col items-center justify-center md:ml-8 lg:ml-0">
        <h1 className="my-4 text-4xl font-extrabold text-gray-200">
          Courses created
        </h1>
        {userWithCourses?.coursesCreated.length! > 0 ? (
          <CoursesCreatedTable courses={coursesCreated} />
        ) : (
          <DefaultComponent option={Option.CREATED} />
        )}

        <h1 className="my-4 mt-24 text-4xl font-extrabold text-gray-200">
          Courses bought
        </h1>
        {userWithCourses?.coursesBought.length! > 0 ? (
          <CoursesBoughtTable
            courses={coursesBought}
            coursesCompleted={coursesCompleted}
          />
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
