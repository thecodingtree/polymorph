import { auth } from "~/server/auth";

import Landing from "~/landing/landing";

export default async function Main() {
  //const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  if (session?.user) {
    //void api.post.getLatest.prefetch();
  }

  return <Landing />;
}
