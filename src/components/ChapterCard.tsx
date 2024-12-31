import Image from "next/image";
import Link from "next/link";

export const ChapterCard = async ({
  image,
  courseId,
  id,
  name,
}: {
  courseId: string;
  id: number;
  image: string;
  name: string;
}) => {
  return (
    <div className="w-[100%] max-w-[600px] rounded-[2px] rounded-tl-[1rem] rounded-tr-[1rem] border-[2px] border-solid border-gray-800 bg-[#171717]">
      <Link href={`/courses/${courseId}/chapters/${id}`} className="w-[100%]">
        <Image
          src={image}
          alt="course thumbnail"
          className="h-[150px] w-[100%] rounded-tl-[1rem] rounded-tr-[1rem] object-cover"
          width={1000}
          height={1000}
        />
        <p className="p-4 text-2xl font-semibold">{name}</p>
      </Link>
    </div>
  );
};
