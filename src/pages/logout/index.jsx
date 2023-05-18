import useGlobalStore from "@/config/store/useGlobalStore";
import { Button, Title } from "@mantine/core";
import { useThirdwebWallet } from "@thirdweb-dev/react";
import { useRouter } from "next/router";


export default function LogoutScreen() {
  
  const router = useRouter();
  const sdk = useThirdwebWallet();
  const setUser = useGlobalStore((state) => state.setUser);
  const user = useGlobalStore((state) => state.user);
  const setLoading = useGlobalStore((state) => state.setLoading);


  const disconnectWallet = async () => {
    try {
      setLoading(true);
      if (!user) {
        router.replace("/");
        return;
      }
      await sdk.disconnect();
      setUser(null);
      router.replace("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen text-black bg-white ">
      <div className="flex flex-col items-center gap-5 ">
        <Title>Disconnect from Wallet</Title>
        <Button onClick={disconnectWallet} color="orange">
          Disconnect Metamask
        </Button>
      </div>
    </div>
  );
}