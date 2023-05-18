import useGlobalStore from "@/config/store/useGlobalStore";
import { Button } from "@mantine/core";
import Link from "next/link";
import React from "react";

export default function MainNavBar() {
  
  const [value, setValue] = React.useState("react");
  const user = useGlobalStore((state) => state.user);

  const menuItems = [
    { label: "Search", value: "search", url: "/search" },
    { label: "Upload", value: "upload", url: "/user/upload" },
    { label: "My Account", value: "my-account", url: "/user/my-account" },
    // { label: "Disconnect Wallet", value: "disconnect-wallet", url: "/logout" },
  ];

  return (
    <div className="flex flex-col gap-3">
      {menuItems.map((_, i) => {
        return _.value !== "disconnect-wallet" ? (
          <Link key={_?.value} href={_?.url}>
            <Button className="w-full" variant="subtle">
              {_?.label}
            </Button>
          </Link>
        ) : (
          user && _.value === "disconnect-wallet" && (
            <Link key={_?.value} href={_?.url}>
              <Button className="w-full" variant="subtle">
                {_?.label}
              </Button>
            </Link>
          )
        );
      })}
    </div>
  );
}
