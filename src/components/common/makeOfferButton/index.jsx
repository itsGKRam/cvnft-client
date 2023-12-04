import { database } from '@/config/firebase';
import useGlobalStore from "@/config/store/useGlobalStore";
import { Button, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import {
    useContract,
    useContractWrite
} from "@thirdweb-dev/react";
import { ref, set } from 'firebase/database';
import PopOverButton from '../PopOverButton';


export default function MakeOfferButton(p) {

    const { contract } = useContract("0x985Cb3ba019f675b8F8CAe08E9DA44411f2e17E4");
    const { mutateAsync: offerVideo, isLoading } = useContractWrite(contract, "offerVideo")
    const user = useGlobalStore((state) => state.user);



    const { mutateAsync: makeOffer, isLoading: makeOfferLoading } = useContractWrite(contract, "makeOffer")


    const form = useForm({ initialValues: { price: 0 } })

    const makeOfferFunction = async (v) => {
        const { price } = v;

        if (!price) {
            return alert('All fields are required')
        }

        if (price <= p?.minPrice) {
            return alert(`Price should be greater than ${p?.minPrice}`)
        }

        try {
            const _offerID = `${new Date().getTime().toString()}`;

            set(ref(database, `offers/${p?.id}/${user?.address}/`), {
                VideoId: p?.id,
                offerer: user?.address,
                offerID: _offerID,
                price,
                timestamp: Date.now(),
                accepted: false
            }).then(() => {
                const notificationData = {
                    id: new Date().getTime().toString(),
                    title: "Offer Made",
                    description: `You have made an offer for ${p?.id} for ${price}`,
                    type: "unread"
                }
                set(ref(database, `notifications/${user?.address}/${notificationData.id}`), notificationData).then(() => {
                    console.log('Notification created successfully for new owner')
                }).catch((err) => {
                    console.log(err.message);
                })
            }).then(async () => {
                alert('Offer has been made Successfully')
                const data = await offerVideo({ args: [parseInt(p?.id), parseInt(price), _offerID] });
                setOpened(false)
                form.reset()
            }).catch((err) => {
                console.log(err.message);
            })

            // const data = await makeOffer({
            //     args: [p?.id], overrides: {
            //         value: price
            //     }
            // }, {
            //     onError: (err) => {
            //         alert(err.message)
            //     },
            //     onSuccess: (data) => {
            //         console.log(data)
            //     },

            // });
            // console.info("contract call success", data);
            // setOpened(false)
            // form.reset()
        } catch (err) {
            console.error("contract call failure", err);
        }
    }

    return (
        <PopOverButton disabled={p?.disabled} key={p?.key} buttonText={"Make Offer"}>
            <form
                onSubmit={form.onSubmit(makeOfferFunction)}
                className="flex flex-row items-end gap-3">
                <NumberInput

                    min={p?.minPrice || 0}
                    placeholder={` Offer price should be greater than ${p?.minPrice}`}
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
