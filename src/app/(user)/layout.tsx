import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "@/components/providers";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://3000-firebase-foloup-1759652419564.cluster-ulqnojp5endvgve6krhe7klaws.cloudworkstations.dev"),
  title: "InterroAI",
  description: "AI powered Interviews",
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
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/interro-ai-favicon.ico" />
      </head>
      <body className={inter.className}>
        <ClerkProvider>
          <Providers>
            {children}
            <Toaster
              toastOptions={{
                classNames: {
                  toast: "bg-white border-2 border-sky-400",
                  title: "text-black",
                  description: "text-red-400",
                  actionButton: "bg-sky-400",
                  cancelButton: "bg-orange-400",
                  closeButton: "bg-lime-400",
                },
              }}
            />
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
