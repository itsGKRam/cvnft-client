import { database } from "@/config/firebase";
import useGlobalStore from "@/config/store/useGlobalStore";
import { Title } from "@mantine/core";
import { ConnectWallet, useSDK } from "@thirdweb-dev/react";
import { get, ref, set } from "firebase/database";
import { useRouter } from "next/router";
import React from "react";


export default function HomeScreen() {

  const router = useRouter();
  const sdk = useSDK();
  const setUser = useGlobalStore((state) => state.setUser);
  const user = useGlobalStore((state) => state.user);
  const setLoading = useGlobalStore((state) => state.setLoading);



  React.useEffect(() => {
    setTimeout(() => {
      if (sdk) {

        // if (user) {
        //   router.replace("/search");
        //   return;
        // }


        if (sdk?.signer?._address) {
          const { _address } = sdk?.signer
          console.log(_address);

          // check if user exists in firebase
          get(ref(database, `users/${_address}`)).then((snapshot) => {
            if (snapshot.exists()) {
              const profileData = {
                name: "",
                profilePicURL: "",
                bio: "",
                totalSpent: 0,
                totalVideosWatched: 0,
                address: _address,
              }
              setUser(profileData);
              setLoading(false);
              router.replace("/search");
            } else {
              setLoading(true);
              const profileData = {
                name: "",
                profilePicURL: "",
                bio: "",
                totalSpent: 0,
                totalVideosWatched: 0,
                 address: _address,
              }
              set(ref(database, `users/${_address.toString()}/profile`), profileData).then(() => {
                setUser(profileData);
              }).then(() => {
                const notificationData = {
                  id: new Date().getTime().toString(),
                  title: "Welcome to the platform",
                  description: "Welcome to the platform",
                  type: "unread"

                }
                set(ref(database, `notifications/${_address.toString()}/${notificationData.id}`), notificationData).then(() => {
                  setLoading(false);
                  router.replace("/search");
                }).catch((err) => {
                  console.log(err.message);
                })
              }).catch((err) => {
                console.log(err.message);
              })

            }
          }).catch((err) => {
            console.log(err.message);
          })

          // setLoading(true);
          // const profileData = {
          //   name: "",
          //   profilePicURL: "",
          //   bio: "",
          //   totalSpent: 0,
          //   totalVideosWatched: 0,
          //   _address,
          // }
          // set(ref(database, `users/${_address.toString()}/profile`), profileData).then(() => {
          //   setUser(profileData);
          // }).then(() => {
          //   const notificationData = {
          //     id: new Date().getTime().toString(),
          //     title: "Welcome to the platform",
          //     description: "Welcome to the platform",
          //     type: "unread"

          //   }
          //   set(ref(database, `notifications/${_address.toString()}/${notificationData.id}`), notificationData).then(() => {
          //     setLoading(false);
          //     router.replace("/search");
          //   }).catch((err) => {
          //     console.log(err.message);
          //   })
          // }).catch((err) => {
          //   console.log(err.message);
          // })

        }







        // sdk?.signer?.getAddress().then((address) => {
        //   setLoading(true);
        //   const profileData = {
        //     name: "",
        //     profilePicURL: "",
        //     bio: "",
        //     totalSpent: 0,
        //     totalVideosWatched: 0,
        //     address,
        //   }
        //   set(ref(database, `users/${address.toString()}/profile`), profileData).then(() => {
        //     setUser(profileData);
        //   }).then(() => {
        //     const notificationData = {
        //       id: new Date().getTime().toString(),
        //       title: "Welcome to the platform",
        //       description: "Welcome to the platform",
        //       type: "unread"

        //     }
        //     set(ref(database, `notifications/${address.toString()}/${notificationData.id}`), notificationData).then(() => {
        //       setLoading(false);
        //       router.replace("/search");
        //     }).catch((err) => {
        //       console.log(err.message);
        //     })
        //   }).catch((err) => {
        //     console.log(err.message);
        //   })
        // }).catch((err) => {
        //   console.log(err.message);
        // })
      }
    }, 2000)
  }, [user, sdk]);

  return (
    <div className="flex items-center justify-center w-screen h-screen text-black bg-white ">
      <div className="flex flex-col items-center gap-5 ">
        <Title>Connect To Wallet</Title>
        <ConnectWallet />
      </div>
    </div>
  );
}
