import MainLayout from "@/components/layouts/mainLayout";
import Video from "@/components/video";

export default function VideoScreen() {
  
  return <Video />;
}

VideoScreen.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};
