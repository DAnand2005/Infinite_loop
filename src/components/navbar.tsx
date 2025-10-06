"use client";

import Link from "next/link";
import React from "react";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

function Navbar() {
  return (
    <div className="fixed inset-x-0 top-0 bg-card z-40 h-16 py-4 border-b border-border shadow-sm">
      <div className="flex items-center justify-between h-full gap-2 px-4 sm:px-8 mx-auto max-w-screen-2xl">
        <div className="flex items-center gap-4">
          <Link href={"/dashboard"} className="flex items-center gap-2">
            <p className="text-xl font-bold text-foreground">
              Interro<span className="text-primary">AI</span>
            </p>
          </Link>
          <div className="hidden sm:block">
            <OrganizationSwitcher
              hidePersonal={true}
              afterCreateOrganizationUrl="/dashboard"
              afterSelectOrganizationUrl="/dashboard"
              afterLeaveOrganizationUrl="/dashboard"
              appearance={{
                baseTheme: dark,
                elements: {
                  organizationSwitcherTrigger:
                    "focus:shadow-none border-border",
                },
                variables: {
                  colorPrimary: "hsl(217 91% 60%)",
                  colorBackground: "hsl(215 28% 12%)",
                },
              }}
            />
          </div>
        </div>
        <div className="flex items-center">
          <UserButton afterSignOutUrl="/sign-in" appearance={{ baseTheme: dark }} />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
