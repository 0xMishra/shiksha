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
      className="flex transform cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-green-900 via-green-800 to-green-700 px-5 py-2 text-white shadow-lg transition-all duration-300 hover:scale-105"
    >
      {isLoading ? <Loader2 className="animate-spin" /> : "Mark Complete"}
    </Button>
  );
};
