import NextAuth from "next-auth";
import { cache } from "react";

import type { Provider } from "next-auth/providers";
import DiscordProvider from "next-auth/providers/discord";

import { authConfig } from "./config";

const providers: Provider[] = [DiscordProvider];

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});

const {
  auth: uncachedAuth,
  handlers,
  signIn,
  signOut,
} = NextAuth({ ...authConfig, providers });

const auth = cache(uncachedAuth);

export { auth, handlers, signIn, signOut };
