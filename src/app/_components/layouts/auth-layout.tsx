import Navigation from "~/app/_components/navigation/navigation";
import { HydrateClient } from "~/trpc/server";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <HydrateClient>
      <div className="flex flex-col">
        <Navigation />
        <main className="container mx-auto min-h-screen p-4">
          <div className="min-h-4" />
          {children}
        </main>
      </div>
    </HydrateClient>
  );
}
