import useGlobalStore from "@/config/store/useGlobalStore";
import {
  Accordion,
  Card,
  Divider,
  Loader,
  Modal,
  Skeleton,
  Text,
  Textarea,
  Title
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import {
  useContract,
  useContractRead
} from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import React from "react";
import { Player } from "video-react";
import AcceptOfferButton from "../common/acceptOfferButton";
import BuyButton from "../common/buyButton";
import CancelOfferButton from "../common/cancelOfferButton";
import ChangePriceButton from "../common/changePriceButton";
import DeleteVideoButton from "../common/deleteVideoButton";
import MakeOfferButton from "../common/makeOfferButton";
import OpenForSaleButton from "../common/openFOrSaleButton";
import WatchVideoButton from "../common/watchVideoButton";

export default function Video() {
  
  const { contract } = useContract(
    "0x0C12Bd44b877eb5128b4e9851470F368A6e59c0e"
  );
  const router = useRouter();
  const { id } = router.query;
  const [mainOpened, mainHandler] = useDisclosure(false);
  const [isOwner, setIsOwner] = React.useState(false);
  const user = useGlobalStore((state) => state.user);
  const [openForSale, setOpenForSale] = React.useState(false);

  const { data: videoDetails, isLoading: videoDetailsLoading } =
    useContractRead(contract, "getVideoDetails", [id]);
  const { data: VideoPrice, isLoading: VideoPriceLoading } = useContractRead(
    contract,
    "videoPrices",
    [id]
  );
  const { data: videoOwner, isLoading: videoOwnerLoading } = useContractRead(
    contract,
    "videoOwners",
    [id]
  );
  const { data: videoOpenFlatSale, isLoading: videoOpenFlatSaleLoading } = useContractRead(contract, "videoOpenForFlatSale", [id])
  const { data: getVideoTransactionDetails, isLoading: getVideoTransactionDetailsLoading } = useContractRead(contract, "getVideoTransactionDetails", [id])






  React.useEffect(() => {
    if (videoOwner?.toString()?.toUpperCase() === user?.toUpperCase()) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  }, [videoOwner, user]);



  const details = {
    title: videoDetails ? videoDetails?.title : null,
    description: videoDetails ? videoDetails?.description : null,
    price: VideoPrice ? parseInt(VideoPrice?._hex, 16) : null,
    sampleVideoURL: videoDetails ? videoDetails?.sampleUrl : null,
    mainVideoURL: videoDetails ? videoDetails?.mainUrl : null,
    owner: videoDetails ? videoDetails?.currentOwner : null,
    openForBidding: videoDetails ? videoDetails?.openForFlatSale : false,
    startTime: videoDetails ? parseInt(videoDetails?.startTime?._hex, 16) : null,
    endTime: videoDetails ? parseInt(videoDetails?.endTime?._hex, 16) : null,
  };

  React.useEffect(() => {
    if (videoDetails) {
      if (details?.title === null) {
        setTimeout(() => {
          router.push('/search')
        }, 5000)
      }
    }
    return () => {
      clearTimeout()
    }

  }, [details, videoDetails])

  console.log(videoDetails);

  React.useEffect(() => {
    if (videoDetails) {
      if (new Date(details?.endTime) > new Date()) {
        if (new Date(details?.startTime) < new Date()) {
          setOpenForSale(true);
          return;
        }
      }
      setOpenForSale(false);
    }
  }, [videoOpenFlatSale, videoDetails]);

  if (videoDetailsLoading) {
    return (
      <div className=" relative h-full flex items-center justify-center">
        <Skeleton className=" h-full" />
        <div className=" absolute flex flex-col items-center gap-3 justify-center">
          <Title>
            Fetching Video Details
          </Title>
          <Loader />
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row gap-3">
        <div className="flex w-[70%] flex-col justify-end h-full gap-3">
          <Title>{details?.title}</Title>
          {
            new Date(details?.endTime) > new Date() &&
            openForSale && (
              <>
                <Text color="red">Sale {
                  new Date(details?.endTime) < new Date() &&
                    new Date(details?.startTime) > new Date()
                    ? "Closed"
                    : "Open"
                }</Text>
                <div className="flex gap-3">
                  <div>
                    <Text>Start Time</Text>
                    <DateTimePicker
                      valueFormat="DD MMM YYYY hh:mm A"
                      variant="unstyled"
                      value={new Date(details?.startTime)}
                      readOnly
                    />
                  </div>
                  <div>
                    <Text>End Time</Text>
                    <DateTimePicker
                      valueFormat="DD MMM YYYY hh:mm A"
                      variant="unstyled"
                      value={new Date(details?.endTime)}
                      readOnly
                    />
                  </div>
                </div>

              </>
            )
          }

          <div className="flex gap-3">
            <div>
              <Text>Blockchain</Text>
              <Text>ETH</Text>
            </div>
            <div>
              <Text>Token Standard</Text>
              <Text>ERC-721</Text>
            </div>
            <div>
              <Text>Token ID</Text>
              <Text>{id}</Text>
            </div>
            <div>
              <Text>Price</Text>
              <Text>{
                details?.price
              }</Text>
            </div>
          </div>
          <Text>owner: {details?.owner?.toUpperCase() === user?.toUpperCase() ? "Me" : details?.owner}</Text>

          {getVideoTransactionDetails?.offerers?.length > 0 && (
            <Accordion variant="filled">
              <Accordion.Item value="pastOffers">
                <Accordion.Control>Past Offers</Accordion.Control>
                <Accordion.Panel>
                  <div className="flex flex-col gap-3">

                    {getVideoTransactionDetails?.offerers?.map((_, i) => {
                      return (
                        <Card className=" flex group flex-row items-center gap-3 justify-between">
                          <div>{_} ---- {parseInt(getVideoTransactionDetails?.offerPrices[i]?._hex, 16)}</div>
                          {isOwner && (
                            <AcceptOfferButton newOwner={_} key={"dwnewdckwd"} id={id} minPrice={details?.price} />

                          )}
                        </Card>
                      )
                    })}
                  </div>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>

          )}
          <Textarea
            label="Description"
            variant="unstyled"
            readOnly
            value={details?.description}
            autosize
          />
        </div>
        <Divider orientation="vertical" />
        <div className="w-[30%] flex flex-col gap-3">
          <Card p={0} onClick={mainHandler.open}>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/ktnft-bc.appspot.com/o/sample%20Video%20Image.png?alt=media&token=65bc2fd3-cc2f-4e86-a74b-53007c6a9ecf"
              alt="Sample Video"
              className="w-full rounded-lg aspect-video"
              objectFit="contain"
            />
          </Card>
          {isOwner && (
            <WatchVideoButton key={"dwddwcw"} id={id} url={details?.mainVideoURL} />
          )}
          {isOwner && !openForSale && (
            <OpenForSaleButton key={"dwdwdcw"} id={id} minPrice={details?.price} />
          )}
          {isOwner && (
            <ChangePriceButton key={"dcwdwcdcw"} id={id} minPrice={details?.price} />
          )}
          {!isOwner && !openForSale && (
            <MakeOfferButton key={"dwnckwd"} id={id} minPrice={details?.price} />
          )}

          {!isOwner && openForSale && (
            <BuyButton key={"dwnckwdc"} id={id} minPrice={details?.price} />
            )}

          {!isOwner && getVideoTransactionDetails?.offerers?.map((_, i) => user.toLowerCase() === _.toLowerCase() && (
            <CancelOfferButton key={"dwnckwdcwd"} id={id} />
            ))}
          {isOwner && (
            <DeleteVideoButton key={"dwndwcckwdcwd"} id={id} />
            )}
        </div>
      </div>
      <Divider />
      <Modal
        centered
        size="xl"
        opened={mainOpened}
        onClose={mainHandler.close}
        title="Sample Video"
      >
        <Player
          poster="https://firebasestorage.googleapis.com/v0/b/ktnft-bc.appspot.com/o/sample%20Video%20Image.png?alt=media&token=65bc2fd3-cc2f-4e86-a74b-53007c6a9ecf"
          playsInline
          src={details?.sampleVideoURL}
        />
      </Modal>
    </div>
  );
}
