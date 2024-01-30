"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { getChapterSchema } from "@/schemas/getChapterSchema";
import * as z from "zod";

type ChaptersInfo = {
  id: string;
  name: string;
  description: string;
  videoUrl: string;
  courseId: string;
  isCompleted: boolean;
};

const Course = ({
  chapters,
  isUserCourseCreator,
  courseName,
  courseId,
}: {
  chapters: ChaptersInfo[];
  isUserCourseCreator: boolean;
  courseName: string;
  courseId: string;
}) => {
  const [chapterId, setChapterId] = useState<string>("");
  const [isFirst, setIsFirst] = useState<boolean>(true);
  const [chapter, setChapter] = useState<z.infer<typeof getChapterSchema>>();

  const getChapter = async () => {
    const chapter = await axios.get(`/api/chapter?id=${chapterId}`);
    const parsedChapter = getChapterSchema.parse(chapter.data);
    setChapter(parsedChapter);
    return parsedChapter;
  };

  useEffect(() => {
    if (isFirst && chapters[0]) {
      setChapterId(chapters[0]?.id);
    }
  }, [isFirst, chapters]);

  useEffect(() => {
    if (chapterId.length > 0) {
      getChapter()
        .then((data) => {
          console.log(data);
        })
        .catch((error) => console.log(error));
    }
  }, [chapterId]);

  return (
    <main>
      <div>
        <div
          className={
            "fixed inset-y-0 left-0  z-20 mt-[60px] hidden w-64 translate-x-0 transform border-r-[1px] border-solid border-r-gray-800 bg-white p-4 text-black transition-transform duration-300 ease-in-out md:block"
          }
        >
          <div className="mt-8 flex cursor-pointer flex-col items-center justify-center py-2 ">
            {chapters ? (
              chapters.map((chapter) => {
                let extraClasses = "";
                if (chapter.id === chapterId) {
                  extraClasses = "bg-lime-900 text-white";
                }
                return (
                  <div
                    key={chapter.id}
                    onClick={() => {
                      setIsFirst(false);
                      setChapterId(chapter.id);
                    }}
                    className={cn(
                      "my-4 flex w-[100%] items-center justify-center space-x-2 border-[1px] border-solid border-gray-800 py-2 transition-all hover:bg-lime-900/90  hover:text-white",
                      extraClasses,
                    )}
                  >
                    <p>{chapter.name}</p>
                  </div>
                );
              })
            ) : (
              <h2 className="text-xl font-semibold text-gray-300">
                No chapters yet
              </h2>
            )}
          </div>
        </div>
        <section className="mt-4 flex w-[100vw] flex-col items-center justify-center p-2 md:ml-64 md:pr-72 ">
          <div className="flex w-[100%] items-center justify-between gap-2">
            <h2 className="text-2xl font-semibold">{courseName}</h2>
            {isUserCourseCreator ? (
              <Button variant={"primary"} asChild>
                <Link href={`/courses/create/${courseId}/add-chapters`}>
                  Add chapters
                </Link>
              </Button>
            ) : (
              <Button variant={"primary"} asChild>
                <Link href={`/`}>Browse courses</Link>
              </Button>
            )}
          </div>

          <div>
            <video src={chapter?.videoUrl} />
          </div>
        </section>
      </div>
    </main>
  );
};

export default Course;