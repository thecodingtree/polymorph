import { BackButton } from "~/app/_components/controls/NavButtons";
import Navigation from "~/app/_components/navigation/navigation";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="flex flex-col">
        <Navigation />
        <main className="container mx-auto min-h-screen p-4">
          <div className="min-h-4" />
          {children}
        </main>
      </div>
    </>
  );
}
