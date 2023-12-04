import { Button, Card } from "@mantine/core";
import { useContract } from "@thirdweb-dev/react";
import Link from "next/link";
import React from "react";

export default function VideoCard(p) {

  const { contract } = useContract(
    "0x985Cb3ba019f675b8F8CAe08E9DA44411f2e17E4"
  );
  const [videoDetails, setVideoDetails] = React.useState();

  const props = {
    key: p.key,
    id: p.id,
    data: p?.data,
    values: p.values,
    buttonDisable: p.buttonDisable,
  };

  // console.log(props?.data)

  // React.useEffect(() => {
  //   if (props?.id) {
  //     async function Video(id) {
  //       const videoData = await contract.call("videos", [id]);
  //       setVideoDetails(videoData);
  //     }
  //     if (contract) {
  //       Video(props?.id);
  //     }
  //   }
  // }, [props?.id]);

  const details = {
    title: props?.data?.title ?? videoDetails?.title,
    description: props?.data?.description ?? videoDetails?.description,
  };


  return (
    <div key={props?.key}>
      <Card className="flex flex-row gap-3">
        <img
          className="w-40 rounded h-30"
          src="https://firebasestorage.googleapis.com/v0/b/ktnft-bc.appspot.com/o/sample%20Video%20Image.png?alt=media&token=65bc2fd3-cc2f-4e86-a74b-53007c6a9ecf"
        />
        <div className="w-full">{details?.title}</div>
        <div className="flex gap-3">
          {/* <div>
            <Text>Blockchain</Text>
            <Text>ETH</Text>
          </div> */}
          {/* <div>
            <Text>Token Standard</Text>
            <Text>ERC-721</Text>
          </div> */}
          {/* <div>
            <Text>Token ID</Text>
            <Text>{props?.id}</Text>
          </div> */}
          {/* <div>
            <Text>Price</Text>
            <Text>{details?.price}</Text>
          </div> */}
        </div>
        {/* <div>{details?.description}</div> */}
        {!props?.buttonDisable && (
          <Link href={`/video?id=${props?.id}`}>
            <Button className="w-full">View More</Button>
          </Link>
        )}
      </Card>
    </div>
  );
}
