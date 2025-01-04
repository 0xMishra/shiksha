"use client";
import React, { useActionState, useEffect } from "react";
import { enrollInAFreeCourseAction } from "~/actions/courses";
import { toast } from "~/hooks/use-toast";
import { Input } from "./ui/input";
import { Loader2, ScanSearch } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "~/lib/utils";

const initialState = null;

export const EnrollInAFreeCourseButton = ({
  courseId,
}: {
  courseId: string;
}) => {
  const [state, formAction, pending] = useActionState(
    enrollInAFreeCourseAction,
    initialState,
  );

  useEffect(() => {
    if (state?.msg === "error") {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  }, [state]);
  return (
    <form action={formAction}>
      <Input value={courseId} name="courseId" className="hidden" readOnly />
      <Button
        type="submit"
        variant={"white"}
        disabled={pending}
        className={cn("rounded-[2px]")}
      >
        {pending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <div className="flex items-center justify-center space-x-1">
            <ScanSearch className="mr-1" />
            Enroll
          </div>
        )}
      </Button>
    </form>
  );
};
