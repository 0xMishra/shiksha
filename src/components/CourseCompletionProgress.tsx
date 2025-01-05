"use client";

import * as React from "react";

import { Progress } from "~/components/ui/progress";

export function CourseCompletionProgress({ progress }: { progress: number }) {
  return <Progress value={progress} className="w-[60%]" />;
}
