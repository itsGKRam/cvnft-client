import { database } from "@/config/firebase";
import useGlobalStore from "@/config/store/useGlobalStore";
import { Button, Modal, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { useContract, useContractWrite } from '@thirdweb-dev/react';
import { ref, set, update } from "firebase/database";
import { useRef } from 'react';



export default function OpenForSaleButton(p) {

    const [opened, { open, close }] = useDisclosure(false);
    const { contract } = useContract("0x985Cb3ba019f675b8F8CAe08E9DA44411f2e17E4");
    const { mutateAsync: setVideoForSale, isLoading } = useContractWrite(contract, "setVideoForSale")
    const user = useGlobalStore((state) => state.user);


    const startRef = useRef();
    const endRef = useRef();

    const props = {
        key: p.key,
        id: p.id,
        minPrice: p.minPrice,
    }

    const { mutateAsync: openFlatSale, isLoading: openFlatSaleLoading } =
        useContractWrite(contract, "openFlatSale");


    const form = useForm({
        initialValues: {
            tokenId: props?.id,
            targetPrice: 0,
        },
    });


    const openFlatSaleFunction = async (v) => {
        const { tokenId, targetPrice } = v;

        if (!tokenId || !targetPrice) {
            return alert("All Fields are required");
        }

        try {
            update(ref(database, `videos/${props?.id}`), {
                isForSale: true,
                bidAmount: targetPrice
            }).then(() => {
                const notificationData = {
                    id: new Date().getTime().toString(),
                    title: "Video Open For Sale",
                    description: `Your video ${props?.id} is now open for sale`,
                    type: "unread"
                }
                set(ref(database, `notifications/${user?.address}/${notificationData.id}`), notificationData).then(() => {
                    console.log('Notification created successfully for new owner')
                }).then(async () => {
                    const data = await setVideoForSale({ args: [parseInt(props?.id), parseInt(targetPrice)] });
                    console.info("contract call success", data);
                    close();
                    form.reset();
                })
            }).catch((err) => {
                console.log(err.message);
            })
        } catch (err) {
            console.error("contract call failure", err);
        }
    };


    return (
        <>
            <Button loading={openFlatSaleLoading} variant={'subtle'} className="w-full " onClick={open}>
                Open For Sale
            </Button>
            <Modal
                centered
                size="xl"
                opened={opened}
                onClose={close}
                title="Open for Sale"
            >
                <form
                    onSubmit={form.onSubmit(openFlatSaleFunction)}
                    className="flex flex-col w-full gap-3"
                >
                    {/* <DateTimePicker
                        label="Pick Start date and time"
                        placeholder="Pick start date and time"
                        required
                        className="w-full"
                        minDate={new Date()}
                        mx="auto"
                        timeInputProps={{
                            ref: startRef,
                            rightSection: (
                                <ActionIcon onClick={() => startRef.current.showPicker()}>
                                    <IconClock size="1rem" stroke={1.5} />
                                </ActionIcon>
                            ),
                        }}
                        {...form.getInputProps("startTime")}
                    />
                    <DateTimePicker
                        label="Pick End date and time"
                        placeholder="Pick end date and time"
                        required
                        className="w-full"
                        minDate={new Date(form.getInputProps("startTime").value)}
                        mx="auto"
                        timeInputProps={{
                            ref: endRef,
                            rightSection: (
                                <ActionIcon onClick={() => endRef.current.showPicker()}>
                                    <IconClock size="1rem" stroke={1.5} />
                                </ActionIcon>
                            ),
                        }}
                        {...form.getInputProps("endTime")}
                    /> */}
                    <NumberInput
                        description={`should be greater than ${props?.minPrice}`}
                        min={props?.minPrice}
                        placeholder="set your target price"
                        label="Target price"
                        className="w-full"
                        required
                        {...form.getInputProps("targetPrice")}
                    />
                    <Button loading={openFlatSaleLoading} type="submit">Open For SALE</Button>
                </form>
            </Modal>
        </>
    )
}
