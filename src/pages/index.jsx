import { database } from "@/config/firebase";
import useGlobalStore from "@/config/store/useGlobalStore";
import { Title } from "@mantine/core";
import { ConnectWallet, useSDK } from "@thirdweb-dev/react";
import { ref, set } from "firebase/database";
import { useRouter } from "next/router";
import React from "react";


export default function HomeScreen() {

  const router = useRouter();
  const sdk = useSDK();
  const setUser = useGlobalStore((state) => state.setUser);
  const user = useGlobalStore((state) => state.user);
  const setLoading = useGlobalStore((state) => state.setLoading);

  console.log(sdk);


  React.useEffect(() => {

    if (user) {
      router.replace("/search");
      return;
    }


    sdk?.signer?.getAddress().then((address) => {
      setLoading(true);
      const profileData = {
        name: "",
        profilePicURL: "",
        bio: "",
        totalSpent: 0,
        totalVideosWatched: 0,
        address,
      }
      set(ref(database, `users/${address.toString()}/profile`), profileData).then(() => {
        setUser(profileData);
      }).then(() => {
        const notificationData = {
          id: new Date().getTime().toString(),
          title: "Welcome to the platform",
          description: "Welcome to the platform",
          type: "unread"

        }
        set(ref(database, `notifications/${address.toString()}/${notificationData.id}`), notificationData).then(() => {
          setLoading(false);
          router.replace("/search");
        }).catch((err) => {
          console.log(err.message);
        })
      }).catch((err) => {
        console.log(err.message);
      })
    }).catch((err) => {
      console.log(err.message);
    })
  }, [user, sdk?.signer]);

  return (
    <div className="flex items-center justify-center w-screen h-screen text-black bg-white ">
      <div className="flex flex-col items-center gap-5 ">
        <Title>Connect To Wallet</Title>
        <ConnectWallet />
      </div>
    </div>
  );
}
