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

    const userWithBoughtCourse = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        coursesBought: {
          where: {
            id: url.searchParams.get("id") ?? "",
          },
        },
        coursesCreated: {
          where: {
            creatorId: session.user.id,
          },
        },
      },
    });

    if (userWithBoughtCourse) {
      if (
        userWithBoughtCourse.coursesCreated.length > 0 ||
        userWithBoughtCourse.coursesBought.length > 0
      ) {
        const chapter = await db.chapter.findUnique({
          where: {
            id: url.searchParams.get("id") ?? "",
          },
        });

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
