"use server";

import { getServerAuthSession } from "./server/auth";
import { db } from "./server/db";

export async function createCourse(formData: FormData) {
  try {
    const session = await getServerAuthSession();

    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const banner = formData.get("banner") as string;

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
  } catch (error) {
    console.log(error);
  }
}

export async function addChaptersToCourse(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const desc = formData.get("desc") as string;
    const videoUrl = formData.get("videoUrl") as string;
    const courseId = formData.get("courseId") as string;

    await db.chapter.create({
      data: {
        name: name,
        description: desc,
        videoUrl: videoUrl,
        courseId: courseId,
      },
    });
  } catch (error) {
    console.log(error);
  }
}
