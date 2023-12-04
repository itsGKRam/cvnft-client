import MainLayout from "@/components/layouts/mainLayout";
import SearchVideos from "@/components/search";


export default function SearchScreen() {

  return <SearchVideos />;
}

SearchScreen.getLayout = function getLayout(page) {
  return <MainLayout>{page}</MainLayout>;
};
