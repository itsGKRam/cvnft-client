import MainHeader from "@/components/common/header";
import MainNavBar from "@/components/common/navbar";
import useGlobalStore from "@/config/store/useGlobalStore";
import {
  AppShell,
  Header,
  Navbar
} from "@mantine/core";
import { useRouter } from "next/router";

export default function MainLayout({ children }) {

  const router = useRouter();
  const setUser = useGlobalStore((state) => state.setUser);
  const user = useGlobalStore((state) => state.user);


  // const getAddress = async () => {
  //   const addresses = await sdk?.signer?.getAddress();
  //   if (addresses) {
  //     setUser(addresses);
  //   } else {
  //     if (!sdk?.signer) {
  //       setUser(null);
  //     }
  //     setUser(null);
  //   }
  //   return true;
  // };

  // React.useEffect(() => {
  //   getAddress()
  // }, [sdk.connectionStatus]);

  return (
    <AppShell
      padding="md"
      className="h-screen"
      navbar={
        <Navbar width={{ base: 300 }} p="xs">
          <MainNavBar />
        </Navbar>
      }
      header={
        <Header className="bg-blue-600 " height={80} p="xs">
          <MainHeader />
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      {children ?? <div>Pass Children</div>}
    </AppShell>
  );
}
