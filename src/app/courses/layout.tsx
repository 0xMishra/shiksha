import React from "react";
import InfoSidebar from "../(info)/_components/InfoSidebar";

const CourseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <InfoSidebar />
      {children}
    </div>
  );
};

export default CourseLayout;
