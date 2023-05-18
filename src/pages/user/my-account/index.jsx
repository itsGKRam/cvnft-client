import MainLayout from "@/components/layouts/mainLayout";
import MyAccount from "@/components/user/myaccount";

export default function MyAccountScreen() {
  
  return <MyAccount />;
}

MyAccountScreen.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};
