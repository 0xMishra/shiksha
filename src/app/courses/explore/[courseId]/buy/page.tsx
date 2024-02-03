const BuyCoursePage = ({
  params,
}: {
  params: {
    courseId: string;
  };
}) => {
  return <div>{params.courseId}</div>;
};

export default BuyCoursePage;
