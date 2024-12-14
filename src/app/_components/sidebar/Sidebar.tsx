import Link from "next/link";

import { cn } from "~/lib/utils";

import { AccountMenuItem } from "~/app/_components/account/AccountMenuItem";

import { IconHome } from "@tabler/icons-react";

const sidebarData = [{ link: "/", label: "Home", icon: IconHome }];

// const getActiveFromPath = (path: string) => {
//   return sidebarData.find((item) => path.includes(item.link))?.label;
// };

export default function Sidebar() {
  const isActive = false;

  const links = sidebarData.map((item) => {
    return (
      <Link
        className={cn(
          "flex w-full items-center gap-2 rounded-md p-4 text-sm font-medium text-slate-900 transition-colors duration-200 ease-in-out hover:bg-slate-100 hover:text-slate-900",
          `${isActive ? "bg-slate-200 hover:bg-slate-200" : null}`,
        )}
        data-active={isActive || undefined}
        href={item.link}
        key={item.label}
      >
        <item.icon size={24} stroke={1.5} />
        <span>{item.label}</span>
      </Link>
    );
  });

  return (
    <aside className="h-screen bg-slate-50 shadow-sm">
      <nav className="">
        <div className="flex min-h-screen w-64 flex-col items-start justify-between overflow-hidden p-4 text-sm font-medium">
          <div className="w-full">{links}</div>
          <div className="h-full w-full">
            <AccountMenuItem />
          </div>
        </div>
      </nav>
    </aside>
  );
}
