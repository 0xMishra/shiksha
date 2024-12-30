"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAuthSession } from "~/server/auth/config";
import { db } from "~/server/db";
import { courseCreationSchema } from "~/validators/courseCreationSchema";

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
  } catch (error) {
    console.log(error);
  }
  redirect("/");
};
