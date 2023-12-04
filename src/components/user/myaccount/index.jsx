import { database } from "@/config/firebase";
import useGlobalStore from "@/config/store/useGlobalStore";
import { Button, Card, Skeleton, Text, Title } from "@mantine/core";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { get, ref, set } from "firebase/database";
import React from "react";
import VideoCard from "../../common/videoCard";

export default function MyAccount() {

  const user = useGlobalStore((state) => state.user);
  const { contract } = useContract(
    "0x985Cb3ba019f675b8F8CAe08E9DA44411f2e17E4"
  );
  const { data: ownerProfit, isLoading: ownerProfitLoading } = useContractRead(contract, "ownerProfit", [user])
  const { data: getAllVideos, isLoading: getAllVideosLoading } = useContractRead(contract, "getAllVideos");
  const [allVideos, setAllVideos] = React.useState([]);
  const [notifications, setNotifications] = React.useState([]);

  React.useEffect(() => {
    get(ref(database, `videos`)).then((snapshot) => {
      if (snapshot.exists()) {
        setAllVideos(Object.values(snapshot.val()))
      } else {
        console.log("No data available");
      }
    }).then(() => {
      get(ref(database, `notifications/${user?.address}`)).then((snapshot) => {
        if (snapshot.exists()) {
          setNotifications(Object.values(snapshot.val()))
        } else {
          console.log("No data available");
        }
      }).catch((err) => {
        console.log(err.message);
      })
    }).catch((err) => {
      console.log(err.message);
    })

  }, []);

  console.log(notifications)

  return (
    <div className="flex flex-row gap-3">
      <div className="flex flex-col w-full gap-3">
        {/* <Skeleton visible={ownerProfitLoading}>
          <Text>Owner Profit : {parseInt(ownerProfit?._hex.replace('0x', ""))}</Text>
        </Skeleton> */}
        <Text>Logged in User : {user?.address}</Text>
        <div className="flex flex-col gap-3">
          <h1>My Videos</h1>
          <Skeleton visible={!allVideos}>
            {
              allVideos?.map((_, i) => (
                _?.owner?.toLowerCase() === user?.address?.toLowerCase() && _?.title &&
                <VideoCard key={_?._hex} id={_?.id} data={_} />
              ))
            }
          </Skeleton>
          <h1>My Notification</h1>
          <div className="flex flex-col gap-3">

            {notifications?.map((_, i) => {
              if (_.type === "unread") {
                return (
                  <Card key={_?.id} className="flex justify-between gap-3">
                    <div>
                      <Title>{_?.title}</Title>
                      <Text>{_?.description}</Text>
                    </div> <div>
                      <Button onClick={() => {
                        get(ref(database, `notifications/${user?.address}/${_?.id}`)).then((snapshot) => {
                          if (snapshot.exists()) {
                            set(ref(database, `notifications/${user?.address}/${_?.id}`), {
                              ...snapshot.val(),
                              type: "read"
                            }).then(() => {
                              // get updated snapshot
                              get(ref(database, `notifications/${user?.address}`)).then((snapshot) => {
                                if (snapshot.exists()) {
                                  setNotifications(Object.values(snapshot.val()))
                                } else {
                                  console.log("No data available");
                                }
                              }).catch((err) => {
                                console.log(err.message);
                              })
                              console.log('Notification marked as read')
                            }).catch((err) => {
                              console.log(err.message);
                            })
                          } else {
                            console.log("No data available");
                          }
                        }).catch((err) => {
                          console.log(err.message);
                        })
                      }}>
                        Mark as Read
                      </Button>
                    </div>
                  </Card>
                )
              }
              return null
            })}
          </div>

        </div>
      </div>
      {/* <div className="flex flex-col w-full">2</div> */}
    </div>
  );
}
