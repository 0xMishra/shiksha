"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAuthSession } from "~/server/auth/config";
import { db } from "~/server/db";
import {
  chapterCommentSchema,
  chapterCreationSchema,
} from "~/validators/courseCreationSchema";

export const createChapterAction = async (
  prevState: any,
  formData: FormData,
) => {
  let route = "/";
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

    if (!parsedInput.success) {
      const errorType = parsedInput.error.errors[0]?.path[0];
      console.log("error: ", errorType);

      if (errorType === "name") return { msg: errorType };
    }

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

    route = `/courses/${courseId}/`;
    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath(`/courses/${courseId}/`);
  } catch (error) {
    console.log(error);
  }
  redirect(route);
};

export const updateChapterAction = async (
  prevState: any,
  formData: FormData,
) => {
  let route = "/";
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return { msg: "error" };
    }

    const name = formData.get("name") as string;
    const desc = formData.get("desc") as string;
    const image = formData.get("image") as string;
    const courseId = formData.get("courseId") as string;
    const chapterId = formData.get("chapterId") as string;
    let videoUrl = formData.get("video") as string;

    const parsedInput = chapterCreationSchema.safeParse({
      name,
      desc,
      video: videoUrl,
    });

    if (!parsedInput.success) {
      const errorType = parsedInput.error.errors[0]?.path[0];
      console.log("error: ", errorType);

      if (errorType === "name") return { msg: errorType };
    }

    if (image === null) return { msg: "image" };

    if (!parsedInput.success) {
      const errorType = parsedInput.error.errors[0]?.path[0];
      console.log("error: ", errorType);

      return { msg: errorType };
    }

    const chapter = await db.chapter.update({
      where: { id: parseInt(chapterId) },
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

    route = `/courses/${courseId}/chapters/${chapterId}`;

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath(`/courses/${courseId}/chapters/${chapterId}`);
  } catch (error) {
    console.log(error);
  }
  redirect(route);
};

export const deleteChapterAction = async (
  prevState: any,
  formData: FormData,
) => {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return { msg: "error" };
    }

    const chapterId = formData.get("chapterId") as string;

    await db.chapter.delete({
      where: { id: parseInt(chapterId) },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
  } catch (error) {
    console.log(error);
  }
  redirect("/");
};

export const markChapterAsCompleteAction = async ({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}) => {
  let route = "/";
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return { msg: "error" };
    }

    let chapter = await db.chapter.findUnique({
      where: { id: parseInt(chapterId) },
      select: {
        chapterCompletedBy: {
          select: { id: true },
        },
      },
    });

    chapter?.chapterCompletedBy.push({ id: session.user.id });

    await db.chapter.update({
      where: { id: parseInt(chapterId) },
      data: {
        chapterCompletedBy: { set: chapter?.chapterCompletedBy },
      },
    });

    route = `/courses/${courseId}/chapters/${chapterId}`;
    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidatePath(`/courses/${courseId}/chapters/${chapterId}`);
  } catch (error) {
    console.log(error);
  }
  redirect(route);
};

export const createChapterCommentAction = async (
  prevState: any,
  formData: FormData,
) => {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return { msg: "error" };
    }

    const comment = formData.get("comment") as string;
    const chapterId = formData.get("chapterId") as string;
    const courseId = formData.get("courseId") as string;
    const creatorId = formData.get("creatorId") as string;

    const parsedInput = chapterCommentSchema.safeParse({
      comment,
    });

    if (!parsedInput.success) {
      const errorType = parsedInput.error.errors[0]?.path[0];
      return { msg: errorType };
    }

    const commentCreated = await db.comment.create({
      data: {
        text: comment,
        creatorId,
        chapterId: parseInt(chapterId),
      },
    });

    if (!commentCreated) {
      return { msg: "error" };
    }

    revalidatePath("/");
    revalidatePath(`/courses/${courseId}/chapters/${chapterId}`);
  } catch (error) {
    console.log(error);
  }
};
