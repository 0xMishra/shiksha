import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

type CourseInfo = {
  id: string;
  image: string;
  title: string;
  numberOfChapters: number;
  price: number;
  numberOfBuyers: number;
};

export const CoursesSoldInfoCard = ({
  id,
  image,
  title,
  numberOfChapters,
  price,
  numberOfBuyers,
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
        </CardHeader>
        <CardContent>
          <p>{numberOfChapters} chapters</p>
          <p className="mt-4">Price: {price} USD</p>
          <p className="font-semibold">Revenue: {numberOfBuyers * price} USD</p>
        </CardContent>
      </Card>
    </Link>
  );
};
