"use client";
import { DeleteIcon, Loader2 } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { deleteChapterAction } from "~/actions/chapters";
import { toast } from "~/hooks/use-toast";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const initialState = null;

export function DeleteChapter({ chapterId }: { chapterId: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <div
        onClick={() => {
          setIsOpen(true);
        }}
        className="transform cursor-pointer rounded-full bg-gradient-to-r from-red-600 via-pink-500 to-red-500 px-5 py-2 text-white shadow-lg transition-all duration-300 hover:scale-105"
      >
        DELETE
      </div>
      <AlertDialog
        isOpen={isOpen}
        chapterId={chapterId}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

const DeleteChapterActionButton = ({ chapterId }: { chapterId: string }) => {
  const [state, formAction, pending] = useActionState(
    deleteChapterAction,
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
      <Input value={chapterId} name="chapterId" className="hidden" readOnly />
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

function AlertDialog({
  isOpen,
  onClose,
  chapterId,
}: {
  isOpen: boolean;
  chapterId: string;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      onClick={onClose}
    >
      <div
        className="w-96 rounded-lg p-6 shadow-lg"
        style={{ background: "#171717", color: "rgb(209 213 219)" }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the dialog
      >
        <h2 className="mb-4 text-lg font-semibold">Delete chapter</h2>
        <p className="mb-1">Are you sure you want to delete this chapter?</p>
        <p className="mb-6">You won't be able to retrieve it again</p>
        <div className="flex justify-end space-x-2">
          <button
            className="rounded-[0.5rem] bg-gray-700 px-4 py-2 text-gray-300 hover:bg-gray-600"
            onClick={onClose}
          >
            Close
          </button>
          <DeleteChapterActionButton chapterId={chapterId} />
        </div>
      </div>
    </div>
  );
}
