import type { Metadata } from "next";
import localFont from "next/font/local";
import { Curtain } from "@/components/curtain";
import { QueryProvider } from "@/components/query-provider";
import { RoutePreview } from "@/components/route-preview";
import { ScrollFlow } from "@/components/scroll-flow";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSite } from "@/lib/cms";
import "./globals.css";

const display = localFont({
  src: "./fonts/yeseva-one-latin-400.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  adjustFontFallback: "Times New Roman",
  variable: "--font-display",
});

const creepyDisplay = localFont({
  src: "./fonts/unifrakturmaguntia-latin-400.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  adjustFontFallback: "Times New Roman",
  variable: "--font-creepy-display",
});

const creepyBody = localFont({
  src: [
    { path: "./fonts/spectral-latin-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/spectral-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  display: "swap",
  adjustFontFallback: "Times New Roman",
  variable: "--font-creepy-body",
});

const body = localFont({
  src: [
    {
      path: "./fonts/petrona-latin.woff2",
      weight: "400 600",
      style: "normal",
    },
    {
      path: "./fonts/petrona-latin-italic.woff2",
      weight: "400 600",
      style: "italic",
    },
  ],
  display: "swap",
  adjustFontFallback: "Times New Roman",
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
    <html lang="en" className={`${display.variable} ${body.variable} ${creepyDisplay.variable} ${creepyBody.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("rosa-curtain")==="seen")document.documentElement.dataset.curtain="seen";if(localStorage.getItem("rosa-look")==="creepy")document.documentElement.dataset.look="creepy"}catch(e){}`,
          }}
        />
        <QueryProvider>
          <Curtain name={name} />
          <ScrollFlow>
            <SiteHeader name={name} />
            <main className="flex-1">
              <RoutePreview>{children}</RoutePreview>
            </main>
            <SiteFooter site={site} />
          </ScrollFlow>
        </QueryProvider>
      </body>
    </html>
  );
}
