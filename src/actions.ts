"use server";

import { revalidatePath } from "next/cache";
import { getServerAuthSession } from "./server/auth";
import { db } from "./server/db";
import { createCourseSchema } from "./schemas/createCourseSchema";
import { ZodError } from "zod";
import { addChaptersToCourseSchema } from "./schemas/addChaptersToCourseSchema";

export async function createCourse(formData: FormData) {
  try {
    const session = await getServerAuthSession();

    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const banner = formData.get("banner") as string;

    const isInputValid = createCourseSchema.parse({
      name: name,
      price: price,
      banner: banner,
    });

    if (isInputValid) {
      await db.course.create({
        data: {
          name: name,
          price: parseInt(price),
          banner: banner,
          creator: {
            connect: {
              id: session?.user.id,
            },
          },
        },
      });

      revalidatePath("/");
      return "success";
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return "zod error";
    }
  }
}

export async function addChaptersToCourse(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const desc = formData.get("desc") as string;
    const videoUrl = formData.get("videoUrl") as string;
    const courseId = formData.get("courseId") as string;

    const isInputValid = addChaptersToCourseSchema.parse({
      name: name,
      desc: desc,
      videoUrl: videoUrl,
      courseId: courseId,
    });

    if (isInputValid) {
      const newChapter = await db.chapter.create({
        data: {
          name: name,
          description: desc,
          videoUrl: videoUrl,
          courseId: courseId,
        },
      });

      await db.course.update({
        where: {
          id: newChapter.courseId,
        },
        data: {
          numberOfChapters: { increment: 1 },
        },
      });

      revalidatePath(`courses/explore/${courseId}`);
      return "success";
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return "zod error";
    }
  }
}
