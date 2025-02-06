import { auth } from "~/server/auth";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/app/_components/ui/avatar";

export default async function Account() {
  const session = await auth();

  return (
    <div className="grid grid-flow-col justify-start gap-2 overflow-hidden text-sm font-medium">
      {session && (
        <Avatar>
          <AvatarImage src={session?.user?.image ?? undefined} />
          <AvatarFallback className="bg-white text-black">{`${session?.user?.name?.charAt(0) ?? ""}`}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
