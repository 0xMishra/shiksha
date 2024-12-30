"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAuthSession } from "~/server/auth/config";
import { db } from "~/server/db";
import { chapterCreationSchema } from "~/validators/courseCreationSchema";

export const createChapterAction = async (
  prevState: any,
  formData: FormData,
) => {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return { msg: "error" };
    }

    const name = formData.get("name") as string;
    const desc = formData.get("desc") as string;
    const image = formData.get("image") as string;
    const courseId = formData.get("courseId") as string;
    let videoUrl = formData.get("video") as string;

    const parsedInput = chapterCreationSchema.safeParse({
      name,
      desc,
      video: videoUrl,
    });

    if (image === null) return { msg: "image" };

    if (!parsedInput.success) {
      const errorType = parsedInput.error.errors[0]?.path[0];
      console.log("error: ", errorType);

      return { msg: errorType };
    }

    videoUrl = JSON.parse(videoUrl)[0].url;

    const chapter = await db.chapter.create({
      data: {
        name,
        description: desc,
        image: image,
        video: videoUrl,
        courseId: courseId,
      },
    });

    if (!chapter) {
      return { msg: "error" };
    }

    revalidatePath("/");
  } catch (error) {
    console.log(error);
  }
  redirect("/");
};
