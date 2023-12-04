import { Button } from '@mantine/core';
import {
    useContract,
    useContractWrite
} from "@thirdweb-dev/react";

export default function CancelOfferButton(p) {

    const { contract } = useContract(
        "0x985Cb3ba019f675b8F8CAe08E9DA44411f2e17E4"
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
