import Link from "next/link";

import { LogOut } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/app/_components/ui/popover";

import Account from "~/app/_components/user/account";

export default async function AccountMenu() {
  return (
    <Popover>
      <PopoverTrigger>
        <Account />
      </PopoverTrigger>
      <PopoverContent side="bottom">
        <div className="flex flex-col">
          <div className="p-2">
            <Link
              href="/api/auth/signout"
              className="flex w-full flex-row items-center gap-2"
            >
              <LogOut size={24} />
              <div className="">Logout</div>
            </Link>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
