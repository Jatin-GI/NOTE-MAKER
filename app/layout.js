import "./globals.css";
import { Outfit } from "next/font/google";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
const outfit = Outfit({
  subsets: ["latin"],
});

export const metadata = {
  title: "Note Maker - AI Powered",
  description: "Effortlessly create and manage notes with the help of AI.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={outfit.className}
          data-liner-extension-version="7.16.6"
          data-new-gr-c-s-check-loaded="14.1229.0"
          data-gr-ext-installed=""
        >
          <ConvexClientProvider>{children}</ConvexClientProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
