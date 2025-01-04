import { CheckIcon, DeleteIcon, Loader2 } from "lucide-react";
import { useActionState, useEffect } from "react";
import {
  deleteCourseAction,
  MarkAsCompleteCourseAction,
} from "~/actions/courses";
import { toast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const initialState = null;

export const MarkAsCompleteCourseActionButton = ({
  courseId,
}: {
  courseId: string;
}) => {
  const [state, formAction, pending] = useActionState(
    MarkAsCompleteCourseAction,
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
        variant={"destructive"}
        className={cn(
          "w-28 rounded-[0.5rem] bg-blue-700 px-4 py-2 text-gray-300 hover:bg-blue-900",
        )}
      >
        {pending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <div className="flex items-center justify-center space-x-1 font-semibold">
            <CheckIcon className="mr-1" />
            Completed
          </div>
        )}
      </Button>
    </form>
  );
};
