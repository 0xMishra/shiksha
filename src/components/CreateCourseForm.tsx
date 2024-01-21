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
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { type ChangeEvent, useState } from "react";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  price: z.string().min(1),
});

export const CreateCourseForm = () => {
  const [imageData, setImageData] = useState<string>("");

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

  return (
    <div className="flex h-[100%] w-[100%] items-start justify-center md:justify-start lg:justify-center">
      <Card className="max-w-[700px] md:w-[50%]">
        <CardHeader>
          <CardTitle>Create Course</CardTitle>
          <CardDescription>provide course info.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form action={createCourse} className="space-y-8">
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input required placeholder="name of course" name="name" />
                </FormControl>
                <FormDescription>
                  This is the name of the course
                </FormDescription>
                <FormMessage />
              </FormItem>

              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input required placeholder="name of course" name="price" />
                </FormControl>
                <FormDescription>
                  This is the price of the course
                </FormDescription>
                <FormMessage />
              </FormItem>

              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name of course"
                    type="file"
                    onChange={handleImageChange}
                    required
                  />
                </FormControl>
                <FormDescription>
                  This is the banner of the course
                </FormDescription>
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

              <Button type="submit" variant={"primary"}>
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
