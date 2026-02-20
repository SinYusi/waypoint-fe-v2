import Header from "@/components/layout/Header";

interface EditLayoutProps {
  children: React.ReactNode;
}

const EditLayout = ({ children }: EditLayoutProps) => {
  return (
    <div>
      <Header
        variant="center"
        title="회원 정보 수정"
        showBackButton
        leftBtnBgVariant="ghost"
      />
      {children}
    </div>
  );
};

export default EditLayout;
