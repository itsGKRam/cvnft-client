import { Button, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import {
    useContract,
    useContractWrite
} from "@thirdweb-dev/react";
import PopOverButton from '../PopOverButton';

export default function ChangePriceButton(p) {

    const { contract } = useContract(
        "0x985Cb3ba019f675b8F8CAe08E9DA44411f2e17E4"
    );

    const { mutateAsync: changeVideoPrice, isLoading: changeVideoPriceLoading } = useContractWrite(contract, "changeVideoPrice")

    const props = {
        key: p.key,
        id: p.id,
        minPrice: p.minPrice,
    }

    const form = useForm({ initialValues: { price: 0 } })

    const changeVideoPriceFunction = async (v) => {
        const { price } = v;

        if (!price) {
            return alert('All fields are required')
        }

        if (price <= props?.minPrice) {
            return alert(`Price should be greater than ${props?.minPrice}`)
        }

        try {
            const data = await changeVideoPrice({
                args: [props?.id, price],
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
        <PopOverButton loading={changeVideoPriceLoading} variant="subtle" key={props?.key} buttonText={"Change Video Price"}>
            <form
                onSubmit={form.onSubmit(changeVideoPriceFunction)}
                className="flex flex-row items-end gap-3">
                <NumberInput
                    min={props?.minPrice || 0}
                    placeholder={`Price should be greater than ${props?.minPrice}`}
                    className="w-full"
                    required
                    value={form.values.price}
                    onChange={v => form.setFieldValue('price', parseInt(v))}
                />
                <Button loading={changeVideoPriceLoading} type="submit" variant="subtle">Change</Button>
            </form>
        </PopOverButton>
    )
}
