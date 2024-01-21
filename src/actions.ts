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
