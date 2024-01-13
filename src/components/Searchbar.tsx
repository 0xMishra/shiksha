import { Search } from "lucide-react";
import { Button } from "./ui/button";

export const Searchbar = () => {
  return (
    <div className="flex items-center ">
      <input
        type="text"
        placeholder="Search..."
        className="w-[50vw]  max-w-[600px] rounded-l-md border border-gray-300 px-3 py-2 focus:border-lime-900 focus:outline-none"
      />
      <Button
        variant={"primary"}
        className="h-[43px] rounded-l-none rounded-r-md"
      >
        <Search />
      </Button>
    </div>
  );
};
