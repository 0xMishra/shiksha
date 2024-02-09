import Stripe from "stripe";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/server/db";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    console.log(error);
    return new Response(`Webhook error: ${error}`);
  }

  const session = event.data.object as Stripe.Checkout.Session;

  const userId = session?.metadata?.userId;
  const courseId = session?.metadata?.courseId;

  if (event.type === "checkout.session.completed") {
    if (!userId || !courseId) {
      return new Response("webhook error missing metadata");
    }

    const userWithCoursesBought = await db.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        coursesBought: true,
      },
    });

    const course = await db.course.findUnique({
      where: {
        id: courseId,
      },
    });

    let updatedBoughtCourse = userWithCoursesBought?.coursesBought;
    if (course) {
      updatedBoughtCourse?.push(course);
      await db.user.update({
        where: {
          id: userId,
        },
        data: {
          coursesBought: {
            set: updatedBoughtCourse,
          },
        },
      });
    }
  } else {
    return new Response("webhook unhandeled event" + event);
  }

  return new Response("null", { status: 201 });
}
