import useGlobalStore from "@/config/store/useGlobalStore";
import { Title } from "@mantine/core";
import { ConnectWallet, useThirdwebWallet } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import React from "react";

export default function HomeScreen() {
  
  const router = useRouter();
  const sdk = useThirdwebWallet();
  const setUser = useGlobalStore((state) => state.setUser);
  const user = useGlobalStore((state) => state.user);
  const setLoading = useGlobalStore((state) => state.setLoading);

  React.useEffect(() => {

    if (user) {
      router.replace("/search");
      return;
    }

    if (sdk.connectionStatus === "connected") {
      setUser(sdk.signer.getAddress());
    }
  }, [user, sdk.connectionStatus]);

  return (
    <div className="flex items-center justify-center w-screen h-screen text-black bg-white ">
      <div className="flex flex-col items-center gap-5 ">
        <Title>Connect To Wallet</Title>
        <ConnectWallet />
      </div>
    </div>
  );
}
