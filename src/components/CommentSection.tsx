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

export const CommentSection = ({
  comment,
  user,
}: {
  comment: {
    id: number;
    text: string;
  };
  user: {
    image: string;
    name: string;
    email: string;
  };
}) => {
  return (
    <section
      className={`mt-10 flex w-screen items-start justify-center md:ml-8 lg:ml-0`}
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
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-md text-gray-300">{comment.text}</p>
        </CardContent>
      </Card>
    </section>
  );
};
