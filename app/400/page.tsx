import ErrorStatusPage from "@/components/common/ErrorStatusPage";
import Error400Illust from "@/public/illust/400.svg";

const BadRequestPage = () => {
  return (
    <ErrorStatusPage
      title="잘못된 요청이에요"
      description={"요청 정보를 다시 확인한 뒤\n다시 시도해 주세요."}
      illustration={<Error400Illust />}
    />
  );
};

export default BadRequestPage;
