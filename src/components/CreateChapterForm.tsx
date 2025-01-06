"use client";
import { Loader2, NotebookPen } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { createChapterAction } from "~/actions/chapters";
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
import { UploadButton } from "~/utils/uploadthing";
import { Textarea } from "./ui/textarea";
import { VideoRenderer } from "./VideoRenderer";

const initialState = null;

export function CreateChapterForm({ courseId }: { courseId: string }) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");

  const [state, formAction, pending] = useActionState(
    createChapterAction,
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
      setImagePreview(reader.result as string); // Base64 string
    };
    reader.onerror = () => {
      setErrorMessage("Failed to read the file.");
    };
    reader.readAsDataURL(file); // Convert to Base64 format

    setErrorMessage(null);
  };

  return (
    <section
      className={`my-32 flex w-screen items-center justify-center md:ml-8 lg:ml-0`}
    >
      <Card
        className={cn("w-[90%] max-w-[700px] bg-accent")}
        style={{ backgroundColor: "#171717" }}
      >
        <CardHeader>
          <CardTitle className="text-2xl">Create chapter</CardTitle>
          <CardDescription className="text-lg">
            Provide information about this chapter
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={(formData) => {
              setImagePreview("");
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
                  name="name"
                  placeholder="Name of the chapter"
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
                  placeholder="description of the chapter"
                />
              </div>

              <div className="mt-2 flex flex-col space-y-1.5">
                <Label htmlFor="image" className="text-lg">
                  Thumbnail
                </Label>
                <Input
                  placeholder="Thumbnail of the chapter"
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
                      src={imagePreview}
                      alt="Uploaded"
                      style={{ maxWidth: "100%", marginTop: "2rem" }}
                    />
                    <Input
                      id="image"
                      name="image"
                      value={imagePreview}
                      readOnly
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>
            <Input
              id="courseId"
              name="courseId"
              value={courseId}
              readOnly
              className="hidden"
            />

            <div className="my-8">
              <Label htmlFor="image" className="mb-4 text-lg">
                Video content
              </Label>
              <UploadButton
                endpoint="videoUploader"
                className="mt-4 ut-button:rounded-[1rem] ut-button:bg-blue-600 ut-button:bg-gradient-to-b ut-button:from-blue-400 ut-button:to-blue-700 ut-allowed-content:text-white ut-button:ut-readying:bg-blue-500/50"
                onUploadBegin={(res) => {
                  setVideoUrl("");
                }}
                onClientUploadComplete={(res) => {
                  // Do something with the response
                  console.log("Files: ", res);
                  toast({
                    title: "Upload successful",
                  });

                  setVideoUrl(JSON.stringify(res));
                }}
                onUploadError={(error: Error) => {
                  // Do something with the error.

                  toast({
                    variant: "destructive",
                    title: "Something went wrong.",
                    description: `${error}`,
                  });
                }}
              />
              {videoUrl ? (
                <VideoRenderer src={JSON.parse(videoUrl)[0].url} />
              ) : (
                ""
              )}
            </div>
            {state?.msg === "video" && (
              <p style={{ color: "red" }}>chapter video is required</p>
            )}

            <Input
              id="video"
              name="video"
              value={videoUrl}
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
                Add
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
