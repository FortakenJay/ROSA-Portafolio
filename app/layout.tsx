import type { Metadata } from "next";
import { Petrona, Yeseva_One } from "next/font/google";
import { Curtain } from "@/components/curtain";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const display = Yeseva_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Petrona({
  weight: ["400", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "Rosa",
    template: "%s, Rosa",
  },
  description: "Illustration and project reels. Sample portfolio in a cute gothic lolita mood.",
  openGraph: {
    title: "Rosa",
    description: "Illustration and project reels. Sample portfolio in a cute gothic lolita mood.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rosa",
    description: "Illustration and project reels. Sample portfolio in a cute gothic lolita mood.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <Curtain />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
