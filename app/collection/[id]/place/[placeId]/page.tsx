import Header from "@/components/layout/Header";
import NavigationBar from "@/components/layout/NavigationBar";

const PlaceDetailPage = () => {
  return (
    <div className="relative min-h-screen">
      {/* 이미지 영역 */}
      <div className="fixed top-0 left-0 right-0 w-full aspect-5/3 bg-gray-200 z-0">
        <div className="absolute top-0 left-0 right-0 z-10">
          <Header showBackButton leftBtnBgVariant="glass" />
        </div>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="relative pt-[calc(60%-17px)]">
        <div className="flex flex-col gap-16 pt-7 px-5 rounded-t-2xl bg-background">
          {/* 콘텐츠 */}
        </div>
      </div>

      <NavigationBar className="fixed bottom-0 left-0 right-0 z-50" />
    </div>
  );
};

export default PlaceDetailPage;
