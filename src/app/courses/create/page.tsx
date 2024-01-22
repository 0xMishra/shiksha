import { CreateCourseForm } from "@/components/CreateCourseForm";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

const CreateCoursePage = async () => {
  const session = await getServerAuthSession();
  if (!session) {
    return redirect("/sign-up");
  }

  return (
    <section className="mt-[100px] flex h-[100vh] w-[100vw] items-center justify-center p-2 md:ml-64 ">
      <CreateCourseForm />
    </section>
  );
};

export default CreateCoursePage;
