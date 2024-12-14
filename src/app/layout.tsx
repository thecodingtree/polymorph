import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/app/_components/ui/toaster";

import { cn } from "~/lib/utils";

export const metadata: Metadata = {
  title: "PolyMorph",
  description: "The Last Organization Tool You'll Ever Need",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body
        className={cn(
          "bg-background min-h-screen font-sans antialiased",
          GeistSans.variable,
        )}
      >
        <TRPCReactProvider>{children}</TRPCReactProvider>
        {/* <Analytics /> */}
        <Toaster />
      </body>
    </html>
  );
}
