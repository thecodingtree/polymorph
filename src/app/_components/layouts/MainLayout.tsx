import { BackButton } from "~/app/_components/controls/NavButtons";
//import Sidebar from "~/app/_components/sidebar/Sidebar";
//import EntitySearch from '@/components/entities/EntitySearch';

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <header className="flex h-14 flex-row items-center justify-center bg-slate-50 shadow-sm">
        <div className="w-1/2">SEARCH</div>
      </header>
      <div className="flex flex-row">
        {/* <Sidebar /> */}
        <main className="container mx-auto min-h-screen p-4">
          <div className="min-h-4" />
          <BackButton />
          {children}
        </main>
      </div>
    </>
  );
}
