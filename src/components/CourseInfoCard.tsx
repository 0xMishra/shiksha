import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { type Course } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

export const CourseInfoCard = async ({
  id,
  banner,
  name,
  creatorId,
  price,
}: Course) => {
  const maxLength = 17;
  const session = await getServerAuthSession();

  const creator = await db.user.findFirst({
    where: {
      id: creatorId,
    },
  });

  const numberOfChapters = await db.chapter.count({
    where: {
      courseId: id,
    },
  });

  // if you are logged in
  if (session) {
    // if you have not bought this course and you are logged ib
    const userWithCoursesBought = await db.user.findUnique({
      where: {
        id: session?.user.id,
      },
      include: {
        coursesBought: {
          where: {
            id: id,
          },
        },
      },
    });

    if (userWithCoursesBought?.coursesBought.length) {
      let completetedChapters = 0;

      let completetionRate = 0;

      let totalChapters = 0;

      const userWithCompletedChapters = await db.user.findUnique({
        where: { id: session.user.id },
        include: {
          chaptersCompleted: {
            where: {
              courseId: id,
            },
          },
        },
      });

      if (userWithCompletedChapters) {
        completetedChapters =
          userWithCompletedChapters?.chaptersCompleted.length;
      }

      const allChapters = await db.chapter.findMany({
        where: {
          courseId: id,
        },
      });

      totalChapters = allChapters.length;

      if (totalChapters > 0) {
        completetionRate = (completetedChapters / totalChapters) * 100;
      }

      return (
        <Link href={`/courses/explore/${id}`} className="">
          <Card className="flex w-[99vw] max-w-[415px] flex-col items-start justify-center shadow-md md:max-w-[300px]">
            <CardHeader className="w-[100%]">
              <Image
                src={banner}
                alt="course banner "
                className="h-[200px] w-[99%] place-content-center object-cover "
                blurDataURL="blur"
                height={900}
                width={900}
                priority
              />
              <CardTitle>
                {name.length > maxLength
                  ? name.substring(0, maxLength) + "..."
                  : name}
              </CardTitle>
              <CardDescription>{creator?.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{numberOfChapters} chapters</p>
              {userWithCoursesBought?.coursesBought.length ? (
                <p className="font-semibold">
                  {Math.floor(completetionRate)}% complete
                </p>
              ) : (
                <p className="mt-4">
                  Price: {price == 0 ? "Free" : price + " INR"}{" "}
                </p>
              )}
            </CardContent>
          </Card>
        </Link>
      );
    }

    // if you have created this course and you are logged in
    const userWithCoursesSold = await db.user.findUnique({
      where: {
        id: session?.user.id,
      },
      include: {
        coursesCreated: {
          where: {
            id: id,
          },
        },
      },
    });

    const peopleWhoBoughtThisCourse = await db.course.findUnique({
      where: {
        id: id,
      },
      include: {
        boughtBy: true,
      },
    });

    let revenueMade = 0;
    if (peopleWhoBoughtThisCourse?.boughtBy) {
      revenueMade = price * peopleWhoBoughtThisCourse?.boughtBy.length;
    }

    if (userWithCoursesSold?.coursesCreated.length) {
      return (
        <Link href={`/courses/explore/${id}`} className="">
          <Card className="flex w-[99vw] max-w-[415px] flex-col items-start justify-center shadow-md md:max-w-[300px]">
            <CardHeader className="w-[100%]">
              <Image
                src={banner}
                alt="course banner "
                className="h-[200px] w-[99%] place-content-center object-cover "
                blurDataURL="blur"
                height={900}
                width={900}
                priority
              />
              <CardTitle>
                {name.length > maxLength
                  ? name.substring(0, maxLength) + "..."
                  : name}
              </CardTitle>
            </CardHeader>
            <CardContent className="w-[100%]">
              <p>{numberOfChapters} chapters</p>
              <p className="mt-4">
                Price: {price == 0 ? "Free" : price + " INR"}{" "}
              </p>
              <p className="font-semibold">Revenue: {revenueMade} INR</p>
            </CardContent>
          </Card>
        </Link>
      );
    }
  }

  // if you have neither created nor bought this course and you are not logged in
  return (
    <Link href={`/courses/explore/${id}`} className="">
      <Card className="flex w-[99vw] max-w-[415px] flex-col items-start justify-center shadow-md md:max-w-[300px]">
        <CardHeader className="w-[100%]">
          <Image
            src={banner}
            alt="course banner "
            className="h-[200px] w-[99%] place-content-center object-cover "
            blurDataURL="blur"
            height={900}
            width={900}
            priority
          />
          <CardTitle>
            {name.length > maxLength
              ? name.substring(0, maxLength) + "..."
              : name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{numberOfChapters} chapters</p>
          <p className="mt-4">Price: {price == 0 ? "Free" : price + " INR"} </p>
        </CardContent>
      </Card>
    </Link>
  );
};
