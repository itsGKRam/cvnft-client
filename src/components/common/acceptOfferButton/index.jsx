import { Loader, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import {
    useContract,
    useContractWrite
} from "@thirdweb-dev/react";

export default function AcceptOfferButton(p) {
    
    const { contract } = useContract(
        "0x0C12Bd44b877eb5128b4e9851470F368A6e59c0e"
    );

    const { mutateAsync: acceptOffer, isLoading: acceptOfferLoading } = useContractWrite(contract, "acceptOffer")

    const props = {
        key: p.key,
        id: p.id,
        newOwner: p.newOwner,
    }

    const form = useForm({ initialValues: { address: "" } })

    const acceptOfferFunction = async () => {
        if (confirm(`Are you sure you want to accept the offer?`)) {
            try {
                const data = await acceptOffer({ args: [props?.id, props?.newOwner] });
                console.info("contract call success", data);
                setOpened(false)
                form.reset()
            } catch (err) {
                console.error("contract call failure", err);
            }
        } else {
            alert(`Offer not accepted`)
        }
    }

    return (
        <div className=' flex gap-3'>
            {acceptOfferLoading ? (
                <Loader />
            ) : (
                <Text onClick={acceptOfferFunction} size="xs" className=" hidden group-hover:block cursor-pointer text-green-500">
                    Accept Offer
                </Text>
            )}
            {/* <PopOverButton key={props?.key} buttonText={"Accept Offer"}>
                <form
                    onSubmit={form.onSubmit(acceptOfferFunction)}
                    className="flex flex-row items-end gap-3">
                    <TextInput
                        placeholder={`New Owner's Address`}
                        className="w-full"
                        required
                        value={form.values.address}
                        onChange={v => form.setFieldValue('address', parseInt(v))}
                    />
                    <Button loading={acceptOfferLoading} type="submit" variant="subtle">Accept</Button>
                </form>
            </PopOverButton> */}
        </div>
    )
}
