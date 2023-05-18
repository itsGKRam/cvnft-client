import { Button, Title } from "@mantine/core";
import React from "react";

export default function AuthScreen() {
  return (
    <div className=" w-screen h-screen bg-white text-black flex justify-center items-center">
      <div className=" flex flex-col items-center gap-5">
        <Title>Connect To Wallet</Title>
        <Button color="orange">Connect Metamask</Button>
      </div>
    </div>
  );
}
