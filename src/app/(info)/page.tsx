import { Searchbar } from "@/components/Searchbar";

export default function HomePage() {
  return (
    <main className="">
      <div className="mt-4 flex items-center justify-center md:hidden">
        <Searchbar />
      </div>
    </main>
  );
}
