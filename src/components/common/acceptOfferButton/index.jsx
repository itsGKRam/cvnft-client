import { database } from "@/config/firebase";
import useGlobalStore from '@/config/store/useGlobalStore';
import { Loader, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import {
    useContract,
    useContractWrite
} from "@thirdweb-dev/react";
import { ref, remove, update } from "firebase/database";
import { useRouter } from "next/router";



export default function AcceptOfferButton(p) {
    const user = useGlobalStore((state) => state.user);
    const router = useRouter()

    const { contract } = useContract("0x985Cb3ba019f675b8F8CAe08E9DA44411f2e17E4");
    const { mutateAsync: acceptVideoOffer, isLoading } = useContractWrite(contract, "acceptVideoOffer")

    const { mutateAsync: acceptOffer, isLoading: acceptOfferLoading } = useContractWrite(contract, "acceptOffer")

    const props = {
        key: p?.key,
        id: p?.id,
        offerID: p?.offerID,
        minPrice: p?.minPrice,
        newOwner: p?.newOwner,
        data: p?.data
    }

    console.log(props?.data)

    const form = useForm({ initialValues: { address: "" } })

    const acceptOfferFunction = async () => {
        if (confirm(`Are you sure you want to accept the offer?`)) {
            try {
                // const data = await acceptOffer({ args: [props?.id, props?.newOwner] });
                // console.info("contract call success", data);



                remove(ref(database, `offers/${props?.id}`)).then(() => {
                    update(ref(database, `videos/${props?.id}`), {
                        price: props?.data?.price,
                        owner: props?.data?.offerer
                    }).then(() => {
                        remove(ref(database, `users/${user?.address}/videos/${props?.id}`)).then(async () => {
                            // get OfferID from `offers/${props?.id}/${user?.address}`
                            const data = await acceptVideoOffer({ args: [props?.id, props?.offerID] });
                        }).then(() => {
                            const notificationData = {
                                id: new Date().getTime().toString(),
                                title: "Offer Accepted",
                                description: `Your offer for ${props?.data?.title} has been accepted`,
                                type: "unread"
                            }
                            set(ref(database, `notifications/${props?.newOwner}/${notificationData.id}`), notificationData).then(() => {
                                console.log('Notification created successfully for new owner')
                            }).then(() => {
                                const notificationData2 = {
                                    id: new Date().getTime().toString(),
                                    title: "Offer Accepted",
                                    description: `You accepted ${props?.data?.offerer}'s offer for ${props?.data?.title}`,
                                    type: "unread"
                                }
                                set(ref(database, `notifications/${user?.address}/${notificationData2.id}`), notificationData2).then(() => {
                                    console.log('Notification created successfully for old owner')
                                    setOpened(false)
                                    form.reset()
                                    router.reload()
                                }).catch((err) => {
                                    console.log(err)
                                })
                            })

                        }).catch((err) => {
                            console.log(err)
                        })
                    }).catch((err) => {
                        console.log(err)
                    })

                })




            } catch (err) {
                console.error("contract call failure", err);
            }
        } else {
            alert(`Offer not accepted`)
        }
    }

    return (
        <div className='flex gap-3 '>
            {acceptOfferLoading ? (
                <Loader />
            ) : (
                <Text onClick={acceptOfferFunction} size="xs" className="hidden text-green-500 cursor-pointer group-hover:block">
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
