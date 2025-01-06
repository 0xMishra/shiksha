"use client";
import { Loader2, NotebookPen } from "lucide-react";
import { useActionState, useEffect } from "react";
import { createChapterCommentAction } from "~/actions/chapters";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { toast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";
import { Textarea } from "./ui/textarea";

const initialState = null;

export function CreateCommentForm({
  chapterId,
  courseId,
  creatorId,
}: {
  chapterId: string;
  creatorId: string;
  courseId: string;
}) {
  const [state, formAction, pending] = useActionState(
    createChapterCommentAction,
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
      className={`mt-10 flex w-screen items-start justify-center md:ml-8 lg:ml-0`}
    >
      <Card
        className={cn("w-[90%] max-w-[700px] bg-accent")}
        style={{ backgroundColor: "#171717" }}
      >
        <CardHeader>
          <CardTitle className="text-2xl">Write a comment</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="grid w-full items-center gap-4">
              <div className="mt-2 flex flex-col space-y-1.5">
                <Label htmlFor="comment" className="text-lg">
                  Comment
                </Label>
                <Textarea
                  id="comment"
                  name="comment"
                  placeholder="Leave a comment"
                />
                {state?.msg === "comment" && (
                  <p style={{ color: "red" }}>comment can't be empty</p>
                )}
              </div>
            </div>

            <Input
              name="chapterId"
              value={chapterId}
              readOnly
              className="hidden"
            />

            <Input
              name="creatorId"
              value={creatorId}
              readOnly
              className="hidden"
            />

            <Input
              name="courseId"
              value={courseId}
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
