import { redirect } from "next/navigation";
import { UserAuthButton } from "~/components/UserAuthButton";
import { getAuthSession } from "~/server/auth/config";

const signinPage = async () => {
  const session = await getAuthSession();

  if (session?.user) {
    return redirect("/");
  }
  return (
    <div className="flex h-[100vh] w-[100vw] items-center justify-center overflow-hidden">
      <div className="z-[2] flex h-[100%] w-[100%] items-center justify-center">
        <div className="relative -top-10 flex w-[90vw] max-w-[400px] flex-col items-center justify-center rounded-lg bg-[#171717] p-4">
          <h1 className="pr-1 text-3xl font-semibold tracking-tight">
            Welcome To
            <span className="bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text pl-2 pr-1 font-black tracking-tighter text-transparent">
              Shiksha
            </span>
          </h1>
          <p className="mx-auto max-w-xs pb-4 pt-4 text-center text-lg font-light text-gray-400">
            By continuing you are setting up a Shiksha account and agree to our
            User agreement and Privacy Policy
          </p>

          <UserAuthButton />
        </div>
      </div>
      <div className="absolute bottom-0 -z-[20] h-60 w-96 rounded-t-full bg-gradient-to-t from-blue-700 to-blue-400 blur-[16rem]"></div>
    </div>
  );
};

export default signinPage;
