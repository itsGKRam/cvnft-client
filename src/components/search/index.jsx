import { database } from "@/config/firebase";
import { Input, SimpleGrid } from "@mantine/core";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { get, ref } from "firebase/database";
import React from "react";
import VideoCard from "../common/videoCard";

export default function SearchVideos() {

  const { contract } = useContract(
    "0x985Cb3ba019f675b8F8CAe08E9DA44411f2e17E4"
  );
  const { data, isLoading } = useContractRead(contract, "getAllVideos");
  const [search, setSearch] = React.useState("");
  const [allVideos, setAllVideos] = React.useState([]);

  React.useEffect(() => {
    get(ref(database, `videos`)).then((snapshot) => {
      if (snapshot.exists()) {
        setAllVideos(Object.values(snapshot.val()));
      } else {
        console.log("No data available");
      }
    }).catch((err) => {
      console.log(err.message);
    })

  }, []);


  return (
    <div className="flex flex-col gap-3">
      <div>
        <Input value={search} onChange={v => setSearch(v.target.value)} variant="filled" placeholder="Search Videos" />
      </div>
      <div className="flex flex-col gap-3">
        <SimpleGrid cols={1}>
          {allVideos?.filter((_) => _.title?.toLowerCase()?.includes(search?.toLowerCase()))?.map((_, i) => _?.title && (
            <VideoCard key={_?._hex} id={_?.id} data={_} />
          ))}
        </SimpleGrid>
      </div>
    </div>
  );
}
