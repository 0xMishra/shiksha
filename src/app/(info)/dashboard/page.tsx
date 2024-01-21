import { CourseInfoCard } from "@/components/CourseInfoCard";
import { CoursesSoldInfoCard } from "@/components/CoursesSoldInfoCard";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Clock4, DollarSign, NotebookPen } from "lucide-react";

const coursesBought = [
  {
    id: "1",
    image:
      "https://d33g7sdvsfd029.cloudfront.net/teachcode/admin/COURSE/cover/1699610005757WhatsApp-Image-2023-11-10-at-3.16.18-PM.jpeg",
    title: "Fullstack twitter Clone",
    creator: "kundan mishra",
    numberOfChapters: 22,
    price: "Free",
    isBoughtByUser: true,
    completetionRate: 0,
  },
];
const coursesSold = [
  {
    id: "1",
    image:
      "https://d33g7sdvsfd029.cloudfront.net/teachcode/admin/COURSE/cover/1699610005757WhatsApp-Image-2023-11-10-at-3.16.18-PM.jpeg",
    title: "Full stack web dev",
    numberOfChapters: 22,
    price: 100,
    numberOfBuyers: 12,
  },
];

const DashboardPage = () => {
  return (
    <div className="mt-8 flex  max-w-[1000px] flex-col items-center justify-center md:ml-64">
      <h1 className="mb-4 text-3xl font-semibold">Courses bought</h1>

      <section className="flex w-[100%] flex-col items-center justify-center gap-2 p-2 md:flex-row md:justify-between">
        <div className="flex flex-1 items-center justify-center gap-2">
          <Card className="flex items-center justify-center gap-2 p-2">
            <Clock4 size={40} />
            <CardHeader>
              <CardTitle>In progress</CardTitle>
              <CardDescription>{5} courses</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Card className="flex items-center justify-center gap-2 p-2">
            <CheckCircle size={40} />
            <CardHeader>
              <CardTitle>Completed</CardTitle>
              <CardDescription>{0} courses</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="flex w-[99%] flex-col items-center justify-center">
        <div className="mb-2 mt-6 md:ml-64">
          <div className="flex flex-wrap justify-center gap-3">
            {coursesBought.map((course) => (
              <CourseInfoCard key={course.id} {...course} />
            ))}
          </div>
        </div>
      </section>

      <h1 className="mb-4 mt-32 text-3xl font-semibold">Courses sold</h1>

      <section className="flex w-[100%] flex-col items-center justify-center gap-2 p-2 md:flex-row md:justify-between">
        <div className="flex flex-1 items-center justify-center gap-2">
          <Card className="flex items-center justify-center gap-2 p-2">
            <NotebookPen size={40} />
            <CardHeader>
              <CardTitle>Courses sold</CardTitle>
              <CardDescription>{5} courses</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Card className="flex items-center justify-center gap-2 p-2">
            <DollarSign size={40} />
            <CardHeader>
              <CardTitle>Total revenue</CardTitle>
              <CardDescription>{1000} USD</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="flex w-[99%] flex-col items-center justify-center">
        <div className="mb-2 mt-6 md:ml-64">
          <div className="flex flex-wrap justify-center gap-3">
            {coursesSold.map((course) => (
              <CoursesSoldInfoCard key={course.id} {...course} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
