import { IndianRupee, NotebookPen, ScanSearch, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { cn } from "~/lib/utils";
import { getAuthSession } from "~/server/auth/config";
import { BuyCourseButton } from "./BuyCourseButton";
import { EnrollInAFreeCourseButton } from "./EnrollInAFreeCourseButton";
import { CourseCompletionProgress } from "./CourseCompletionProgress";

export const CourseCard = async ({
  image,
  id,
  name,
  price,
  creator,
  creatorId,
  hasBoughtCourse,
  desc,
  completionPercentage,
  totalBuyers,
  totalRevenue,
  numberOfChapters,
  completedChapters,
  ratings,
}: {
  id: string;
  image: string;
  name: string;
  price: number;
  creator: string;
  creatorId: string;
  hasBoughtCourse: boolean;
  desc: string;
  completionPercentage: number;
  totalBuyers: number;
  totalRevenue: number;
  numberOfChapters: number;
  completedChapters: string;
  ratings: number;
}) => {
  const session = await getAuthSession();
  if (session?.user.id === creatorId) {
    return (
      <div className="h-[370px] w-[100%] max-w-[600px] rounded-[2px] border-[2px] border-solid border-gray-800 bg-[#171717]">
        <Image
          src={image}
          alt="course thumbnail"
          className="h-[200px] w-[100%] object-cover"
          width={1000}
          height={1000}
        />
        <p className="px-4 pt-2 text-2xl font-semibold">
          {name.length > 20 ? name.slice(0, 20) + "..." : name}
        </p>

        <div className="mx-4 mb-4 mt-2 flex flex-col items-start justify-center">
          <p className="mt-2 text-xl font-semibold text-white">
            ₹{`${totalRevenue}`} Made
          </p>
          <p className="text-md pb-2 font-semibold text-gray-500">
            {totalBuyers} {totalBuyers <= 1 ? "Buyer" : "Buyers"}
          </p>

          <div className="flex w-[100%] items-baseline justify-between">
            <Link href={`courses/${id}`}>
              <Button variant={"white"} className={cn("mt-3 rounded-[2px]")}>
                <ScanSearch />
                View course
              </Button>
            </Link>
            <Link
              href={`/courses/${id}/reviews`}
              className="text-md px-4 text-gray-400 underline"
            >
              feedbacks
            </Link>
          </div>
          <div>
            <p className="text-3xl font-semibold text-gray-400"></p>
          </div>
        </div>
      </div>
    );
  }

  if (hasBoughtCourse) {
    return (
      <div className="h-[370px] w-[100%] max-w-[600px] rounded-[2px] border-[2px] border-solid border-gray-800 bg-[#171717]">
        <Image
          src={image}
          alt="course thumbnail"
          className="h-[200px] w-[100%] object-cover"
          width={1000}
          height={1000}
        />
        <p className="px-4 pt-2 text-2xl font-semibold">
          {name.length > 20 ? name.slice(0, 20) + "..." : name}
        </p>

        <div className="mx-4 mb-2 mt-6 flex flex-col items-start justify-center">
          <div className="flex w-[100%] items-center justify-start">
            <CourseCompletionProgress progress={completionPercentage} />
            <div className="pl-4 text-lg text-gray-400">
              {`${completedChapters}/${numberOfChapters}`}{" "}
              {numberOfChapters <= 1 ? "chapter" : "chapters"}
            </div>
          </div>

          <p className="text-md mb-2 font-semibold text-gray-500">
            {completionPercentage}% completed
          </p>
          <div className="flex w-[100%] items-baseline justify-between">
            <Link href={`courses/${id}`}>
              <Button variant={"white"} className={cn("mt-1 rounded-[2px]")}>
                <ScanSearch />
                View course
              </Button>
            </Link>
            <Link
              href={`/courses/${id}/reviews`}
              className="text-md px-4 text-gray-400 underline"
            >
              write review
            </Link>
          </div>
          <div>
            <p className="text-3xl font-semibold text-gray-400"></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[370px] w-[100%] max-w-[600px] rounded-[2px] border-[2px] border-solid border-gray-800 bg-[#171717]">
      <Image
        src={image}
        alt="course thumbnail"
        className="h-[200px] w-[100%] object-cover"
        width={1000}
        height={1000}
      />
      <p className="px-4 pt-2 text-2xl font-semibold">
        {name.length > 20 ? name.slice(0, 20) + "..." : name}
      </p>
      <p className="px-4 pb-2 text-xl font-semibold text-gray-400">{creator}</p>
      <div className="flex items-center justify-start px-4">
        {ratings === 0 ? (
          <p className="text-md text-gray-400">No reviews yet</p>
        ) : (
          <div>
            {Array.from({ length: ratings }, (_, i) => (
              <Star key={i} className="text-sm text-white" size={10} />
            ))}
            <Link
              href={`/courses/${id}/reviews`}
              className="text-md pl-2 text-gray-400 underline"
            >
              <p>reviews</p>
            </Link>
          </div>
        )}
      </div>

      <div className="m-4 mt-7 flex items-center justify-between">
        <Dialog>
          <DialogTrigger asChild>
            {price === 0 ? (
              <Button variant={"white"} className={cn("rounded-[2px]")}>
                <NotebookPen />
                Enroll
              </Button>
            ) : (
              <Button variant={"white"} className={cn("rounded-[2px]")}>
                <IndianRupee />
                Buy course
              </Button>
            )}
          </DialogTrigger>

          <DialogContent
            className="sm:max-w-[425px]"
            style={{ background: "#171717" }}
          >
            <DialogHeader>
              <DialogTitle></DialogTitle>
              <p className="px-4 pt-2 text-3xl font-semibold">{name}</p>
              <p className="px-4 pb-5 text-xl font-semibold text-gray-400">
                By: {creator}
              </p>
              <DialogDescription className="text-center">
                <Image
                  src={image}
                  alt="course thumbnail"
                  className="h-[200px] w-[100%] object-cover"
                  width={1000}
                  height={1000}
                />
                <br />
                <span className="pt-3 text-center text-xl font-semibold">
                  {desc}
                </span>
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              {price === 0 ? (
                <EnrollInAFreeCourseButton courseId={id} />
              ) : (
                <BuyCourseButton courseId={id} />
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div>
          <p className="text-3xl font-semibold text-gray-400">
            {price === 0 ? "FREE" : "₹" + price.toString()}
          </p>
        </div>
      </div>
    </div>
  );
};
