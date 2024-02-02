"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getChapterSchema } from "@/schemas/getChapterSchema";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type * as z from "zod";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getChapter = async () => {
    setIsLoading(true);
    const chapter = await axios.get(`/api/chapter?id=${chapterId}`);
    console.log(chapter);
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
          setIsLoading(true);
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
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
            {chapters.length ? (
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
              <h2 className="text-xl font-semibold text-gray-500">
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

          <div className="m-3">
            {chapter ? (
              <video src={chapter.videoUrl} controls />
            ) : isLoading ? (
              <Loader2 className="mr-2 mt-20 h-12 w-12 animate-spin text-lime-900" />
            ) : (
              ""
            )}
            <p className="text-xl font-semibold text-gray-600">
              {chapter?.description}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Course;
