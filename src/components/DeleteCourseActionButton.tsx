import { DeleteIcon, Loader2 } from "lucide-react";
import { useActionState, useEffect } from "react";
import { deleteCourseAction } from "~/actions/courses";
import { toast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const initialState = null;

export const DeleteCourseActionButton = ({
  courseId,
}: {
  courseId: string;
}) => {
  const [state, formAction, pending] = useActionState(
    deleteCourseAction,
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
        disabled={pending}
        className={cn(
          "w-24 rounded-[0.5rem] bg-red-700 px-4 py-2 text-gray-300 hover:bg-red-900",
        )}
      >
        {pending ? (
          <Loader2 className="animate-spin" />
        ) : (
          <div className="flex items-center justify-center space-x-1 font-semibold">
            <DeleteIcon className="mr-1" />
            Delete
          </div>
        )}
      </Button>
    </form>
  );
};
