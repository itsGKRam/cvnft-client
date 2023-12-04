import { database } from "@/config/firebase";
import useGlobalStore from "@/config/store/useGlobalStore";
import {
  Accordion,
  Button,
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
  useContractRead,
  useContractWrite,
  useSDK
} from "@thirdweb-dev/react";
import { get, ref, set, update } from "firebase/database";
import { useRouter } from "next/router";
import React from "react";
import { Player } from "video-react";
import AcceptOfferButton from "../common/acceptOfferButton";
import MakeOfferButton from "../common/makeOfferButton";

import OpenForSaleButton from "../common/openFOrSaleButton";
import WatchVideoButton from "../common/watchVideoButton";



export default function Video() {

  const { contract } = useContract("0x985Cb3ba019f675b8F8CAe08E9DA44411f2e17E4");
  const { mutateAsync: setVideoForNotSale, isLoading } = useContractWrite(contract, "setVideoForNotSale")

  const router = useRouter();
  const { id } = router.query;
  const sdk = useSDK();
  const [mainOpened, mainHandler] = useDisclosure(false);
  const [isOwner, setIsOwner] = React.useState(false);
  const user = useGlobalStore((state) => state.user);
  const [openForSale, setOpenForSale] = React.useState(false);
  const [videoDetails, setVideoDetails] = React.useState();
  const [offerMade, setOfferMade] = React.useState(false);

  // const { data: videoDetails, isLoading: videoDetailsLoading } =
  // useContractRead(contract, "getVideoDetails", [id]);
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

  const [videoOffers, setVideoOffers] = React.useState();



  React.useEffect(() => {
    if (!videoDetails) {
      if (id) {

        get(ref(database, `videos/${id}`)).then((snapshot) => {
          if (snapshot.exists()) {
            setVideoDetails(snapshot.val())
          } else {
            router.push('/search')
          }

        }).catch((err) => {
          console.log(err.message);
        })
      }
    }
  }, [videoDetails, id]);

  React.useEffect(() => {
    if (id) {

      get(ref(database, `offers/${id}`)).then((snapshot) => {
        if (snapshot.exists()) {
          setVideoOffers(Object.values(snapshot.val()))
        }
      }).catch((err) => {
        console.log(err.message);
      })
    }
  }, [id]);


  React.useEffect(() => {
    if (videoOffers) {
      videoOffers.map((_) => {
        if (_?.offerer?.toLowerCase() === user?.address?.toLowerCase()) {
          setOfferMade(true)
        }
      })
    }
  }, [videoOffers]);







  React.useEffect(() => {
    if (videoDetails?.owner?.toUpperCase() === user?.address?.toUpperCase()) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  }, [videoDetails, user]);





  const details = {
    title: videoDetails ? videoDetails?.title : null,
    description: videoDetails ? videoDetails?.description : null,
    price: videoDetails ? videoDetails?.price : null,
    sampleVideoURL: videoDetails ? videoDetails?.sampleUrl : null,
    mainVideoURL: videoDetails ? videoDetails?.mainUrl : null,
    owner: videoDetails ? videoDetails?.owner : null,
    openForBidding: videoDetails ? videoDetails?.isForSale : false,
    startTime: videoDetails ? parseInt(videoDetails?.startTime?._hex, 16) : null,
    endTime: videoDetails ? parseInt(videoDetails?.endTime?._hex, 16) : null,
  };


  console.log(videoDetails);


  // React.useEffect(() => {
  //   if (videoDetails) {
  //     if (details?.title === null) {
  //       setTimeout(() => {
  //         router.push('/search')
  //       }, 5000)
  //     }
  //   }
  //   return () => {
  //     clearTimeout()
  //   }

  // }, [details, videoDetails])

  // console.log(videoDetails);

  // React.useEffect(() => {
  //   if (videoDetails) {
  //     if (new Date(details?.endTime) > new Date()) {
  //       if (new Date(details?.startTime) < new Date()) {
  //         setOpenForSale(true);
  //         return;
  //       }
  //     }
  //     setOpenForSale(false);
  //   }
  // }, [videoOpenFlatSale, videoDetails]);

  if (!videoDetails) {
    return (
      <div className="relative flex items-center justify-center h-full ">
        <Skeleton className="h-full " />
        <div className="absolute flex flex-col items-center justify-center gap-3 ">
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
      <div className="flex flex-row-reverse gap-3">
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
            {/* <div>
              <Text>Blockchain</Text>
              <Text>ETH</Text>
            </div>
            <div>
              <Text>Token Standard</Text>
              <Text>ERC-721</Text>
            </div> */}
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
            {details?.openForBidding && (
              <div>
                <Text>Bid Amount</Text>
                <Text>{
                  videoDetails?.bidAmount
                }</Text>
              </div>
            )}
          </div>
          <Text>owner: {details?.owner?.toUpperCase() === user?.address?.toUpperCase() ? "Me" : details?.owner}</Text>

          {videoOffers?.length > 0 && (
            <Accordion variant="filled">
              <Accordion.Item value="pastOffers">
                <Accordion.Control>Past Offers</Accordion.Control>
                <Accordion.Panel>
                  <div className="flex flex-col gap-3">

                    {videoOffers?.map((_, i) => {
                      return (
                        <Card className="flex flex-row items-center justify-between gap-3 group">
                          <div>{_?.offerer} ---- {parseInt(_?.price)}</div>
                          {isOwner && (
                            <AcceptOfferButton data={_} offerID={_?.offerID} newOwner={_?.offerer} key={"dwnewdckwd"} id={id} minPrice={details?.price} />
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
          {isOwner && !details?.openForBidding && (
            <OpenForSaleButton key={"dwdwdcw"} id={id} minPrice={details?.price} />
          )}
          {isOwner && details?.openForBidding && (
            // <OpenForSaleButton key={"dwdwdcw"} id={id} minPrice={details?.price} />
            <Button onClick={() => {
              update(ref(database, `videos/${id}`), {
                isForSale: false,
                bidAmount: 0
              }).then(() => {
                const notificationData = {
                  id: new Date().getTime().toString(),
                  title: "Video Closed For Sale",
                  description: `Your video ${id} is now closed for sale`,
                  type: "unread"
                }
                set(ref(database, `notifications/${user?.address}/${notificationData.id}`), notificationData).then(() => {
                  console.log('Notification created successfully for new owner')
                })
              }).then(async () => {
                const data = await setVideoForNotSale({ args: [id] });
                if (data) {
                  router.reload()
                }
              }).catch((err) => {
                console.log(err.message);
              })
            }}>Close For SALE</Button>
          )}
          {/* {isOwner && (
            <ChangePriceButton key={"dcwdwcdcw"} id={id} minPrice={details?.price} />
          )} */}
          {!isOwner && details?.openForBidding && (
            <MakeOfferButton disabled={offerMade} key={"dwnckwd"} id={id} minPrice={details?.price} />
          )}

          {/* {!isOwner && openForSale && (
            <BuyButton key={"dwnckwdc"} id={id} minPrice={details?.price} />
          )} */}

          {/* {!isOwner && getVideoTransactionDetails?.offerers?.map((_, i) => user?.address?.toLowerCase() === _.toLowerCase() && (
            <CancelOfferButton key={"dwnckwdcwd"} id={id} />
          ))} */}
          {/* {isOwner && (
            <DeleteVideoButton key={"dwndwcckwdcwd"} id={id} />
          )} */}
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
    </div >
  );
}
