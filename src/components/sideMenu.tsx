"use client";

import React from "react";
import { Briefcase, Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

function SideMenu() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      name: "Interviews",
      icon: <Briefcase className="h-5 w-5" />,
      path: "/dashboard",
      check: () => pathname.endsWith("/dashboard") || pathname.includes("/interviews"),
    },
    {
      name: "Interviewers",
      icon: <Users className="h-5 w-5" />,
      path: "/dashboard/interviewers",
      check: () => pathname.includes("/interviewers"),
    },
  ];

  return (
    <aside className="z-10 w-64 fixed top-16 left-0 h-full bg-card border-r border-border hidden md:flex flex-col">
      <div className="p-4">
        <h2 className="text-sm font-semibold text-muted-foreground tracking-wider">
          NAVIGATION
        </h2>
      </div>
      <nav className="flex-grow px-2">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.path}
            onClick={(e) => {
              e.preventDefault();
              router.push(item.path);
            }}
            className={`flex items-center gap-3 px-4 py-3 my-1 rounded-lg transition-colors cursor-pointer
              ${
                item.check()
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              }
            `}
          >
            {item.icon}
            <span className="font-medium text-sm">{item.name}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}

export default SideMenu;
