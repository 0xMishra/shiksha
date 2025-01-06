import { AvatarImage } from "@radix-ui/react-avatar";
import { cn } from "~/lib/utils";
import { Avatar } from "./ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Star } from "lucide-react";

export const ReviewSection = ({
  review,
  user,
}: {
  review: {
    id: string;
    text: string;
    ratings: number;
  };
  user: {
    image: string;
    name: string;
    email: string;
  };
}) => {
  return (
    <section
      className={`mt-8 flex w-screen items-start justify-center md:ml-8 lg:ml-0`}
    >
      <Card
        className={cn("w-[90%] max-w-[700px] bg-accent")}
        style={{ backgroundColor: "#171717" }}
      >
        <CardHeader>
          <div className="flex w-[100%] items-center justify-between">
            <div className="flex items-center justify-start">
              <div className="pr-2">
                <Avatar>
                  <AvatarImage src={user.image} />
                </Avatar>
              </div>
              <div className="flex flex-col items-start justify-center pl-1">
                <CardTitle className="text-xl">{user.name}</CardTitle>
                <CardDescription className="text-md">
                  <a href={`mailto:${user.email}`} target="_blank">
                    {user.email}
                  </a>
                </CardDescription>
              </div>
            </div>

            <div>
              <p className="flex items-center justify-center text-sm text-white">
                {Array.from({ length: review.ratings }, (_, i) => (
                  <Star key={i} className="text-sm" size={15} />
                ))}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-md text-gray-300">{review.text}</p>
        </CardContent>
      </Card>
    </section>
  );
};
