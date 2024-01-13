import { UserAuthForm } from "@/components/UserAuthForm";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

const SignUpPage = async () => {
  const session = await getServerAuthSession();
  if (session) {
    return redirect("/");
  }
  return (
    <div className="mt-[30vh] flex items-center justify-center">
      <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-zxl font-semibold tracking-tight ">Welcome</h1>
          <p className=" mx-auto max-w-xs text-sm">
            By continuing you are setting up a Shiksha account and agree to our
            User agreement and Privacy Policy
          </p>
          <UserAuthForm />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
