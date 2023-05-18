import { Button } from '@mantine/core';
import {
    useContract,
    useContractWrite
} from "@thirdweb-dev/react";
import { useRouter } from 'next/router';

export default function DeleteVideoButton(p) {

    const router = useRouter()
    const { contract } = useContract(
        "0x0C12Bd44b877eb5128b4e9851470F368A6e59c0e"
    );

    const { mutateAsync: deleteVideo, isLoading: deleteVideoLoading } = useContractWrite(contract, "deleteVideo")

    const props = {
        key: p.key,
        id: p.id,
    }


    const deleteVideoFunction = async (v) => {
        if (confirm("Are you sure you want to delete offer?")) {
            try {
                const data = await deleteVideo({ args: [props?.id] });
                router.push('/search')
                console.info("contract call success", data);
                setOpened(false)
            } catch (err) {
                console.error("contract call failure", err);
            }
        } else {
            console.log("do not delete offer")
        }


    }

    return (
        <Button variant="subtle" color="red" loading={deleteVideoLoading} onClick={deleteVideoFunction} >Delete Video</Button>

    )
}
