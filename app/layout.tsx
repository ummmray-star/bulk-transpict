import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "TranscriptBulk — 100 YouTube Transcripts, One Click",
  description:
    "Paste up to 100 YouTube URLs and download all transcripts instantly. Free, no account required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#050505]">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
