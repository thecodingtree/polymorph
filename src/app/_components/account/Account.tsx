import { IconChevronRight } from "@tabler/icons-react";

import { auth } from "~/server/auth";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/app/_components/ui/avatar";

export async function Account() {
  const session = await auth();

  return (
    <div className="grid grid-flow-col justify-start gap-2 overflow-hidden text-sm font-medium">
      {session ? (
        <Avatar>
          <AvatarImage src={session?.user?.image ?? undefined} />
          <AvatarFallback>{`${session?.user?.name?.charAt(0) ?? ""}`}</AvatarFallback>
        </Avatar>
      ) : null}

      <div className="overflow-hidden text-ellipsis">
        <p className="text-start text-sm font-bold">{session?.user?.name}</p>

        <p className="overflow-hidden text-ellipsis text-start text-xs text-slate-400">
          {session?.user?.email}
        </p>
      </div>

      <IconChevronRight size={24} stroke={1.5} />
    </div>
  );
}
