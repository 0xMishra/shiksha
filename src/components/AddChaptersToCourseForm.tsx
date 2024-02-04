"use client";
import { addChaptersToCourse } from "@/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UploadButton } from "@/utils/uploadthing";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "./ui/use-toast";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  desc: z.string().min(5),
});

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled variant={"primary"} className="w-[70px]">
          <Loader2 className="animate-spin" />
        </Button>
      ) : (
        <Button
          type="submit"
          variant={"primary"}
          className="w-[70px] text-center"
        >
          Submit
        </Button>
      )}
    </>
  );
};

export const AddChaptersToCourseForm = ({ courseId }: { courseId: string }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      desc: "",
    },
  });

  async function addChaptersToCourseAction(formData: FormData) {
    let res;
    if (videoUrl.length > 0) {
      res = await addChaptersToCourse(formData);
    }
    if (res === "success") {
      formRef.current?.reset();
      setVideoUrl("");
      toast({
        variant: "default",
        title: "chapter added",
        description: "New chapter added to the course successfully",
      });
    } else if (res === "zod error") {
      setVideoUrl("");
      toast({
        variant: "destructive",
        title: "invalid input length",
        description: "Input is invalid either too short or too long",
      });
    }
  }

  return (
    <div className="mt-10 flex h-[100%] w-[100%] items-start justify-center  lg:justify-center">
      <Card className="w-[90%] max-w-[700px]">
        <CardHeader>
          <CardTitle>Add new chapter</CardTitle>
          <CardDescription>provide chapter info</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              ref={formRef}
              action={addChaptersToCourseAction}
              className="space-y-8"
            >
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    required
                    min={3}
                    placeholder="name of chapter (minimum 3 characters)"
                    name="name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              <FormItem>
                <FormLabel>Desc</FormLabel>
                <FormControl>
                  <Input
                    required
                    placeholder="description of the chapter (minimum 5 characters)"
                    name="desc"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              <FormItem>
                <FormLabel>Video</FormLabel>
                <FormControl>
                  <div className="flex flex-col items-center justify-between ">
                    <UploadButton
                      endpoint="videoUploader"
                      onUploadBegin={() => {
                        setIsUploading(true);
                      }}
                      onClientUploadComplete={(res) => {
                        console.log("Files: ", res);
                        setIsUploading(false);
                        if (res[0]?.url) {
                          setVideoUrl(res[0].url);
                        }
                        alert("Upload Completed");
                      }}
                      onUploadError={(error: Error) => {
                        setIsUploading(false);
                        alert(`ERROR! ${error.message}`);
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>

              <input
                type="text"
                value={videoUrl}
                onChange={() => {
                  console.log;
                }}
                hidden
                name="videoUrl"
              />

              {videoUrl ? (
                <div className="relative ">
                  <video src={videoUrl} width="400" controls />
                </div>
              ) : isUploading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className=" animate-spin " size={30} />
                </div>
              ) : (
                ""
              )}

              <input
                type="text"
                defaultValue={courseId}
                hidden
                name="courseId"
              />
              <SubmitButton />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
