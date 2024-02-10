import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { ZodError } from "zod";

export async function GET(req: Request) {
  try {
    const session = await getServerAuthSession();

    if (!session) {
      return new Response("not logged in");
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

    const completedChaptersOfThisCourse = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        chaptersCompleted: {
          where: {
            courseId: url.searchParams.get("courseId") ?? "",
            id: chapter?.id,
          },
        },
      },
    });

    let isChapterCompletedByUser = false;
    if (completedChaptersOfThisCourse) {
      if (completedChaptersOfThisCourse.chaptersCompleted.length > 0) {
        isChapterCompletedByUser = true;
      }
    }

    if (userWithCourse) {
      if (
        userWithCourse.coursesCreated.length > 0 ||
        userWithCourse.coursesBought.length > 0
      ) {
        return new Response(
          JSON.stringify({
            ...chapter,
            isCompleted: isChapterCompletedByUser,
          }),
        );
      }
    }

    return new Response(
      JSON.stringify({ message: "You haven't bought this course" }),
    );
  } catch (error) {
    if (error instanceof ZodError)
      return new Response("invalid request data passed", { status: 422 });

    return new Response("could not fetch new posts", { status: 500 });
  }
}
