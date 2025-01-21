"use server";

import { House, ListChecks } from "lucide-react";

import Link from "next/link";

import AccountMenu from "~/app/_components/user/account-menu";

export default async function Navigation() {
  const menuItems = [
    { name: "Home", href: "/", icon: House },
    { name: "Tasks", href: "/tasks", icon: ListChecks },
  ];

  return (
    <nav className="bg-gray-800 text-white">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-semibold">Polymorph</span>
          </div>

          <div className="flex min-w-96 flex-row justify-between">
            <div className="flex items-center space-x-4">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700"
                >
                  <item.icon className="mr-2" size={18} />
                  {item.name}
                </Link>
              ))}
            </div>
            <div>
              <AccountMenu />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
