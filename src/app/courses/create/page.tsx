import { CreateCourseForm } from "@/components/CreateCourseForm";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

const CreateCoursePage = async () => {
  const session = await getServerAuthSession();
  if (!session) {
    return redirect("/sign-up");
  }

  return (
    <section className=" mt-4 flex w-[100vw] flex-col items-center justify-center p-2 md:ml-64 md:pr-72 ">
      <div className="w-[100%]">
        <CreateCourseForm />
      </div>
    </section>
  );
};

export default CreateCoursePage;
