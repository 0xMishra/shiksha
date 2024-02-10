import { getServerAuthSession } from "@/server/auth";
import { db } from "@/server/db";
import { ZodError } from "zod";

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      courseId: string;
    };
  },
) {
  try {
    const session = await getServerAuthSession();

    if (!session) {
      return new Response("not logged in");
    }

    const url = new URL(req.url);

    const userWithChapters = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        chaptersCompleted: true,
        coursesBought: {
          where: {
            id: params.courseId,
          },
        },
      },
    });

    const chapter = await db.chapter.findUnique({
      where: {
        id: url.searchParams.get("id") ?? "",
      },
    });

    if (userWithChapters) {
      if (userWithChapters.coursesBought.length > 0 && chapter) {
        let updatedChapters = userWithChapters.chaptersCompleted;
        updatedChapters.push(chapter);

        await db.user.update({
          where: {
            id: session.user.id,
          },
          data: {
            chaptersCompleted: {
              set: updatedChapters,
            },
          },
        });

        return new Response(
          JSON.stringify({ message: "Marked this chapter complete" }),
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
