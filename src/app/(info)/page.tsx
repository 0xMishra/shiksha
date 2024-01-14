import { CourseInfoCard } from "@/components/CourseInfoCard";
import { Searchbar } from "@/components/Searchbar";

const courses = [
  {
    id: "1",
    image:
      "https://d33g7sdvsfd029.cloudfront.net/teachcode/admin/COURSE/cover/1699610005757WhatsApp-Image-2023-11-10-at-3.16.18-PM.jpeg",
    title: "Fullstack twitter Clone",
    creator: "kundan mishra",
    numberOfChapters: 22,
    price: "Free",
    isBoughtByUser: false,
    completetionRate: 0,
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center">
      <div className="flex w-[99%] flex-col items-center justify-center">
        <div className="mt-4 flex  md:hidden">
          <Searchbar />
        </div>
        <div className="mb-2 mt-6 md:ml-64">
          <div className="flex flex-wrap justify-center gap-3">
            {courses.map((course) => (
              <CourseInfoCard key={course.id} {...course} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
