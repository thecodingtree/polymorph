import Link from "next/link";

import { auth } from "~/server/auth";

export default async function Main() {
  //const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  if (session?.user) {
    //void api.post.getLatest.prefetch();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-black">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          PolyMorph App
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8"></div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-black">Howdy!</p>

          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-black">
              {session && <span>Logged in as {session.user?.name}</span>}
            </p>
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              {session ? "Sign out" : "Sign in"}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
