import type { Metadata } from "next";
import { Petrona, Yeseva_One } from "next/font/google";
import { Curtain } from "@/components/curtain";
import { ScrollFlow } from "@/components/scroll-flow";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSite } from "@/lib/cms";
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

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  const name = site?.name || "Rosa Chen Liang";
  const description = site?.description || "";
  return {
    title: {
      default: name,
      template: `%s, ${name}`,
    },
    metadataBase: new URL("https://rosachenliang.com"),
    description,
    openGraph: { title: name, description },
    twitter: { card: "summary_large_image", title: name, description },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const site = await getSite();
  const name = site?.name || "Rosa Chen Liang";

  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <Curtain name={name} />
        <ScrollFlow>
          <SiteHeader name={name} />
          <main className="flex-1">{children}</main>
          <SiteFooter site={site} />
        </ScrollFlow>
      </body>
    </html>
  );
}
