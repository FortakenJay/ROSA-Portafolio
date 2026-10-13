"use client";

import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export function Curtain() {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useLayoutEffect(() => {
    if (!visible) return;
    const html = document.documentElement;
    const body = document.body;
    const scrollY = window.scrollY;
    const previousHtml = html.style.overflow;
    const previousBody = body.style.overflow;
    const previousPosition = body.style.position;
    const previousTop = body.style.top;
    const previousWidth = body.style.width;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    const blockScroll = (event: Event) => {
      event.preventDefault();
    };
    const blockKeys = (event: KeyboardEvent) => {
      const scrolling = event.key === " " || event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "PageDown" || event.key === "PageUp" || event.key === "Home" || event.key === "End";
      if (!scrolling) return;
      if (event.target !== document.body && event.target !== document.documentElement) return;
      event.preventDefault();
    };

    window.addEventListener("wheel", blockScroll, { passive: false });
    window.addEventListener("touchmove", blockScroll, { passive: false });
    window.addEventListener("keydown", blockKeys);
    return () => {
      html.style.overflow = previousHtml;
      body.style.overflow = previousBody;
      body.style.position = previousPosition;
      body.style.top = previousTop;
      body.style.width = previousWidth;
      window.scrollTo(0, scrollY);
      window.removeEventListener("wheel", blockScroll);
      window.removeEventListener("touchmove", blockScroll);
      window.removeEventListener("keydown", blockKeys);
    };
  }, [visible]);

  useEffect(() => {
    const node = root.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!node || reduce) {
      setVisible(false);
      return;
    }

    const context = gsap.context(() => {
      gsap
        .timeline({
          defaults: { ease: "power3.inOut" },
          onComplete: () => {
            setVisible(false);
          },
        })
        .from("[data-curtain-name]", { scale: 0.94, duration: 0.7, ease: "power3.out" })
        .from("[data-curtain-rule]", { scaleX: 0, duration: 0.4, transformOrigin: "center" }, "-=0.25")
        .to(node, { clipPath: "inset(0 0 100% 0)", duration: 0.85 }, "+=0.3");
    }, node);

    return () => context.revert();
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={root}
      className="curtain fixed inset-0 z-40 flex touch-none flex-col items-center justify-center overscroll-none bg-primary-200 text-ink"
      aria-hidden="true"
    >
      <p data-curtain-name="true" className="font-display text-6xl leading-[1.1] md:text-7xl">
        Rosa Chen Liang
      </p>
      <span data-curtain-rule="true" className="mt-4 block h-0.5 w-24 bg-rose" />
    </div>
  );
}
