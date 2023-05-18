import useGlobalStore from "@/config/store/useGlobalStore";
import { SimpleGrid, Skeleton, Text } from "@mantine/core";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import VideoCard from "../../common/videoCard";

export default function MyAccount() {
  
  const user = useGlobalStore((state) => state.user);
  const { contract } = useContract(
    "0x0C12Bd44b877eb5128b4e9851470F368A6e59c0e"
  );
  const { data: ownerProfit, isLoading: ownerProfitLoading } = useContractRead(contract, "ownerProfit", [user])
  const { data: getAllVideos, isLoading: getAllVideosLoading } = useContractRead(contract, "getAllVideos");

  return (
    <div className="flex flex-row gap-3">
      <div className="flex flex-col w-full gap-3">
        <Skeleton visible={ownerProfitLoading}>

        <Text>Owner Profit : {parseInt(ownerProfit?._hex.replace('0x', ""))}</Text>
        </Skeleton>
        <Text>Logged in User : {user}</Text>
        <div className="flex flex-col gap-3">
          <Skeleton visible={getAllVideosLoading}>

            <SimpleGrid cols={3}>
              {
                getAllVideos?.map((_, i) => (
                  _.currentOwner?.toLowerCase() === user?.toLowerCase() && _?.title &&
                  <VideoCard key={_?._hex} id={i} data={_} />
                ))
              }
            </SimpleGrid>
          </Skeleton>
        </div>
      </div>
      {/* <div className="flex flex-col w-full">2</div> */}
    </div>
  );
}
