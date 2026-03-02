import ErrorStatusPage from "@/components/common/ErrorStatusPage";
import Error403Illust from "@/public/illust/403.svg";

const ForbiddenPage = () => {
  return (
    <ErrorStatusPage
      title="접근 권한이 없어요"
      description={"이 페이지에 접근할 수 없어요.\n이전 화면으로 돌아가 주세요."}
      illustration={<Error403Illust />}
    />
  );
};

export default ForbiddenPage;
