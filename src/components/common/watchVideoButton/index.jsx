import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Player } from 'video-react';

export default function WatchVideoButton(p) {
    
    const [opened, { open, close }] = useDisclosure(false);

    const props = {
        key: p.key,
        id: p.id,
        url: p.url,
    }


    return (
        <>
            <Button className="w-full " onClick={open}>
                Watch Video
            </Button>
            <Modal
                centered
                size="xl"
                opened={opened}
                onClose={close}
                title="Sample Video"
            >
                <Player
                    poster="https://firebasestorage.googleapis.com/v0/b/ktnft-bc.appspot.com/o/Slide%2016_9%20-%201.png?alt=media&token=e01af27a-6601-4f75-a900-b83cdd756234"
                    playsInline
                    src={props?.url}
                />
            </Modal>
        </>
    )
}
