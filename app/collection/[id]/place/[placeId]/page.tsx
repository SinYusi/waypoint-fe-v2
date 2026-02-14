import Header from "@/components/layout/Header";
import NavigationBar from "@/components/layout/NavigationBar";

const PlaceDetailPage = () => {
  return (
    <div className="relative min-h-screen">
      <Header showBackButton leftBtnBgVariant="glass" />
      <NavigationBar className="fixed bottom-0 left-0 right-0 z-50" />
    </div>
  );
};

export default PlaceDetailPage;
