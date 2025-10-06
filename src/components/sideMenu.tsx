"use client";

import React, { useState } from "react";
import { Briefcase, Users, ChevronLeft, MenuIcon, XIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SideMenuProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

function SideMenu({ isCollapsed, toggleSidebar }: SideMenuProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      name: "Interviews",
      icon: <Briefcase className="h-5 w-5" />,
      path: "/dashboard",
      check: () =>
        pathname.endsWith("/dashboard") || pathname.includes("/interviews"),
    },
    {
      name: "Interviewers",
      icon: <Users className="h-5 w-5" />,
      path: "/dashboard/interviewers",
      check: () => pathname.includes("/interviewers"),
    },
  ];

  return (
    <aside
      className={cn(
        "z-30 fixed top-16 left-0 h-[calc(100vh-4rem)] bg-card border-r border-border flex flex-col transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div
        className={cn(
          "p-4 flex items-center",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        {!isCollapsed && (
          <h2 className="text-sm font-semibold text-muted-foreground tracking-wider">
            NAVIGATION
          </h2>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-lg hover:bg-muted"
        >
          <ChevronLeft
            className={cn(
              "h-6 w-6 transition-transform",
              isCollapsed && "rotate-180"
            )}
          />
        </button>
      </div>
      <nav className="flex-grow px-4">
        {navItems.map((item) => (
          <TooltipProvider key={item.name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(item.path);
                  }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 my-1 rounded-lg transition-colors cursor-pointer",
                    item.check()
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted",
                    isCollapsed && "justify-center"
                  )}
                >
                  {item.icon}
                  {!isCollapsed && (
                    <span className="font-medium text-sm">{item.name}</span>
                  )}
                </a>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  <p>{item.name}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        ))}
      </nav>
    </aside>
  );
}

export default SideMenu;