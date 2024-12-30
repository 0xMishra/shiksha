import Link from "next/link";
import React from "react";

const dashboardPage = () => {
  return (
    <div className="mt-32 flex h-screen w-screen items-start justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-200">
          courses created
        </h1>
        <p className="mt-4 text-xl font-light text-gray-400">
          There are no courses here yet
        </p>
        <div className="mt-6 flex justify-center">
          <div className="group relative inline-block overflow-hidden rounded bg-white px-6 py-3 font-medium text-black shadow transition hover:bg-gray-800 hover:text-white">
            <span className="absolute inset-0 translate-x-full translate-y-full transform rounded-[2px] bg-blue-600 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0"></span>
            <Link href={"/courses/create"} className="relative z-10">
              Create course
            </Link>
          </div>
        </div>
        <div className="mt-8">
          <div className="text-gray-500">
            <p>
              Need help?{" "}
              <a
                href="https://github.com/0xMishra"
                target="_blank"
                className="underline hover:text-gray-200"
              >
                Contact Us
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default dashboardPage;
