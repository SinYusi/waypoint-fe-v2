import Header from "@/components/layout/Header";
import NavigationBar from "@/components/layout/NavigationBar";

const PlaceDetailPage = () => {
  return (
    <div className="relative min-h-screen">
      <div className="fixed top-0 left-0 right-0 w-full aspect-5/3 bg-gray-200 z-0">
        <div className="absolute top-0 left-0 right-0 z-10">
          <Header showBackButton leftBtnBgVariant="glass" />
        </div>
      </div>
      <div className="relative pt-[60%]">
        {/* 스크롤되는 콘텐츠 영역 */}
      </div>
      <NavigationBar className="fixed bottom-0 left-0 right-0 z-50" />
    </div>
  );
};

export default PlaceDetailPage;
