import { Loader2 } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="flex h-[100vh] w-[100vw] items-center justify-center">
      <Loader2
        className="mr-2 h-20 w-20 animate-spin text-lime-900"
        size={100}
      />
    </div>
  );
};

export default Loading;
