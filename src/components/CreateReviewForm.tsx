"use client";
import { Loader2, NotebookPen } from "lucide-react";
import { useActionState, useEffect } from "react";
import { createCourseReviewAction } from "~/actions/courses";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { toast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";
import { Textarea } from "./ui/textarea";

const initialState = null;

export function CreateReviewForm({
  courseId,
  courseName,
  creatorId,
}: {
  courseId: string;
  courseName: string;
  creatorId: string;
}) {
  const [state, formAction, pending] = useActionState(
    createCourseReviewAction,
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
    <section
      className={`mt-24 flex w-screen items-start justify-center md:ml-8 lg:ml-0`}
    >
      <Card
        className={cn("w-[90%] max-w-[700px] bg-accent")}
        style={{ backgroundColor: "#171717" }}
      >
        <CardHeader>
          <CardTitle className="text-2xl">{courseName}</CardTitle>
          <CardDescription className="text-lg">
            Post about your views on this course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="grid w-full items-center gap-4">
              <div className="mt-2 flex flex-col space-y-1.5">
                <Label htmlFor="rating" className="text-lg">
                  Rating(out of 5)
                </Label>
                <Input
                  id="rating"
                  type="number"
                  name="rating"
                  placeholder="Rate this course out of 5"
                />
                {state?.msg === "rating" && (
                  <p style={{ color: "red" }}>
                    rating should be between 1 and 5
                  </p>
                )}
              </div>

              <div className="mt-2 flex flex-col space-y-1.5">
                <Label htmlFor="review" className="text-lg">
                  Review
                </Label>
                <Textarea
                  id="review"
                  name="review"
                  placeholder="Review of the course"
                />
                {state?.msg === "review" && (
                  <p style={{ color: "red" }}>review can't be empty</p>
                )}
              </div>
            </div>

            <Input
              name="courseId"
              value={courseId}
              readOnly
              className="hidden"
            />

            <Input
              name="creatorId"
              value={creatorId}
              readOnly
              className="hidden"
            />

            {pending ? (
              <Button variant="white" disabled className="mt-6 w-24">
                <Loader2 className="animate-spin" />
              </Button>
            ) : (
              <Button variant="white" type="submit" className="mt-6 w-24">
                <NotebookPen />
                Post
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
