import { db } from "@/server/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    console.log(url);
    const chapter = await db.chapter.findUnique({
      where: {
        id: url.searchParams.get("id") ?? "",
      },
    });

    return new NextResponse(JSON.stringify(chapter));
  } catch (error) {
    console.log(error);
  }
}
