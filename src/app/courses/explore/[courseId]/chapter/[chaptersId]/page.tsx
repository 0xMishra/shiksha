const ChaptersIdPage = ({
  params,
}: {
  params: {
    chaptersId: string;
  };
}) => {
  return <div>{params.chaptersId}</div>;
};

export default ChaptersIdPage;
