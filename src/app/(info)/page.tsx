import { CourseInfoCard } from "@/components/CourseInfoCard";
import { Searchbar } from "@/components/Searchbar";
import { db } from "@/server/db";

export default async function HomePage() {
  const courses = await db.course.findMany();

  return (
    <main className="flex flex-col items-center justify-center md:flex-row">
      <div className="flex w-[99%] flex-col items-center justify-center">
        <div className="mt-4 flex  md:hidden">
          <Searchbar />
        </div>
        <div className="mb-2 mt-6 md:ml-64">
          <div className="flex flex-wrap justify-center gap-12">
            {courses
              ? courses.map((course) => (
                  <CourseInfoCard key={course.id} {...course} />
                ))
              : ""}
          </div>
        </div>
      </div>
    </main>
  );
}
