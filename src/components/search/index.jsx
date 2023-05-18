import { Input, SimpleGrid } from "@mantine/core";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import React from "react";
import VideoCard from "../common/videoCard";

export default function SearchVideos() {
  
  const { contract } = useContract(
    "0x0C12Bd44b877eb5128b4e9851470F368A6e59c0e"
  );
  const { data, isLoading } = useContractRead(contract, "getAllVideos");
  const [allVideos, setAllVideos] = React.useState([]);
  const [search, setSearch] = React.useState("");

  // console.log(data);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <Input value={search} onChange={v => setSearch(v.target.value)} variant="filled" placeholder="Search Videos" />
      </div>
      <div className="flex flex-col gap-3">
        <SimpleGrid cols={3}>
          {data?.filter((_) => _.title?.toLowerCase()?.includes(search?.toLowerCase()))?.map((_, i) => _?.title && (
            <VideoCard key={_?._hex} id={i} data={_} />
          ))}
        </SimpleGrid>
      </div>
    </div>
  );
}
