const AddChaptersPage = ({
  params,
}: {
  params: {
    courseId: string;
  };
}) => {
  return <div>{params.courseId}</div>;
};

export default AddChaptersPage;
