import Link from "next/link";

import { IconLogout, IconUserEdit } from "@tabler/icons-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/app/_components/ui/popover";

import { Account } from "~/app/_components/account/Account";

export function AccountMenuItem() {
  return (
    <Popover>
      <PopoverTrigger>
        <Account />
      </PopoverTrigger>
      <PopoverContent side="right">
        <div className="flex flex-col">
          <div className="p-2">
            <Link
              href="/profile"
              className="flex w-full flex-row items-center gap-2"
            >
              <IconUserEdit size={24} />
              <div className="">Profile</div>
            </Link>
          </div>
          <div className="p-2">
            <Link href="#" className="flex w-full flex-row items-center gap-2">
              <IconLogout size={24} />
              <div className="">Logout</div>
            </Link>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
