import { env } from "~/env";
import { stripe } from "~/lib/stripe";
import { getAuthSession } from "~/server/auth/config";
import { db } from "~/server/db";
import Stripe from "stripe";

export async function POST(
  _req: Request,
  {
    params,
  }: {
    params: {
      courseId: string;
    };
  },
) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return new Response("Not authorized", { status: 401 });
    }
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
    });
    if (!course) {
      return new Response("course not found", { status: 404 });
    }
    const userWithCourse = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        coursesBought: {
          where: {
            id: params.courseId,
          },
        },
      },
    });
    let hasPurchased = false;
    if (userWithCourse) {
      hasPurchased = userWithCourse?.coursesBought.length > 0;
    }
    if (hasPurchased) {
      return new Response("already purchased ", { status: 400 });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "INR",

          product_data: {
            name: course.name,
          },
          unit_amount: Math.round(course.price * 100),
        },
      },
    ];

    // creates a new stripe customer
    const customer = await stripe.customers.create({
      email: session?.user.email?.toString(),
    });

    const stripeSession = await stripe.checkout.sessions.create({
      customer: customer.id,
      line_items,
      mode: "payment",
      success_url: `${env.NEXTAUTH_URL}/courses/${course.id}?success=1`,
      cancel_url: `${env.NEXTAUTH_URL}/courses/${course.id}?cancel=1`,
      metadata: {
        courseId: course.id,
        userId: session.user.id,
      },
    });

    return new Response(stripeSession.url?.toString(), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Internal server error", { status: 500 });
  }
}
