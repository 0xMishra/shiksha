import React from "react";
import { ChaptersListSidebar } from "./_components/ChaptersListSidebar";

const CourseIdLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <ChaptersListSidebar />
      {children}
    </div>
  );
};

export default CourseIdLayout;
