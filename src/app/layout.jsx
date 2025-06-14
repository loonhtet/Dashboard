import { Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Dashboard",
  description: "Reusable Dashboard for Server Side Purpose",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${beVietnam.className} dark antialiased`}>
        <main>
          <NextTopLoader color="#FFFFFF" showSpinner={false} />
          {children}
        </main>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
