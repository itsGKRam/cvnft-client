import MainLayout from "@/components/layouts/mainLayout";
import Notification from "@/components/user/notifications";

export default function NotificationScreen() {

  return <Notification />;
}

NotificationScreen.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};
