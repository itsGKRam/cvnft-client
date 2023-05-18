import { ActionIcon, Button, Modal, NumberInput } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconClock } from '@tabler/icons-react';
import { useContract, useContractWrite } from '@thirdweb-dev/react';
import { useRef } from 'react';

export default function OpenForSaleButton(p) {
    
    const [opened, { open, close }] = useDisclosure(false);
    const { contract } = useContract(
        "0x0C12Bd44b877eb5128b4e9851470F368A6e59c0e"
    );

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
            startTime: null,
            endTime: null,
            targetPrice: 0,
        },
    });


    const openFlatSaleFunction = async (v) => {
        const { tokenId, startTime, endTime, targetPrice } = v;

        if (!tokenId || !startTime || !endTime || !targetPrice || startTime === null || endTime === null) {
            return alert("All Fields are required");
        }

        try {
            const data = await openFlatSale({ args: [tokenId, startTime.getTime(), endTime.getTime(), parseInt(targetPrice)] });
            console.info("contract call success", data);
            close();
            form.reset();
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
                    <DateTimePicker
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
                    />
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
