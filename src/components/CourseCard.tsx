import { IndianRupee } from "lucide-react";
import Image from "next/image";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";

export const CourseCard = () => {
  return (
    <div className="w-[100%] max-w-[600px] rounded-[2px] border-[2px] border-solid border-gray-800">
      <Image
        src={
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.KqoU0C_KAgIDRWJ_aWHuCwHaE7%26pid%3DApi&f=1&ipt=0f6b1af6a304c0f63631ef2275c45d24804c75653cc5f8ae6bde4a3781d07772&ipo=images"
        }
        alt="course thumbnail"
        className="h-[200px] w-[100%] object-cover"
        width={1000}
        height={1000}
      />
      <p className="px-4 pt-2 text-2xl font-semibold">{"course name"}</p>
      <p className="px-4 pb-2 text-xl font-semibold text-gray-400">
        {"course creator"}
      </p>

      <div className="mx-4 mb-4 mt-3 flex items-center justify-between">
        <Button variant={"white"} className={cn("rounded-[2px]")}>
          <IndianRupee />
          Buy course
        </Button>
        <div>
          <p className="text-3xl font-semibold text-gray-400">{"₹2344"}</p>
        </div>
      </div>
    </div>
  );
};
