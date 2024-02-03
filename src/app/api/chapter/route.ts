import { getChapterSchema } from "@/schemas/getChapterSchema";
import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await getServerAuthSession();

    if (!session) {
      return new NextResponse("not logged in");
    }

    const url = new URL(req.url);

    const userWithCourse = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        coursesBought: {
          where: {
            id: url.searchParams.get("courseId") ?? "",
          },
        },
        coursesCreated: {
          where: {
            id: url.searchParams.get("courseId") ?? "",
          },
        },
      },
    });

    const chapter = await db.chapter.findUnique({
      where: {
        id: url.searchParams.get("id") ?? "",
      },
    });

    if (userWithCourse) {
      if (
        userWithCourse.coursesCreated.length > 0 ||
        userWithCourse.coursesBought.length > 0
      ) {
        if (getChapterSchema.parse(chapter)) {
          return new NextResponse(JSON.stringify(chapter));
        }

        return new Error("Zod error");
      }
    }

    return new NextResponse(
      JSON.stringify({ message: "You haven't bought this course" }),
    );
  } catch (error) {
    console.log(error);
  }
}
