import ErrorStatusPage from "@/components/common/ErrorStatusPage";
import Error404Illust from "@/public/illust/404.svg";

const NotFoundErrorPage = () => {
  return (
    <ErrorStatusPage
      title="페이지가 존재하지 않습니다."
      description={"여행 일정을 찾을 수 없어요.\n주소가 올바른지 확인해보세요."}
      illustration={<Error404Illust />}
    />
  );
};

export default NotFoundErrorPage;
