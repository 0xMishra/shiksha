import InfoSidebar from "./_components/InfoSidebar";

const InfoLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <InfoSidebar />
      {children}
    </div>
  );
};

export default InfoLayout;
