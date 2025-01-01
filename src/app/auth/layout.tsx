import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

import Image from "next/image";
import { AspectRatio } from "~/app/_components/ui/aspect-ratio";
import { Card, CardContent } from "~/app/_components/ui/card";

import horselg from "~/assets/images/horselg.jpg";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex flex-row">
      <div className="flex-1 shadow-lg">
        <AspectRatio ratio={3 / 4}>
          <Image
            src={horselg}
            alt="Image"
            className="h-full min-h-screen object-cover"
          />
        </AspectRatio>
      </div>
      <div className="flex flex-1 items-center justify-center text-slate-300">
        <Card className="w-3/4 shadow-xl">
          <CardContent className="flex flex-col justify-center gap-4 p-4">
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
