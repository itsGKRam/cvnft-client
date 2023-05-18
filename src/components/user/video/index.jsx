import storage from "@/config/firebase";
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
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useRouter } from "next/router";
import React from "react";

export default function UploadVideo() {
  
  const theme = useMantineTheme();
  const router = useRouter();
  const [sampleVideoProgress, setSampleVideoProgress] = React.useState(0);
  const [mainVideoProgress, setMainVideoProgress] = React.useState(0);
  const [tempSampleVideo, setTempSampleVideo] = React.useState(null);
  const [tempMailVideo, setTempMainVideo] = React.useState(null);

  const { contract } = useContract(
    "0x0C12Bd44b877eb5128b4e9851470F368A6e59c0e"
  );

  const { mutateAsync: mintVideoNFT, isLoading } = useContractWrite(
    contract,
    "mintVideoNFT"
  );

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      sampleVideoURL: null,
      mainVideoURL: null,
      price: null,
    },
  });

  const uploadSampleVideo = () => {
    if (!tempSampleVideo) return;

    const storageRef = ref(storage, `files/${tempSampleVideo?.name}`);
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

    const storageRef = ref(storage, `files/${tempMailVideo?.name}`);
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

  const createVideoFunction = async (val) => {
    const { title, description, sampleVideoURL, mainVideoURL, price } = val;

    if (tempSampleVideo && !sampleVideoURL) {
      return alert("Upload Sample Video");
    }

    if (tempMailVideo && !mainVideoURL) {
      return alert("Upload Main Video");
    }

    if (!title || !description || !sampleVideoURL || !mainVideoURL || !price) {
      return alert("All Fields are required");
    }

    try {
      console.info("Started");
      const data = await mintVideoNFT({
        args: [title, description, sampleVideoURL, mainVideoURL, price],
      });
      console.info("contract call success", data);
      // alert("VideoNFT Created");
      setSampleVideoProgress(0);
      setMainVideoProgress(0);
      setTempSampleVideo(null);
      setTempMainVideo(null);
      form.reset();
      router.push("/search");
    } catch (err) {
      console.error("contract call failure", err);
    }
  };

  return isLoading ? <div className=" relative h-full flex items-center justify-center">
    <Skeleton className=" h-full" />
    <div className=" absolute flex flex-col items-center gap-3 justify-center">
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
        <FileInput
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

