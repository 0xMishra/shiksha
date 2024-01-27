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
  numberOfChapters,
  price,
}: Course) => {
  const maxLength = 17;
  const session = await getServerAuthSession();

  const creator = await db.user.findFirst({
    where: {
      id: creatorId,
    },
  });

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

    const completedChapters = await db.course.findMany({
      where: { id: id },
      include: {
        chapters: {
          where: {
            isCompleted: true,
          },
        },
      },
    });

    completetedChapters = completedChapters.length;

    const allChapters = await db.course.findMany({
      where: { id: id },
      include: {
        chapters: true,
      },
    });

    totalChapters = allChapters.length;

    if (!totalChapters) {
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
              style={{
                height: "auto",
                width: "auto",
              }}
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
              <p className="font-semibold">{completetionRate}% complete</p>
            ) : (
              <p className="font-semibold">Price: {price} USD</p>
            )}
          </CardContent>
        </Card>
      </Link>
    );
  }

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

  if (userWithCoursesSold?.coursesCreated.length) {
    let numberOfBuyers = 0;
    if (userWithCoursesSold?.coursesCreated[0]?.numberOfBuyers) {
      numberOfBuyers = userWithCoursesSold?.coursesCreated[0]?.numberOfBuyers;
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
              style={{
                height: "auto",
                width: "auto",
              }}
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
            <p className="mt-4">Price: {price} USD</p>
            <p className="font-semibold">
              Revenue: {numberOfBuyers * price} USD
            </p>
          </CardContent>
        </Card>
      </Link>
    );
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
            style={{
              height: "auto",
              width: "auto",
            }}
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
          <p className="mt-4">Price: {price} USD</p>
        </CardContent>
      </Card>
    </Link>
  );
};
