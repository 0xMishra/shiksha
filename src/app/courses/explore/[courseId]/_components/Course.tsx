"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { getChapterSchema } from "@/schemas/getChapterSchema";
import axios from "axios";
import {
  CheckCircle2,
  Loader2,
  NotebookPen,
  Pause,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type * as z from "zod";

type ChaptersInfo = {
  id: string;
  name: string;
  description: string;
  videoUrl: string;
  courseId: string;
};

export const Course = ({
  chapters,
  isUserCourseCreator,
  courseName,
  courseId,
  hasUserBoughtThisCourse,
  coursePreview,
  coursePrice,
}: {
  chapters: ChaptersInfo[];
  isUserCourseCreator: boolean;
  courseName: string;
  courseId: string;
  hasUserBoughtThisCourse: boolean;
  coursePreview: string;
  coursePrice: string;
}) => {
  const [chapterId, setChapterId] = useState<string>("");
  const [isFirst, setIsFirst] = useState<boolean>(true);
  const [chapter, setChapter] = useState<z.infer<typeof getChapterSchema>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState<boolean>(false);
  const userHasThisCourse = isUserCourseCreator || hasUserBoughtThisCourse;
  const [isChapterCompleted, setIsChapterCompleted] = useState<boolean>(false);
  const [markCompleteLoading, setMarkCompleteLoading] =
    useState<boolean>(false);

  const handlePayment = async () => {
    try {
      setIsPaymentLoading(true);
      const response = await axios.post(`/api/${courseId}/checkout`);
      window.location.assign(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "something went wrong",
      });
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const markComplete = async () => {
    setMarkCompleteLoading(true);
    await axios.get(`/api/${courseId}/mark-complete?id=${chapter?.id}`);
    const fetchedChapter = await axios.get(
      `/api/chapter?id=${chapterId}&courseId=${courseId}`,
    );
    const parsedChapter = getChapterSchema.parse(fetchedChapter.data);
    setIsChapterCompleted(parsedChapter.isCompleted);
    setChapter(parsedChapter);
    setMarkCompleteLoading(false);
  };

  useEffect(() => {
    if (isFirst && chapters[0]) {
      setChapterId(chapters[0]?.id);
    }
  }, [isFirst, chapters]);

  useEffect(() => {
    const getChapter = async () => {
      setIsLoading(true);
      const chapter = await axios.get(
        `/api/chapter?id=${chapterId}&courseId=${courseId}`,
      );
      const parsedChapter = getChapterSchema.parse(chapter.data);
      setIsChapterCompleted(parsedChapter.isCompleted);
      setChapter(parsedChapter);
      setIsLoading(false);
      return parsedChapter;
    };

    if (chapterId.length > 0) {
      getChapter()
        .then((_data) => {})
        .catch((_error) => {});
    }

    if (chapterId.length === 0 || !userHasThisCourse) {
      setIsLoading(false);
    }
  }, [chapterId, courseId]);

  return (
    <main className="w-[100vw]">
      <div className="w-[100%]">
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
                      "my-4 flex w-[100%] items-center justify-center gap-1 space-x-2 border-[1px] border-solid border-gray-800 py-2 transition-all hover:bg-lime-900/90  hover:text-white",
                      extraClasses,
                    )}
                  >
                    {isChapterCompleted ? (
                      <CheckCircle2 size={30} />
                    ) : chapter.id === chapterId ? (
                      <Pause size={30} />
                    ) : (
                      <PlayCircle size={30} />
                    )}
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

        <section className="mt-4 flex flex-col items-center justify-center p-4 md:ml-64 md:w-[100vw] md:pr-72 ">
          <div className="flex w-[90vw] flex-col items-center justify-between gap-2 md:w-[100%] lg:flex-row">
            <h2 className="text-2xl font-semibold">{courseName}</h2>
            {isUserCourseCreator ? (
              <Button variant={"primary"} asChild>
                <Link href={`/courses/create/${courseId}/add-chapters`}>
                  Add chapters
                </Link>
              </Button>
            ) : hasUserBoughtThisCourse ? (
              <div className=" mt-4 flex items-center justify-center gap-2 md:top-0 md:flex-row">
                <Button variant={"primary"} asChild>
                  <Link href={`/`}>Browse courses</Link>
                </Button>
                {isChapterCompleted ? (
                  <p className="font-semibold text-lime-900 ">completed</p>
                ) : markCompleteLoading ? (
                  <Button
                    variant={"ghost"}
                    className="rounded-md border-[1px] border-solid border-lime-900 bg-white font-semibold text-lime-900 hover:text-lime-900  "
                    disabled
                  >
                    <Loader2 className="mr-2 animate-spin text-lime-900" />
                  </Button>
                ) : chapter?.id ? (
                  <Button
                    variant={"ghost"}
                    className="rounded-md border-[1px] border-solid border-lime-900 bg-white font-semibold text-lime-900 hover:text-lime-900  "
                    onClick={markComplete}
                  >
                    Mark complete
                  </Button>
                ) : (
                  ""
                )}
              </div>
            ) : isPaymentLoading ? (
              <Button variant={"primary"} disabled>
                <Loader2 className="mr-2 animate-spin text-white" />
              </Button>
            ) : (
              <Button variant={"primary"} onClick={handlePayment}>
                Buy Course
              </Button>
            )}
          </div>

          <div className="m-3">
            {chapter ? (
              <video
                src={chapter.videoUrl}
                controls
                className="mt-6 max-h-[900px] w-[90vw] md:w-auto"
              />
            ) : isLoading ? (
              <Loader2 className="mr-2 mt-20 h-12 w-12 animate-spin text-lime-900" />
            ) : !userHasThisCourse ? (
              <div className="">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-xl">Course Preview</h3>
                  <h3 className="ml-2 text-xl">
                    Price: {coursePrice === "0" ? "Free" : coursePrice + " INR"}
                  </h3>
                </div>
                {coursePreview ? (
                  <video
                    src={coursePreview}
                    controls
                    className="mt-6 max-h-[900px] w-[90vw] md:w-auto"
                  />
                ) : (
                  <h3 className="flex h-[400px] w-[100%] items-center justify-center text-3xl font-semibold text-gray-400">
                    No course preview
                  </h3>
                )}
              </div>
            ) : (
              ""
            )}
            <p className="mt-6 text-xl text-gray-600">{chapter?.description}</p>
          </div>
        </section>

        <div className="md:hidden">
          <Drawer>
            <div className="flex items-center justify-center">
              <DrawerTrigger className="m-4 my-4 mt-10  flex w-[70vw] items-center justify-center space-x-2 border-[1px] border-solid border-gray-800 py-2 text-center text-lime-900 transition-all  hover:bg-lime-900/90 hover:text-white md:hidden">
                <NotebookPen size={30} />
                <p className="text-xl font-semibold ">Show chapters</p>
              </DrawerTrigger>
            </div>
            <DrawerContent>
              <section className="flex items-center justify-center">
                <div
                  className={
                    " inset-y-0 mt-6 flex w-[90vw] translate-x-0 transform items-center justify-center bg-white p-4 text-black transition-transform duration-300 ease-in-out md:hidden"
                  }
                >
                  <div className="flex w-[100%] cursor-pointer flex-col items-center justify-center py-2 ">
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
                              "my-4 flex w-[100%] items-center justify-center gap-1 space-x-2 border-[1px] border-solid border-gray-800 py-2 transition-all hover:bg-lime-900/90  hover:text-white",
                              extraClasses,
                            )}
                          >
                            {isChapterCompleted ? (
                              <CheckCircle2 size={30} />
                            ) : chapter.id === chapterId ? (
                              <Pause size={30} />
                            ) : (
                              <PlayCircle size={30} />
                            )}
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
              </section>
              <DrawerClose>
                <div className="mb-2 font-semibold text-red-600">Close</div>
              </DrawerClose>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </main>
  );
};
