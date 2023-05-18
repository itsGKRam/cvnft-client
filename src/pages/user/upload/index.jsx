import MainLayout from "@/components/layouts/mainLayout";
import UploadVideo from "@/components/user/video";

export default function UploadScreen() {
  
  return <UploadVideo />;
}

UploadScreen.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};
