import { Title } from '@mantine/core';
import { ConnectWallet } from "@thirdweb-dev/react";


export default function MainHeader() {
  
  return (
    <div className=" flex flex-row justify-between w-full items-center">
      <div>
        <Title>KTNFT</Title>
      </div>
      <div>
        <ConnectWallet/>
      </div>
    </div>
  )
}
