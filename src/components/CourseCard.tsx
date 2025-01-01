import { IndianRupee, ScanSearch } from "lucide-react";
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

export const CourseCard = async ({
  image,
  id,
  name,
  price,
  creator,
  creatorId,
  hasBoughtCourse,
  desc,
}: {
  id: string;
  image: string;
  name: string;
  price: number;
  creator: string;
  creatorId: string;
  hasBoughtCourse: boolean;
  desc: string;
}) => {
  const session = await getAuthSession();
  if (session?.user.id === creatorId || hasBoughtCourse) {
    return (
      <div className="w-[100%] max-w-[600px] rounded-[2px] border-[2px] border-solid border-gray-800 bg-[#171717]">
        <Image
          src={image}
          alt="course thumbnail"
          className="h-[200px] w-[100%] object-cover"
          width={1000}
          height={1000}
        />
        <p className="px-4 pt-2 text-2xl font-semibold">{name}</p>

        <div className="mx-4 mb-4 mt-3 flex items-center justify-between">
          <Link href={`courses/${id}`}>
            <Button variant={"white"} className={cn("rounded-[2px]")}>
              <ScanSearch />
              View course
            </Button>
          </Link>
          <div>
            <p className="text-3xl font-semibold text-gray-400"></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[100%] max-w-[600px] rounded-[2px] border-[2px] border-solid border-gray-800 bg-[#171717]">
      <Image
        src={image}
        alt="course thumbnail"
        className="h-[200px] w-[100%] object-cover"
        width={1000}
        height={1000}
      />
      <p className="px-4 pt-2 text-2xl font-semibold">{name}</p>
      <p className="px-4 pb-2 text-xl font-semibold text-gray-400">{creator}</p>

      <div className="mx-4 mb-4 mt-3 flex items-center justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"white"} className={cn("rounded-[2px]")}>
              <IndianRupee />
              Buy course
            </Button>
          </DialogTrigger>

          <DialogContent
            className="sm:max-w-[425px]"
            style={{ background: "#171717" }}
          >
            <DialogHeader>
              <DialogTitle></DialogTitle>
              <DialogDescription>
                <Image
                  src={image}
                  alt="course thumbnail"
                  className="h-[200px] w-[100%] object-cover"
                  width={1000}
                  height={1000}
                />
                {desc ? desc : ""}
              </DialogDescription>
              <p className="px-4 pt-3 text-3xl font-semibold">{name}</p>
              <p className="px-4 pb-2 text-xl font-semibold text-gray-400">
                By: {creator}
              </p>
            </DialogHeader>

            <DialogFooter>
              {price === 0 ? (
                <Button variant={"white"} className={cn("rounded-[2px]")}>
                  <ScanSearch />
                  Enroll
                </Button>
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
