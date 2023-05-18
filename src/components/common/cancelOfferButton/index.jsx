import { Button } from '@mantine/core';
import {
    useContract,
    useContractWrite
} from "@thirdweb-dev/react";

export default function CancelOfferButton(p) {
    
    const { contract } = useContract(
        "0x0C12Bd44b877eb5128b4e9851470F368A6e59c0e"
    );

    const { mutateAsync: cancelOffer, isLoading: cancelOfferLoading } = useContractWrite(contract, "cancelOffer")

    const props = {
        key: p.key,
        id: p.id,
    }


    const cancelOfferFunction = async (v) => {
        if (confirm("Are you sure you want to cancel offer?")) {
            try {
                const data = await cancelOffer({ args: [props?.id] });
                console.info("contract call success", data);
                setOpened(false)
            } catch (err) {
                console.error("contract call failure", err);
            }
        } else {
            console.log("do not cancel offer")
        }

        
    }

    return (
        <Button loading={cancelOfferLoading} onClick={cancelOfferFunction} >Cancel Offer</Button>

    )
}
