import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

const BuyCoursePage = async ({
  params,
}: {
  params: {
    courseId: string;
  };
}) => {
  const session = await getServerAuthSession();
  if (!session) {
    return redirect("/sign-up");
  }
  return <div>{params.courseId}</div>;
};

export default BuyCoursePage;
