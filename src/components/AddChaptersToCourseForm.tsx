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
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useRef, useState } from "react";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  desc: z.string().min(5),
});

export const AddChaptersToCourseForm = ({ courseId }: { courseId: string }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [videoUrl, setVideoUrl] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      desc: "",
    },
  });

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
              action={async (formData: FormData) => {
                setIsLoading(true);
                await addChaptersToCourse(formData);
                formRef.current?.reset();
                setIsLoading(false);
              }}
              className="space-y-8"
            >
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input required placeholder="name of chapter" name="name" />
                </FormControl>
                <FormDescription>
                  This is the name of the chapter
                </FormDescription>
                <FormMessage />
              </FormItem>

              <FormItem>
                <FormLabel>Desc</FormLabel>
                <FormControl>
                  <Input
                    required
                    placeholder="description of the chapter"
                    name="desc"
                  />
                </FormControl>
                <FormDescription>
                  This is the description of the chapter
                </FormDescription>
                <FormMessage />
              </FormItem>

              <FormItem>
                <FormLabel>Video</FormLabel>
                <FormControl>
                  <Input
                    placeholder="video of the chapter"
                    type="file"
                    required
                  />
                </FormControl>
                <FormDescription>
                  This is the video of the chapter
                </FormDescription>
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

              <input
                type="text"
                defaultValue={courseId}
                hidden
                name="courseId"
              />

              {isLoading ? (
                <Button disabled variant={"primary"}>
                  <Loader2 />
                </Button>
              ) : (
                <Button type="submit" variant={"primary"}>
                  Submit
                </Button>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
