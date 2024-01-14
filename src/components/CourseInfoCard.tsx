import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

type CourseInfo = {
  id: string;
  image: string;
  title: string;
  creator: string;
  numberOfChapters: number;
  price: string;
  isBoughtByUser: boolean;
  completetionRate: number;
};

export const CourseInfoCard = ({
  completetionRate,
  id,
  image,
  title,
  creator,
  numberOfChapters,
  price,
  isBoughtByUser,
}: CourseInfo) => {
  return (
    <Link href={`/courses/explore/${id}`} className="">
      <Card className="flex w-[99vw] max-w-[415px] flex-col items-start justify-center md:max-w-[300px]">
        <CardHeader className="w-[100%]">
          <Image
            src={image}
            alt="course banner "
            className="h-[200px] w-[99%] place-content-center object-cover "
            blurDataURL="blur"
            height={900}
            width={900}
            style={{
              height: "auto",
              width: "auto",
            }}
            priority
          />
          <CardTitle>{title}</CardTitle>
          <CardDescription>{creator}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{numberOfChapters} chapters</p>
          {isBoughtByUser ? (
            <p className="font-semibold">{completetionRate}% complete</p>
          ) : (
            <p className="font-semibold">{price}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
