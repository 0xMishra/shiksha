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
import { Loader2 } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { toast } from "./ui/use-toast";
import { useFormStatus } from "react-dom";

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
          <Loader2 />
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      desc: "",
    },
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isVideoFile = (fileName: string): boolean => {
    const videoExtensions = [
      ".mp4",
      ".webm",
      ".ogg",
      ".mkv",
      ".avi",
      ".mov",
      ".wmv",
    ];
    const lowerCaseFileName = fileName.toLowerCase();
    return videoExtensions.some((ext) => lowerCaseFileName.endsWith(ext));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target;
    const videoPreview = videoRef.current;

    if (fileInput.files) {
      if (fileInput.files[0]) {
        const fileName = fileInput.files[0].name;

        if (isVideoFile(fileName)) {
          const reader = new FileReader();

          reader.onload = (event) => {
            const url = event.target?.result as string;
            setVideoUrl(url);

            if (videoPreview) {
              videoPreview.src = url;
            }
          };
          reader.readAsDataURL(fileInput.files[0]);
        } else {
          toast({
            variant: "destructive",
            title: "wrong input file type",
            description: "Please select a valid video file.",
          });
          fileInput.value = ""; // Clear the file input
        }
      }
    } else {
      setVideoUrl("");

      if (videoPreview) {
        videoPreview.src = "";
      }
    }
  };

  async function addChaptersToCourseAction(formData: FormData) {
    const res = await addChaptersToCourse(formData);
    if (res === "success") {
      formRef.current?.reset();
      setVideoUrl("");
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
                  <Input
                    placeholder="video of the chapter"
                    type="file"
                    required
                    onChange={handleFileChange}
                  />
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
                <div>
                  <video ref={videoRef} src={videoUrl} width="400" controls />
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
