import Header from "@/components/layout/Header";
import NavigationBar from "@/components/layout/NavigationBar";

interface MypageLayoutProps {
  children: React.ReactNode;
}

const MypageLayout = ({ children }: MypageLayoutProps) => {
  return (
    <div>
      <Header
        showNotificationButton
        rightBtnBgVariant="ghost"
        className="fixed top-0 z-10"
      />
      <div>{children}</div>
      <NavigationBar className="fixed bottom-0 left-0 right-0 z-50" />
    </div>
  );
};

export default MypageLayout;
