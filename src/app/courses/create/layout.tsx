import InfoSidebar from "@/app/(info)/_components/InfoSidebar";
import React from "react";

const CreateCourseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <InfoSidebar />
      {children}
    </div>
  );
};

export default CreateCourseLayout;
