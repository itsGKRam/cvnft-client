import { Button, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import {
    useContract,
    useContractWrite
} from "@thirdweb-dev/react";
import PopOverButton from '../PopOverButton';

export default function MakeOfferButton(p) {
    
    const { contract } = useContract(
        "0x0C12Bd44b877eb5128b4e9851470F368A6e59c0e"
    );

    const { mutateAsync: makeOffer, isLoading: makeOfferLoading } = useContractWrite(contract, "makeOffer")

    const props = {
        key: p.key,
        id: p.id,
        minPrice: p.minPrice,
    }

    const form = useForm({ initialValues: { price: 0 } })

    const makeOfferFunction = async (v) => {
        const { price } = v;

        if (!price) {
            return alert('All fields are required')
        }

        if (price <= props?.minPrice) {
            return alert(`Price should be greater than ${props?.minPrice}`)
        }

        try {
            const data = await makeOffer({
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
        <PopOverButton key={props?.key} buttonText={"Make Offer"}>
            <form
                onSubmit={form.onSubmit(makeOfferFunction)}
                className="flex flex-row items-end gap-3">
                <NumberInput
                    min={props?.minPrice || 0}
                    placeholder={` Offer price should be greater than ${props?.minPrice}`}
                    className="w-full"
                    required
                    value={form.values.price}
                    onChange={v => form.setFieldValue('price', parseInt(v))}
                />
                <Button loading={makeOfferLoading} type="submit" variant="subtle">{"Make"}</Button>
            </form>
        </PopOverButton>
    )
}
