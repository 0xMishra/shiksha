"use client";
import Link from "next/link";
import React, { useState } from "react";

export const ChaptersListSidebar = ({
  chapters,
}: {
  chapters: { id: number; courseId: string; name: string }[];
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative bg-[#171717] text-white">
      <button
        onClick={toggleSidebar}
        className={`transform cursor-pointer rounded-full bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 px-5 py-2 text-white shadow-lg transition-all duration-300 hover:scale-105${
          isOpen ? "opacity-70" : "opacity-100"
        }`}
      >
        Chapters
      </button>

      <div
        className={`fixed right-0 top-0 z-40 h-screen w-80 transform bg-[#171717] shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-500 ease-in-out`}
      >
        <div className="p-6">
          <h2 className="mb-6 border-b border-gray-700 pb-4 text-center text-xl font-bold">
            Chapters
          </h2>
          <ul className="space-y-4">
            {chapters.map((chapter) => (
              <li key={chapter.id}>
                <Link
                  href={`/courses/${chapter.courseId}/chapters/${chapter.id}`}
                  className="block transform cursor-pointer rounded-lg bg-gray-700 p-3 shadow-md transition-all duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-blue-900 hover:via-blue-800 hover:to-blue-700"
                >
                  {chapter.name.slice(0, 15)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-10 bg-black bg-opacity-50"
        ></div>
      )}
    </div>
  );
};
