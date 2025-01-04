"use client";
import { Loader2, NotebookPen } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { updateCourseAction } from "~/actions/courses";
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
type LocalCourse = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string;
  creatorId: string;
};

export function CourseUpdateForm({ course }: { course: LocalCourse }) {
  const [imagePreview, setImagePreview] = useState<string | null>(course.image);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState(
    updateCourseAction,
    initialState,
  );

  const [updateCourseData, setUpdateCourseData] = useState<
    Pick<LocalCourse, "name" | "description" | "price" | "image">
  >({
    name: course.name,
    image: course.image,
    price: course.price,
    description: course.description ? course.description : "",
  });

  useEffect(() => {
    if (state?.msg === "error") {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  }, [state]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the first file

    if (!file) {
      setErrorMessage("No file selected");
      return;
    }

    // Check if the file is an image
    if (!file.type.startsWith("image/")) {
      setErrorMessage("The selected file is not an image.");
      return;
    }

    // Convert the image to Base64
    const reader = new FileReader();
    reader.onload = () => {
      setUpdateCourseData({
        ...updateCourseData,
        image: reader.result as string,
      }); // Base64 string
    };
    reader.onerror = () => {
      setErrorMessage("Failed to read the file.");
    };
    reader.readAsDataURL(file); // Convert to Base64 format

    setErrorMessage(null);
  };

  return (
    <section
      className={`${imagePreview ? "my-28" : ""} flex h-screen w-screen items-center justify-center md:ml-8 lg:ml-0`}
    >
      <Card
        className={cn("w-[90%] max-w-[700px] bg-accent")}
        style={{ backgroundColor: "#171717" }}
      >
        <CardHeader>
          <CardTitle className="text-2xl">{course.name}</CardTitle>
          <CardDescription className="text-lg">
            Update information about your course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={(formData) => {
              formAction(formData);
            }}
          >
            <div className="grid w-full items-center gap-4">
              <div className="mt-2 flex flex-col space-y-1.5">
                <Label htmlFor="name" className="text-lg">
                  Name
                </Label>
                <Input
                  id="name"
                  value={updateCourseData.name}
                  onChange={(e) =>
                    setUpdateCourseData({
                      ...updateCourseData,
                      name: e.target.value,
                    })
                  }
                  name="name"
                  placeholder="Name of your course"
                />
                {state?.msg === "name" && (
                  <p style={{ color: "red" }}>
                    name should be of atleast 3 characters
                  </p>
                )}
              </div>

              <div className="mt-2 flex flex-col space-y-1.5">
                <Label htmlFor="desc" className="text-lg">
                  Description
                </Label>
                <Textarea
                  id="desc"
                  name="desc"
                  //@ts-ignore
                  value={updateCourseData.description}
                  onChange={(e) =>
                    setUpdateCourseData({
                      ...updateCourseData,
                      description: e.target.value,
                    })
                  }
                  placeholder="description of your course"
                />
              </div>

              <div className="mt-2 flex flex-col space-y-1.5">
                <Label htmlFor="price" className="text-lg">
                  Price
                </Label>
                <Input
                  id="price"
                  name="price"
                  value={updateCourseData.price.toString()}
                  onChange={(e) =>
                    setUpdateCourseData({
                      ...updateCourseData,
                      price: parseInt(e.target.value),
                    })
                  }
                  placeholder="Price of the course (enter 0 if it's free)"
                  type="number"
                />
                {state?.msg === "price" && (
                  <p style={{ color: "red" }}>Minimum price accepted is 0</p>
                )}
              </div>

              <div className="mt-2 flex flex-col space-y-1.5">
                <Label htmlFor="image" className="text-lg">
                  Thumbnail
                </Label>
                <Input
                  placeholder="Thumbnail of your course"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {state?.msg === "image" && (
                  <p style={{ color: "red" }}>Thumbnail is required</p>
                )}
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                {imagePreview && (
                  <div className="mt-3">
                    <img
                      src={updateCourseData.image}
                      alt="Uploaded"
                      style={{ maxWidth: "100%", marginTop: "2rem" }}
                    />
                    <Input
                      id="image"
                      name="image"
                      value={updateCourseData.image}
                      readOnly
                      className="hidden"
                    />
                    <Input
                      id="courseId"
                      name="courseId"
                      value={course.id}
                      readOnly
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>
            {pending ? (
              <Button variant="white" disabled className="mt-6 w-24">
                <Loader2 className="animate-spin" />
              </Button>
            ) : (
              <Button variant="white" type="submit" className="mt-6 w-24">
                <NotebookPen />
                Update
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
