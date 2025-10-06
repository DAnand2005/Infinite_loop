"use client";

import "../globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import Providers from "@/components/providers";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import SideMenu from "@/components/sideMenu";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const metadata = {
  metadataBase: new URL(
    "https://3000-firebase-foloup-1759652419564.cluster-ulqnojp5endvgve6krhe7klaws.cloudworkstations.dev"
  ),
  title: "InterroAI",
  description: "AI-powered Interviews",
  openGraph: {
    title: "InterroAI",
    description: "AI-powered Interviews",
    siteName: "InterroAI",
    images: [
      {
        url: "/interroai.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  const shouldShowSidebar = !["/sign-in", "/sign-up"].some((path) =>
    pathname.includes(path)
  );

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/interro-ai-favicon.ico" />
      </head>
      <body className={cn(inter.className, "antialiased bg-background")}>
        <ClerkProvider
          signInFallbackRedirectUrl={"/dashboard"}
          afterSignOutUrl={"/sign-in"}
        >
          <Providers>
            <div className="relative min-h-screen flex flex-col">
              {shouldShowSidebar && <Navbar />}
              <div className="flex flex-grow">
                {shouldShowSidebar && (
                  <SideMenu
                    isCollapsed={isSidebarCollapsed}
                    toggleSidebar={toggleSidebar}
                  />
                )}
                <main
                  className={cn(
                    "flex-grow transition-all duration-300",
                    shouldShowSidebar && (isSidebarCollapsed ? "ml-20" : "ml-64")
                  )}
                >
                  <div className="pt-16 h-full">
                    <div className="h-[calc(100vh-4rem)] overflow-auto">
                      {children}
                    </div>
                  </div>
                </main>
              </div>
              <Toaster
                toastOptions={{
                  classNames: {
                    toast: "bg-card",
                    title: "text-foreground",
                    description: "text-muted-foreground",
                    actionButton: "bg-primary text-primary-foreground",
                    cancelButton: "bg-secondary text-secondary-foreground",
                    closeButton: "text-muted-foreground",
                  },
                }}
              />
            </div>
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
