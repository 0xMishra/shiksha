"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { markChapterAsCompleteAction } from "~/actions/chapters";

export const MarkChapterAsComplete = ({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <Button
      disabled={isLoading}
      onClick={() => {
        setIsLoading(true);
        markChapterAsCompleteAction({ courseId, chapterId });
      }}
      className="flex w-48 cursor-pointer items-center justify-center rounded-[0.5rem] bg-blue-700 p-2 font-semibold text-white hover:bg-blue-900"
    >
      {isLoading ? <Loader2 className="animate-spin" /> : "MARK AS COMPLETE"}
    </Button>
  );
};
