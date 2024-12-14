import { signIn, providerMap } from "~/server/auth";

import OAuthSignIn from "~/app/_components/auth/OAuthSignIn";

export default async function LoginPage() {
  return (
    <>
      <div className="flex flex-row items-center justify-center gap-4">
        <h1 className="text-xl">Sign In</h1>
        {providerMap.map((provider) => (
          <div key={provider.name}>
            <form
              action={async () => {
                "use server";
                await signIn(provider.id);
              }}
            >
              <OAuthSignIn id={provider.id} />
            </form>
          </div>
        ))}
      </div>
    </>
  );
}
