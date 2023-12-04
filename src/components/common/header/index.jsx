import { Title } from '@mantine/core';
import { ConnectWallet } from "@thirdweb-dev/react";


export default function MainHeader() {

  return (
    <div className="flex flex-row items-center justify-between w-full ">
      <div>
        <Title className="text-white ">Cooking Video NFT</Title>
      </div>
      <div>
        <ConnectWallet />
      </div>
    </div>
  )
}
