import { Button, Popover } from '@mantine/core';
import React from 'react';

export default function PopOverButton(p) {

    const props = {
        key: p?.key,
        buttonText: p.buttonText,
        children: p.children,
        loading: p.loading ?? false,
        variant: p.variant ?? "filled",
        disabled: p?.disabled ?? false
    }

    const [opened, setOpened] = React.useState(false);


    return (
        <div key={props?.key} className="flex flex-col w-full gap-3 ">
            <Popover opened={opened} onChange={setOpened} width={200} position="bottom" withArrow shadow="md">
                <Popover.Target>
                    <Button disabled={props?.disabled} loading={props?.loading} variant={props?.variant} onClick={() => setOpened((o) => !o)}>{props?.buttonText}</Button>
                </Popover.Target>
                <Popover.Dropdown>
                    {props?.children}
                </Popover.Dropdown>
            </Popover>
        </div>
    )
}
