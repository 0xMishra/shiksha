import { Footer } from "@/components/Footer";
import InfoSidebar from "./_components/InfoSidebar";

const InfoLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <InfoSidebar />
      {children}
      <Footer />
    </div>
  );
};

export default InfoLayout;
