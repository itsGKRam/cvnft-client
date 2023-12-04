import { Button, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import {
    useContract,
    useContractWrite
} from "@thirdweb-dev/react";
import PopOverButton from '../PopOverButton';

export default function BuyButton(p) {

    const { contract } = useContract(
        "0x985Cb3ba019f675b8F8CAe08E9DA44411f2e17E4"
    );

    const { mutateAsync: buyVideoNFT, isLoading: buyVideoNFTLoading } = useContractWrite(contract, "buyVideoNFT")

    const props = {
        key: p.key,
        id: p.id,
        minPrice: p.minPrice,
    }

    const form = useForm({ initialValues: { price: 0 } })

    const buyVideoNFTFunction = async (v) => {
        const { price } = v;

        if (!price) {
            return alert('All fields are required')
        }

        if (price <= props?.minPrice) {
            return alert(`Price should be greater than ${props?.minPrice}`)
        }

        try {
            const data = await buyVideoNFT({
                args: [props?.id], overrides: {
                    value: price
                }
            }, {
                onError: (err) => {
                    alert(err.message)
                },
                onSuccess: (data) => {
                    console.log(data)
                },

            });
            console.info("contract call success", data);
            setOpened(false)
            form.reset()
        } catch (err) {
            console.error("contract call failure", err);
        }
    }

    return (
        <PopOverButton key={props?.key} buttonText={"Buy Video"}>
            <form
                onSubmit={form.onSubmit(buyVideoNFTFunction)}
                className="flex flex-row items-end gap-3">
                <NumberInput
                    min={props?.minPrice + 1}
                    defaultValue={props?.minPrice}
                    placeholder={` Offer price should be greater than ${props?.minPrice}`}
                    className="w-full"
                    required
                    value={form.values.price}
                    onChange={v => form.setFieldValue('price', parseInt(v))}
                />
                <Button loading={buyVideoNFTLoading} type="submit" variant="subtle">Buy</Button>
            </form>
        </PopOverButton>
    )
}
