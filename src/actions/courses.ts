"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { number } from "zod";
import { getAuthSession } from "~/server/auth/config";
import { db } from "~/server/db";
import {
  courseCreationSchema,
  courseReviewSchema,
} from "~/validators/courseCreationSchema";

export const createCourseAction = async (
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
    const price = formData.get("price") as string;
    const image = formData.get("image") as string;

    const parsedInput = courseCreationSchema.safeParse({
      name,
      desc,
      price: parseInt(price),
    });

    if (!parsedInput.success) {
      const errorType = parsedInput.error.errors[0]?.path[0];

      return { msg: errorType };
    }

    if (image === null) return { msg: "image" };

    const course = await db.course.create({
      data: {
        name,
        description: desc,
        price: parseInt(price),
        image: image,
        creatorId: session?.user.id,
      },
    });

    if (!course) {
      return { msg: "error" };
    }

    revalidatePath("/");
    revalidatePath("/dashboard");
  } catch (error) {
    console.log(error);
  }
  redirect("/");
};

export const updateCourseAction = async (
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
    const price = formData.get("price") as string;
    const image = formData.get("image") as string;
    const courseId = formData.get("courseId") as string;

    const parsedInput = courseCreationSchema.safeParse({
      name,
      desc,
      price: parseInt(price),
    });

    if (!parsedInput.success) {
      const errorType = parsedInput.error.errors[0]?.path[0];

      return { msg: errorType };
    }

    if (image === null) return { msg: "image" };

    const updatedCourse = await db.course.update({
      where: { id: courseId },
      data: {
        name,
        description: desc,
        price: parseInt(price),
        image: image,
        creatorId: session?.user.id,
      },
    });

    if (!updatedCourse) {
      return { msg: "error" };
    }

    revalidatePath("/");
    revalidatePath("/dashboard");
  } catch (error) {
    console.log(error);
  }
  redirect("/dashboard");
};

export const enrollInAFreeCourseAction = async (
  prevState: any,
  formData: FormData,
) => {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return { msg: "error" };
    }

    const courseId = formData.get("courseId") as string;

    let courseWithBuyers = await db.course.findUnique({
      where: { id: courseId },
      select: { courseBoughtBy: { select: { id: true } } },
    });

    courseWithBuyers?.courseBoughtBy.push({
      id: session.user.id,
    });

    const updatedCourse = await db.course.update({
      where: { id: courseId },
      data: {
        courseBoughtBy: {
          set: courseWithBuyers?.courseBoughtBy,
        },
      },
    });

    if (!updatedCourse) {
      return { msg: "error" };
    }

    revalidatePath("/");
    revalidatePath("/dashboard");
  } catch (error) {
    console.log(error);
  }
  redirect("/");
};

export const deleteCourseAction = async (
  prevState: any,
  formData: FormData,
) => {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return { msg: "error" };
    }

    const courseId = formData.get("courseId") as string;

    await db.course.delete({
      where: { id: courseId },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
  } catch (error) {
    console.log(error);
  }
  redirect("/dashboard");
};

export const createCourseReviewAction = async (
  prevState: any,
  formData: FormData,
) => {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return { msg: "error" };
    }

    const rating = formData.get("rating") as string;
    const review = formData.get("review") as string;
    const courseId = formData.get("courseId") as string;
    const creatorId = formData.get("creatorId") as string;

    const parsedInput = courseReviewSchema.safeParse({
      rating: parseInt(rating),
      review,
    });

    if (!parsedInput.success) {
      const errorType = parsedInput.error.errors[0]?.path[0];
      return { msg: errorType };
    }

    const reviewCreated = await db.courseReview.create({
      data: {
        ratings: parseInt(rating),
        text: review,
        creatorId,
        courseId,
      },
    });

    if (!reviewCreated) {
      return { msg: "error" };
    }

    revalidatePath("/");
    revalidatePath(`/courses/${courseId}/reviews`);
  } catch (error) {
    console.log(error);
  }
};
