"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

export function Curtain() {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

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
      className="curtain fixed inset-0 z-40 flex flex-col items-center justify-center bg-plum text-lace"
      aria-hidden="true"
    >
      <p data-curtain-name="true" className="font-display text-6xl leading-[1.1] md:text-7xl">
        Rosa
      </p>
      <span data-curtain-rule="true" className="mt-4 block h-0.5 w-24 bg-rose" />
    </div>
  );
}
