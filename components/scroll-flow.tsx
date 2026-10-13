"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function ScrollFlow({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    (_context, contextSafe) => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce || !contextSafe) return;

      const start = contextSafe(() => {
        gsap.utils.toArray<HTMLElement>("[data-flow='copy']").forEach((element) => {
          gsap.from(element, {
            y: 28,
            ease: "none",
            scrollTrigger: {
              trigger: element,
              start: "top 90%",
              end: "top 68%",
              scrub: 0.65,
            },
          });
        });

        gsap.utils.toArray<HTMLElement>("[data-flow='plate']").forEach((element) => {
          gsap.from(element, {
            y: 64,
            scale: 0.96,
            ease: "none",
            scrollTrigger: {
              trigger: element,
              start: "top 94%",
              end: "top 50%",
              scrub: 0.65,
            },
          });
        });
      });

      if (!document.querySelector(".curtain")) {
        start();
        return;
      }

      const observer = new MutationObserver(() => {
        if (document.querySelector(".curtain")) return;
        observer.disconnect();
        start();
      });
      observer.observe(document.body, { childList: true });
      return () => observer.disconnect();
    },
    { scope, dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <div ref={scope} className="contents">
      {children}
    </div>
  );
}
