"use client";

import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const roses = [
  { x: 2, y: 2, size: 108, tilt: -8 },
  { x: 18, y: 16, size: 72, tilt: 6 },
  { x: 34, y: 0, size: 64, tilt: -4 },
  { x: 50, y: 4, size: 80, tilt: 10 },
  { x: 68, y: 0, size: 70, tilt: -12 },
  { x: 82, y: 12, size: 104, tilt: 8 },
  { x: 0, y: 28, size: 86, tilt: 14 },
  { x: 86, y: 34, size: 92, tilt: -6 },
  { x: 2, y: 58, size: 78, tilt: -10 },
  { x: 16, y: 74, size: 96, tilt: 4 },
  { x: 36, y: 80, size: 68, tilt: -14 },
  { x: 54, y: 72, size: 110, tilt: 7 },
  { x: 74, y: 64, size: 76, tilt: -5 },
  { x: 84, y: 78, size: 98, tilt: 11 },
];

const fallenPetals = [
  { x: 6, y: 8, w: 18, h: 30, turn: -32 },
  { x: 22, y: 14, w: 14, h: 24, turn: 18 },
  { x: 48, y: 6, w: 16, h: 28, turn: -12 },
  { x: 70, y: 10, w: 20, h: 32, turn: 24 },
  { x: 88, y: 16, w: 15, h: 26, turn: -20 },
  { x: 12, y: 30, w: 17, h: 28, turn: 8 },
  { x: 38, y: 26, w: 13, h: 22, turn: -28 },
  { x: 60, y: 22, w: 19, h: 30, turn: 14 },
  { x: 82, y: 36, w: 16, h: 27, turn: -16 },
  { x: 4, y: 48, w: 21, h: 34, turn: 22 },
  { x: 28, y: 44, w: 14, h: 24, turn: -8 },
  { x: 52, y: 40, w: 18, h: 29, turn: 30 },
  { x: 74, y: 50, w: 15, h: 25, turn: -24 },
  { x: 92, y: 46, w: 17, h: 28, turn: 12 },
  { x: 8, y: 66, w: 16, h: 26, turn: -18 },
  { x: 24, y: 62, w: 20, h: 32, turn: 6 },
  { x: 44, y: 58, w: 14, h: 23, turn: -30 },
  { x: 66, y: 70, w: 18, h: 30, turn: 16 },
  { x: 86, y: 64, w: 15, h: 26, turn: -10 },
  { x: 14, y: 84, w: 19, h: 31, turn: 26 },
  { x: 36, y: 88, w: 16, h: 27, turn: -22 },
  { x: 58, y: 82, w: 13, h: 22, turn: 10 },
  { x: 78, y: 90, w: 20, h: 33, turn: -14 },
  { x: 94, y: 78, w: 15, h: 25, turn: 20 },
];

const outerSpins = [0, 60, 120, 180, 240, 300];
const innerSpins = [30, 150, 270];

function spinOf(_index: number, target: Element) {
  return Number((target as HTMLElement).dataset.spin);
}

function turnOf(_index: number, target: Element) {
  return Number((target as HTMLElement).dataset.turn);
}

function tiltOf(_index: number, target: Element) {
  return Number((target as HTMLElement).dataset.tilt);
}

export function Curtain() {
  const scene = useRef<HTMLDivElement>(null);
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

    gsap.set("[data-petal]", { scale: 0.2, rotation: 0, transformOrigin: "50% 100%" });
    gsap.set("[data-rose]", {
      scale: 0.42,
      rotation: tiltOf,
      transformOrigin: "50% 50%",
    });
    gsap.set("[data-bud]", { scale: 1, opacity: 1, transformOrigin: "50% 50%" });
    gsap.set("[data-fall]", { opacity: 1, y: 0, rotation: turnOf, transformOrigin: "50% 50%" });

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
    const scope = scene.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!node || !scope || reduce) {
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
        .add("rise", "+=0.3")
        .to(node, { clipPath: "inset(0 0 100% 0)", duration: 0.85 }, "rise")
        .to(
          "[data-petal]",
          {
            scale: 1,
            rotation: spinOf,
            duration: 0.9,
            stagger: { amount: 0.25 },
            ease: "power2.out",
            transformOrigin: "50% 100%",
          },
          0,
        )
        .to("[data-rose]", { scale: 1, duration: 0.9, ease: "power2.out", transformOrigin: "50% 50%" }, 0)
        .to("[data-bud]", { scale: 1.2, opacity: 0, duration: 0.7, ease: "power2.in", transformOrigin: "50% 50%" }, 0)
        .to(
          "[data-fall]",
          {
            opacity: 0,
            y: 36,
            rotation: "+=22",
            duration: 0.45,
            stagger: { amount: 0.4, from: "end" },
            ease: "power2.in",
          },
          "rise",
        );
    }, scope);

    return () => context.revert();
  }, []);

  if (!visible) return null;

  return (
    <div ref={scene}>
      <div className="curtain-petals pointer-events-none fixed inset-0 z-30" aria-hidden="true">
        {fallenPetals.map((petal) => (
          <span
            key={`${petal.x}-${petal.y}`}
            data-fall="true"
            data-turn={petal.turn}
            className={`absolute rounded-[50%_50%_50%_50%/70%_70%_30%_30%] ${petal.y % 20 < 10 ? "bg-primary-500" : "bg-primary-600"}`}
            style={{ left: `${petal.x}%`, top: `${petal.y}%`, width: petal.w, height: petal.h }}
          />
        ))}
      </div>
      <div
        ref={root}
        className="curtain fixed inset-0 z-40 flex touch-none flex-col items-center justify-center overscroll-none bg-primary-200 text-ink"
        aria-hidden="true"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {roses.map((rose) => (
            <div
              key={`${rose.x}-${rose.y}`}
              data-rose="true"
              data-tilt={rose.tilt}
              className="absolute"
              style={{ left: `${rose.x}%`, top: `${rose.y}%`, width: rose.size, height: rose.size }}
            >
              {outerSpins.map((spin, index) => (
                <span
                  key={spin}
                  data-petal="true"
                  data-spin={spin}
                  className={`absolute top-[4%] left-[27%] h-[46%] w-[46%] rounded-full ${index % 2 === 0 ? "bg-primary-500" : "bg-primary-600"}`}
                />
              ))}
              {innerSpins.map((spin) => (
                <span
                  key={spin}
                  data-petal="true"
                  data-spin={spin}
                  className="absolute top-[16%] left-[34%] h-[34%] w-[32%] rounded-full bg-primary-400"
                />
              ))}
              <span className="absolute top-1/2 left-1/2 h-[18%] w-[18%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-800" />
              <span data-bud="true" className="absolute top-[8%] left-[30%] h-[78%] w-[40%] rounded-full bg-primary-700" />
            </div>
          ))}
        </div>
        <p data-curtain-name="true" className="relative z-10 font-display text-6xl leading-[1.1] md:text-7xl">
          Rosa Chen Liang
        </p>
        <span data-curtain-rule="true" className="relative z-10 mt-4 block h-0.5 w-24 bg-rose" />
      </div>
    </div>
  );
}
