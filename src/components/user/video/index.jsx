import storage, { database } from "@/config/firebase";
import useGlobalStore from "@/config/store/useGlobalStore";
import {
  Button,
  FileInput,
  Loader,
  Skeleton,
  TextInput,
  Textarea,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useContract, useContractWrite } from "@thirdweb-dev/react";
import { ref, set } from "firebase/database";
import { getDownloadURL, ref as sref, uploadBytesResumable } from "firebase/storage";
import { useRouter } from "next/router";
import React from "react";



export default function UploadVideo() {

  const theme = useMantineTheme();
  const router = useRouter();
  const [sampleVideoProgress, setSampleVideoProgress] = React.useState(0);
  const [mainVideoProgress, setMainVideoProgress] = React.useState(0);
  const [tempSampleVideo, setTempSampleVideo] = React.useState(null);
  const [tempMailVideo, setTempMainVideo] = React.useState(null);
  const user = useGlobalStore((state) => state.user);
  const setLoading = useGlobalStore((state) => state.setLoading);

  const { contract } = useContract("0x985Cb3ba019f675b8F8CAe08E9DA44411f2e17E4");
  const { mutateAsync, isLoading, error } = useContractWrite(contract, "mintVideo")



  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      sampleVideoURL: null,
      mainVideoURL: null,
      price: null,
      chef: "",
      cuisineType: "",
    },
  });

  const uploadSampleVideo = () => {
    if (!tempSampleVideo) return;

    const storageRef = sref(storage, `files/${tempSampleVideo?.name}`);
    const uploadTask = uploadBytesResumable(storageRef, tempSampleVideo);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setSampleVideoProgress(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          form.setFieldValue("sampleVideoURL", downloadURL);
        });
      }
    );
  };

  const uploadMainVideo = () => {
    if (!tempMailVideo) return;

    const storageRef = sref(storage, `files/${tempMailVideo?.name}`);
    const uploadTask = uploadBytesResumable(storageRef, tempMailVideo);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setMainVideoProgress(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          form.setFieldValue("mainVideoURL", downloadURL);
        });
      }
    );
  };

  // async function call(_videoId, _price, _royalities) {
  //   console.log("Calling Contract");
  //   try {
  //     console.log("Calling Contract 1");
  //     mintVideo({ args: [_videoId, _price, _royalities] }).then(() => {
  //       console.log("Calling Contract 2");
  //     });
  //   } catch (err) {
  //     console.error("contract call failure", err);
  //   }
  // }

  const createVideoFunction = async (val) => {
    const { title, description, sampleVideoURL, mainVideoURL, price, chef, cuisineType } = val;

    if (tempSampleVideo && !sampleVideoURL) {
      return alert("Upload Sample Video");
    }

    if (tempMailVideo && !mainVideoURL) {
      return alert("Upload Main Video");
    }

    if (!title || !description || !sampleVideoURL || !mainVideoURL || !price) {
      return alert("All Fields are required");
    }


    const videoData = {
      id: new Date().getTime().toString(),
      title,
      description,
      sampleVideoURL,
      mainVideoURL,
      price: parseInt(price),
      chef,
      cuisineType,
      mintingTime: parseInt((new Date()).getTime() / 1000),
      isForSale: false,
      owner: user.address,
      duration: 0,
      views: 0,
    }


    console.log(videoData);
    console.log([parseInt(videoData?.id), parseInt(videoData?.price), 2])







    try {
      setLoading(true);
      set(ref(database, `videos/${videoData.id}`), videoData).then(() => {
        set(ref(database, `users/${user.address}/videos/${videoData.id}`), videoData.title).then(() => {
          const notificationData = {
            id: new Date().getTime().toString(),
            title: "Video Uploaded",
            description: "Video Uploaded Successfully",
            type: "unread"
          }
          set(ref(database, `notifications/${user?.address}/${notificationData.id}`), notificationData).then(async () => {
            setLoading(false);
            const data = await mutateAsync({ args: [parseInt(videoData?.id), parseInt(videoData?.price), 2] });
            console.info("contract call success", data);
            // router.replace("/search");
          }).catch((err) => {
            console.log(err.message);
          })
        }).catch((err) => {
          console.log(err.message);
        })
      }).catch((err) => {
        console.log(err.message);
      })
    } catch (error) {

    }


    try {

      //  string id; // Unique identifier for the video
      //       string title; // Title of the cooking video
      //       string description; // Description or summary of the video content
      //       string sampleVideoURL; // URL to a sample or preview of the video
      //       string mainVideoURL; // URL to the full cooking video
      //       uint256 price; // Price of the video if it's for sale
      //       address owner; // Address of the current owner of the NFT
      //       uint256 mintingTime; // Timestamp when the video was minted as an NFT
      //       string chef; // Name of the chef or creator
      //       string cuisineType; // Type of cuisine (e.g., Italian, Mexican)
      //       uint256 duration; // Duration of the video in seconds
      //       uint256 views; // Number of views
      //       bool isForSale; // Flag to indicate if the video is for sale
      // // Add more fields as necessary




      // console.info("Started");
      // const data = await mintVideoNFT({
      //   args: [title, description, sampleVideoURL, mainVideoURL, price],
      // });
      // console.info("contract call success", data);
      // alert("VideoNFT Created");
      // setSampleVideoProgress(0);
      // setMainVideoProgress(0);
      // setTempSampleVideo(null);
      // setTempMainVideo(null);
      // form.reset();
      // router.push("/search");
    } catch (err) {
      console.error("contract call failure", err);
    }
  };


  if (!contract) {
    console.error("Contract is not loaded yet");
    return <h1>Contract Error</h1>
  } else {
    console.log("Contract Loaded")
  }

  return isLoading ? <div className="relative flex items-center justify-center h-full ">
    <Skeleton className="h-full " />
    <div className="absolute flex flex-col items-center justify-center gap-3 ">
      <Title>
        Creating Contract
      </Title>
      <Loader />
    </div>
  </div> : <div className="flex flex-row gap-3">
    <div className="flex flex-col w-full gap-3">
      <form
        onSubmit={form.onSubmit(createVideoFunction)}
        className="flex flex-col gap-3"
      >

        <TextInput
          required
          className="w-full"
          placeholder="Video Title"
          label="Title"
          {...form.getInputProps("title")}
        />
        <Textarea
          required
          autosize
          className="w-full"
          placeholder="Video Description"
          label="Description"
          {...form.getInputProps("description")}
        />
        <TextInput
          required
          className="w-full"
          placeholder="Cost"
          label="Cost"
          {...form.getInputProps("price")}
        />
        <TextInput
          required
          className="w-full"
          placeholder="Chef"
          label="Chef"
          {...form.getInputProps("chef")}
        />
        <TextInput
          required
          className="w-full"
          placeholder="Cuisine Type"
          label="Cuisine Type"
          {...form.getInputProps("cuisineType")}
        />
        <FileInput
          required
          label="Sample Video"
          onChange={setTempSampleVideo}
          value={tempSampleVideo}
          description={form.getInputProps("sampleVideoURL").value ?? ""}
          placeholder="Upload file"
          accept=".mp4,.webm,video/mp4,video/webm"
          rightSectionWidth={
            sampleVideoProgress > 1 && sampleVideoProgress < 100 ? 125 : 95
          }
          rightSection={
            tempSampleVideo && (
              <Button
                disabled={sampleVideoProgress > 1}
                onClick={uploadSampleVideo}
                compact
              >
                {sampleVideoProgress > 1 &&
                  sampleVideoProgress < 100 &&
                  `Uploading...${sampleVideoProgress}`}
                {sampleVideoProgress === 100 && "Uploaded"}
                {sampleVideoProgress < 1 && "Upload"}
              </Button>
            )
          }
        />
        <FileInput
          required
          label="Main Video"
          onChange={setTempMainVideo}
          value={tempMailVideo}
          description={form.getInputProps("mainVideoURL").value ?? ""}
          placeholder="Upload file"
          accept=".mp4,.webm,video/mp4,video/webm"
          rightSectionWidth={
            mainVideoProgress > 1 && mainVideoProgress < 100 ? 125 : 95
          }
          rightSection={
            tempMailVideo && (
              <Button
                disabled={mainVideoProgress > 1}
                onClick={uploadMainVideo}
                compact
              >
                {mainVideoProgress > 1 &&
                  mainVideoProgress < 100 &&
                  `Uploading...${mainVideoProgress}`}
                {mainVideoProgress === 100 && "Uploaded"}
                {mainVideoProgress < 1 && "Upload"}
              </Button>
            )
          }
        />
        <Button type="submit">Create Video</Button>
      </form>
    </div>
    {/* <div className="flex flex-col w-[30%] gap-3">
        <Text>Demo</Text>
        <VideoCard key="None" values={form.values} buttonDisable={true} />
      </div> */}
  </div>
}

