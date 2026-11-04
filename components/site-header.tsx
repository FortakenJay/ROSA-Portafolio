"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LookSwitch } from "@/components/look-switch";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/illustration", label: "Illustration" },
  { href: "/about", label: "About" },
];

function isCurrent(pathname: string, href: string) {
  if (href === "/projects") return pathname.startsWith("/projects");
  return pathname === href;
}

export function SiteHeader({ name }: { name: string }) {
  const pathname = usePathname();
  const home = pathname === "/";

  return (
    <header className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 pt-8 pb-6">
      <div className="flex max-w-full flex-wrap items-center justify-center gap-x-4 gap-y-2">
        <Link
          href="/"
          className={`logo-link font-display text-ink transition-[font-size] duration-500 ease-out ${
            home ? "text-6xl md:text-7xl" : "text-3xl md:text-4xl"
          }`}
        >
          {home ? <h1 className="leading-[1.1]">{name}</h1> : <span className="leading-[1.1]">{name}</span>}
        </Link>
        <LookSwitch />
      </div>
      <nav aria-label="Pages" className="mt-4 flex max-w-full flex-wrap items-center justify-center gap-x-2 sm:mt-5 sm:gap-x-6">
        {links.map((link) => {
          const current = isCurrent(pathname, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={current ? "page" : undefined}
              className="nav-link inline-flex min-h-11 items-center font-body text-base leading-none text-ink underline-offset-8 transition-colors duration-300 hover:text-rose aria-[current=page]:underline aria-[current=page]:decoration-2 sm:text-lg"
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
