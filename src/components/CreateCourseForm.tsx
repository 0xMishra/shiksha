"use client";
import { createCourse } from "@/actions";
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
import Image from "next/image";
import { useRef, useState, type ChangeEvent } from "react";
import { toast } from "./ui/use-toast";
import { useFormStatus } from "react-dom";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  price: z.string().min(1),
});

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled variant={"primary"} className="w-[70px]">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

export const CreateCourseForm = () => {
  const [imageData, setImageData] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        // `reader.result` contains the base64-encoded data URL
        setImageData(reader.result as string);
      };

      // Read the file as a data URL
      reader.readAsDataURL(file);
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: "",
    },
  });

  async function createCourseAction(formData: FormData) {
    const res = await createCourse(formData);
    if (res === "success") {
      formRef.current?.reset();
      setImageData("");

      toast({
        variant: "default",
        title: "course created",
        description: "A new course created successfully",
      });
    } else if (res === "zod error") {
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
          <CardTitle>Create Course</CardTitle>
          <CardDescription>provide course info.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              ref={formRef}
              action={createCourseAction}
              className="space-y-8"
            >
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    required
                    min={4}
                    placeholder="name of course (minimum 4 characters)"
                    name="name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    required
                    placeholder="price of course (input 0 if it's free)"
                    name="price"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              <FormItem>
                <FormLabel>Banner</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name of course"
                    type="file"
                    onChange={handleImageChange}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              <input
                type="text"
                value={imageData}
                onChange={() => {
                  console.log;
                }}
                hidden
                name="banner"
              />

              {imageData && (
                <div>
                  <p>Preview:</p>
                  <Image
                    src={imageData}
                    alt="Preview"
                    className="h-[200px] w-[90%] object-contain pr-3"
                    width={900}
                    height={900}
                  />
                </div>
              )}

              <SubmitButton />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
